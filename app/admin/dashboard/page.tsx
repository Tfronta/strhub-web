"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Database,
  Plus,
  Edit,
  Trash2,
  LogOut,
  FileText,
  Users,
  BookOpen,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MarkdownEditor } from "@/components/markdown-editor";
import { IssueDraftDialog } from "@/components/verified/issue-draft-dialog";

interface VerifiedSubmission {
  slug: string;
  repo: string;
  ref: string;
  createdAt: string;
  status: "dispatched" | "approved-pending" | "rejected";
  toolName: string;
  dispatchId: string;
}

/** One published attestation, as the public catalogue lists it. */
interface CatalogueEntry {
  slug: string;
  name: string;
  level: string;
  label: string;
  generated: string | null;
  errors_reported?: boolean;
}

const VERIFIED_BASE =
  process.env.NEXT_PUBLIC_VERIFIED_BASE ??
  "https://raw.githubusercontent.com/Tfronta/strhub-verified/gh-pages";

interface ContentEntry {
  id: string;
  title: string;
  content: string;
  category: "Blog" | "Projects" | "Educational";
  date: string;
  published: boolean;
}

/** Carries the HTTP status out of a failed load so the banner can name the cause. */
class HttpError extends Error {
  status: number;
  constructor(status: number) {
    super(`HTTP ${status}`);
    this.status = status;
  }
}

/**
 * A failed admin load must never render as an empty list.
 *
 * Both loaders used to do `setX(data.items || [])` without checking `res.ok`. A
 * 401 body parses fine, so an expired token produced exactly the same screen as
 * "nothing pending" — a tool waiting for approval looked like no tool at all, and
 * the only signal was in the console.
 */
function loadErrorMessage(error: unknown): string {
  if (error instanceof HttpError && error.status === 401) {
    return "Tu sesión expiró o el token ya no es válido. Cierra sesión y vuelve a entrar.";
  }
  const detail = error instanceof HttpError ? ` (HTTP ${error.status})` : "";
  return `No se pudieron cargar los datos${detail}. Esto NO significa que la lista esté vacía.`;
}

