"use client";

import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Dna,
  Download,
  Eye,
  FlaskConical,
  Menu,
  Search,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  labelKey: string;
  descriptionKey?: string;
  icon?: LucideIcon;
};

type NavEntry =
  | { kind: "link"; href: string; labelKey: string }
  | { kind: "group"; labelKey: string; items: NavLink[] };

/**
 * Top-level navigation. Groups open as a dropdown on desktop and render as a
 * labelled list in the mobile drawer, so every destination is one tap away.
 */
const NAV: NavEntry[] = [
  { kind: "link", href: "/basics", labelKey: "nav.basics" },
  { kind: "link", href: "/catalog", labelKey: "nav.catalog" },
  {
    kind: "group",
    labelKey: "nav.datasets",
    items: [
      {
        href: "/datasets?tab=explore",
        labelKey: "nav.menu.exploreFrequencies",
        descriptionKey: "nav.menu.exploreFrequenciesDesc",
        icon: BarChart3,
      },
      {
        href: "/datasets?tab=download",
        labelKey: "nav.menu.downloadDatasets",
        descriptionKey: "nav.menu.downloadDatasetsDesc",
        icon: Download,
      },
      {
        href: "/projects",
        labelKey: "nav.menu.referenceProjects",
        descriptionKey: "nav.menu.referenceProjectsDesc",
        icon: BookOpen,
      },
    ],
  },
  {
    kind: "group",
    labelKey: "nav.tools",
    items: [
      {
        href: "/tools/igv-viewer",
        labelKey: "nav.menu.igvViewer",
        descriptionKey: "nav.menu.igvViewerDesc",
        icon: Eye,
      },
      {
        href: "/tools/str-motif-explorer",
        labelKey: "nav.menu.motifExplorer",
        descriptionKey: "nav.menu.motifExplorerDesc",
        icon: Dna,
      },
      {
        href: "/tools/fasta-generator",
        labelKey: "nav.menu.fastaGenerator",
        descriptionKey: "nav.menu.fastaGeneratorDesc",
        icon: FlaskConical,
      },
      {
        href: "/tools",
        labelKey: "nav.menu.toolsCatalog",
        descriptionKey: "nav.menu.toolsCatalogDesc",
        icon: Wrench,
      },
    ],
  },
  { kind: "link", href: "/mix-profiles", labelKey: "nav.mixProfiles" },
  { kind: "link", href: "/community", labelKey: "nav.blog" },
  { kind: "link", href: "/about", labelKey: "nav.about" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const path = href.split("?")[0];
  return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
}

function groupIsActive(pathname: string | null, items: NavLink[]): boolean {
  return items.some((item) => isActive(pathname, item.href));
}

function HeaderSearch({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submit = (event?: FormEvent | KeyboardEvent) => {
    event?.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  // Explicit Enter handling: the popover sits in a portal, so do not rely on
  // implicit form submission alone.
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") submit(event);
  };

  if (compact) {
    return (
      <form onSubmit={submit} className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t("nav.menu.searchPlaceholder")}
          aria-label={t("nav.menu.searchOpen")}
          className="h-10 pl-9"
        />
      </form>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label={t("nav.menu.searchOpen")}
        >
          <Search className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-2">
        <form onSubmit={submit} className="flex items-center gap-2">
          <Input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t("nav.menu.searchPlaceholder")}
            aria-label={t("nav.menu.searchOpen")}
            className="h-9"
          />
          <Button type="submit" size="sm" className="h-9">
            {t("nav.search")}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export function GlobalHeader() {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-0 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" ref={menuRef}>
          <Link href="/" className="flex items-center justify-center gap-1">
            <img
              src="/strhub-isologo.svg"
              alt=""
              className="h-10 w-auto shrink-0 translate-y-px mb-1.5"
              aria-hidden={true}
            />
            <span className="text-2xl font-bold text-gradient">
              {t("home.title")}
            </span>
          </Link>

          <button
            type="button"
            className="lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {mobileOpen && (
            <nav className="absolute left-0 top-full w-full border-b bg-muted backdrop-blur-sm animate-in slide-in-from-top-2 fade-in duration-200 z-50 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
              <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
                <div className="pb-2">
                  <HeaderSearch compact />
                </div>
                {NAV.map((entry) =>
                  entry.kind === "link" ? (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-base font-medium hover:bg-muted hover:text-primary transition-colors",
                        isActive(pathname, entry.href) && "text-primary"
                      )}
                    >
                      {t(entry.labelKey)}
                    </Link>
                  ) : (
                    <div key={entry.labelKey} className="pt-1">
                      <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t(entry.labelKey)}
                      </p>
                      {entry.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 pl-5 text-base font-medium hover:bg-muted hover:text-primary transition-colors",
                            isActive(pathname, item.href) && "text-primary"
                          )}
                        >
                          {item.icon && (
                            <item.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                          )}
                          {t(item.labelKey)}
                        </Link>
                      ))}
                    </div>
                  )
                )}
              </div>
            </nav>
          )}
        </div>

        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            {NAV.map((entry) =>
              entry.kind === "link" ? (
                <NavigationMenuItem key={entry.href}>
                  {/* Classes go on NavigationMenuLink (not the child Link) so they
                      are merged against the component defaults instead of being
                      appended after them: otherwise its text-sm and bg-accent win. */}
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      // flex-row: the component default is flex-col, which left the
                      // label at the top of the box instead of vertically centred.
                      "inline-flex flex-row h-9 items-center justify-center rounded-md px-3 text-base font-medium transition-colors bg-transparent text-foreground",
                      "hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary active:text-primary",
                      "data-[active=true]:bg-transparent data-[active=true]:text-primary",
                      isActive(pathname, entry.href) && "text-primary"
                    )}
                  >
                    <Link href={entry.href}>{t(entry.labelKey)}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={entry.labelKey}>
                  <NavigationMenuTrigger
                    className={cn(
                      // Every state stays transparent: the default trigger paints
                      // bg-accent (teal) with the same teal text on open/focus.
                      "h-9 px-3 text-base font-medium !bg-transparent text-foreground",
                      "hover:text-primary focus:text-primary active:text-primary",
                      "data-[state=open]:text-primary",
                      groupIsActive(pathname, entry.items) && "text-primary"
                    )}
                  >
                    {t(entry.labelKey)}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-0">
                    <ul className="grid w-72 gap-1 p-1">
                      {entry.items.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink
                            asChild
                            className={cn(
                              // Row layout and neutral hover: the default link is
                              // flex-col with bg-accent + white text on hover.
                              "flex flex-row items-start gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                              "text-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground",
                              isActive(pathname, item.href) && "bg-muted/60"
                            )}
                          >
                            <Link href={item.href}>
                              {item.icon && (
                                <item.icon
                                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                                  aria-hidden
                                />
                              )}
                              <span className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium leading-none text-foreground">
                                  {t(item.labelKey)}
                                </span>
                                {item.descriptionKey && (
                                  <span className="text-xs leading-snug text-muted-foreground">
                                    {t(item.descriptionKey)}
                                  </span>
                                )}
                              </span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1">
          <div className="hidden lg:block">
            <HeaderSearch />
          </div>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