export default function AdminDashboard() {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [entriesError, setEntriesError] = useState<string | null>(null);
  const [verifiedSubmissions, setVerifiedSubmissions] = useState<VerifiedSubmission[]>([]);
  const [verifiedError, setVerifiedError] = useState<string | null>(null);
  const [approvingSlug, setApprovingSlug] = useState<string | null>(null);
  const [rejectingSlug, setRejectingSlug] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ContentEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Every published attestation, for the issue drafts below. Read from the same
  // public catalogue the site itself renders, not from the submissions store:
  // the tools worth writing to a maintainer about are mostly ones STRhub
  // submitted by hand, which never passed through the form.
  const [catalogue, setCatalogue] = useState<CatalogueEntry[]>([]);
  const [draftSlug, setDraftSlug] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"Blog" | "Projects" | "Educational">(
    "Blog"
  );

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }
    loadEntries();
    loadVerifiedSubmissions();
    loadCatalogue();
  }, [router]);

  const loadCatalogue = async () => {
    try {
      const res = await fetch(`${VERIFIED_BASE}/index.json`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setCatalogue(Array.isArray(data.tools) ? data.tools : []);
    } catch {
      // Optional: without it the drafts card simply has nothing to list.
    }
  };

  const loadEntries = async () => {
    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch("/api/admin/content", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new HttpError(res.status);
      const raw = await res.text();
      const data = JSON.parse(raw);
      setEntries(data.entries || []);
      setEntriesError(null);
    } catch (error) {
      console.error("Failed to load entries:", error);
      setEntries([]);
      setEntriesError(loadErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const loadVerifiedSubmissions = async () => {
    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch("/api/verify/submissions?status=pending", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new HttpError(res.status);
      const data = await res.json();
      setVerifiedSubmissions(data.submissions || []);
      setVerifiedError(null);
    } catch (error) {
      console.error("Failed to load verified submissions:", error);
      setVerifiedSubmissions([]);
      setVerifiedError(loadErrorMessage(error));
    }
  };

  const handleApprove = async (sub: VerifiedSubmission) => {
    setApprovingSlug(sub.slug);
    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch("/api/verify/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ repo: sub.repo, slug: sub.slug }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      await loadVerifiedSubmissions();
    } catch (err: any) {
      alert("Error al aprobar: " + (err?.message || "Error desconocido"));
    } finally {
      setApprovingSlug(null);
    }
  };

  const handleReject = async (sub: VerifiedSubmission) => {
    if (!confirm(`¿Rechazar la submission de "${sub.toolName}"?`)) return;
    setRejectingSlug(sub.slug);
    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch("/api/verify/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slug: sub.slug }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      await loadVerifiedSubmissions();
    } catch (err: any) {
      alert("Error al rechazar: " + (err?.message || "Error desconocido"));
    } finally {
      setRejectingSlug(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("Blog");
    setEditingEntry(null);
  };

  // ✅ Corregido: regex correcta + leer respuesta solo 1 vez
  async function handleCreate() {
    if (!title.trim() || !content.trim()) return;
    try {
      const token = localStorage.getItem("admin_token") || "";
      const contentSafe = content.replace(/\(attachment:[^)]+\)/g, "");

      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: contentSafe,
          category,
          published: true,
        }),
      });

      const raw = await response.text();
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        data = { ok: false, error: raw };
      }

      if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || `HTTP ${response.status}`);
      }

      await loadEntries();
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Failed to create entry:", error?.message || error);
      alert("Failed to create entry: " + (error?.message || "Unknown error"));
    }
  }

  const handleEdit = async () => {
    if (!editingEntry || !title.trim() || !content.trim()) return;
    try {
      const token = localStorage.getItem("admin_token") || "";
      const response = await fetch(`/api/admin/content/${editingEntry.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          published: true,
        }),
      });

      const raw = await response.text();
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        data = { ok: false, error: raw };
      }

      if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || `HTTP ${response.status}`);
      }

      await loadEntries();
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Failed to update entry:", error?.message || error);
      alert("Failed to update entry: " + (error?.message || "Unknown error"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      const token = localStorage.getItem("admin_token") || "";
      const response = await fetch(`/api/admin/content/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = await response.text();
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        data = { ok: false, error: raw };
      }

      if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || `HTTP ${response.status}`);
      }

      await loadEntries();
    } catch (error: any) {
      console.error("Failed to delete entry:", error?.message || error);
      alert("Failed to delete entry: " + (error?.message || "Unknown error"));
    }
  };

  const openEditDialog = (entry: ContentEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setCategory(entry.category);
    setIsEditDialogOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Blog":
        return <FileText className="h-4 w-4" />;
      case "Projects":
        return <Users className="h-4 w-4" />;
      case "Educational":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryStats = () => {
    const stats = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      Blog: stats.Blog || 0,
      Projects: stats.Projects || 0,
      Educational: stats.Educational || 0,
      Total: entries.length,
    };
  };

  const stats = getCategoryStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-6 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Database className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">STRhub Admin</h1>
            <p className="text-sm text-muted-foreground">
              Content Management System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            View Site
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Verified Approvals */}
        {(() => {
          const pending = verifiedSubmissions.filter((s) => s.status === "approved-pending");
          const recent = verifiedSubmissions.filter((s) => s.status !== "approved-pending").slice(0, 5);
          return (
            <Card className="mb-8 border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>Verified — Aprobaciones pendientes</CardTitle>
                    {pending.length > 0 && (
                      <Badge variant="destructive" className="ml-1">
                        {pending.length}
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={loadVerifiedSubmissions}>
                    Actualizar
                  </Button>
                </div>
                <CardDescription>
                  Tools nuevas que esperan tu aprobación. Al aprobar, se dispara el run automáticamente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {verifiedError ? (
                  <p className="text-sm text-destructive py-4 text-center">
                    {verifiedError}
                  </p>
                ) : pending.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No hay submissions pendientes.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tool</TableHead>
                        <TableHead>Repo</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pending.map((sub) => (
                        <TableRow key={sub.slug}>
                          <TableCell>
                            <div className="font-medium">{sub.toolName}</div>
                            <div className="text-xs text-muted-foreground font-mono">{sub.slug}</div>
                          </TableCell>
                          <TableCell>
                            <a
                              href={sub.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              {sub.repo.replace("https://github.com/", "")}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <div className="text-xs text-muted-foreground font-mono">@{sub.ref}</div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(sub.createdAt).toLocaleString("es-AR")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(sub)}
                                disabled={approvingSlug === sub.slug}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {approvingSlug === sub.slug ? "Aprobando…" : "Aprobar & Run"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(sub)}
                                disabled={rejectingSlug === sub.slug}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rechazar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {recent.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Runs recientes
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tool</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Fecha</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recent.map((sub) => (
                          <TableRow key={sub.slug + sub.createdAt}>
                            <TableCell>
                              <div className="text-sm font-medium">{sub.toolName}</div>
                              <div className="text-xs text-muted-foreground font-mono">{sub.slug}</div>
                            </TableCell>
                            <TableCell>
                              {sub.status === "dispatched" ? (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Dispatched
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-red-500 border-red-500">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Rechazado
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(sub.createdAt).toLocaleString("es-AR")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()}

        {/* Issue drafts. Deliberately a drafting table and nothing more: the
            "Abrir en GitHub" button in the dialog prefills GitHub's own form in
            your session, and you press Submit. Nothing here posts to anybody's
            repository, and nothing should ever be added that does. */}
        {catalogue.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Verified — Borradores de issue</CardTitle>
              </div>
              <CardDescription>
                Lo que una corrida encontró, redactado para quien mantiene la
                herramienta. Se revisa acá y se manda a mano, o no se manda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Herramienta</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Verificado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalogue.map((entry) => (
                    <TableRow key={entry.slug}>
                      <TableCell>
                        <div className="text-sm font-medium">{entry.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {entry.slug}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {entry.label}
                        {entry.errors_reported && (
                          <Badge variant="outline" className="ml-2 border-amber-500 text-amber-600">
                            errores
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {entry.generated?.slice(0, 10) ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDraftSlug(entry.slug)}
                        >
                          <FileText className="mr-1 h-4 w-4" />
                          Redactar issue
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <IssueDraftDialog
          slug={draftSlug}
          open={draftSlug !== null}
          onOpenChange={(open) => !open && setDraftSlug(null)}
        />

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entries
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.Total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.Blog}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.Projects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Educational</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.Educational}</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Content Entries</CardTitle>
                <CardDescription>
                  Manage blog posts, projects, and educational content
                </CardDescription>
              </div>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Entry</DialogTitle>
                    <DialogDescription>
                      Add a new content entry to your site
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-title">Title</Label>
                      <Input
                        id="create-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-category">Category</Label>
                      <Select
                        value={category}
                        onValueChange={(value: any) => setCategory(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Blog">Blog</SelectItem>
                          <SelectItem value="Projects">Projects</SelectItem>
                          <SelectItem value="Educational">
                            Educational
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-content">Content</Label>
                      <MarkdownEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Enter content using Markdown..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create Entry</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entriesError ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-destructive">
                      {entriesError}
                    </TableCell>
                  </TableRow>
                ) : entries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No content entries yet. Create your first entry to get
                      started.
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {entry.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(entry.category)}
                          {entry.category}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Entry</DialogTitle>
              <DialogDescription>Update the content entry</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value: any) => setCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Blog">Blog</SelectItem>
                    <SelectItem value="Projects">Projects</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Enter content using Markdown..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEdit}>Update Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
