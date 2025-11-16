import { BookOpen } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import {
  ClientBasicsTitle,
  ClientBasicsHero,
} from "./client-components";
import { BackToBasicsCard } from "@/components/back-to-basics/BackToBasicsCard";

export default async function BasicsPage() {
  const headersList = headers();
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host");
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (host ? `${protocol}://${host}` : "http://localhost:3000");

  const res = await fetch(new URL("/api/back-to-basics", baseUrl), {
    next: { revalidate: 60 },
  });

  type BackToBasicsPost = {
    sys: { id: string };
    fields: {
      title: string;
      summary: string;
      postReadMinutes: number;
      keywords: string[];
      slug?: string;
    };
  };

  const data = (await res.json()) as { items: BackToBasicsPost[] };
  const { items: posts } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {/* Title translated on client to reflect user selection */}
              <ClientBasicsTitle />
            </h1>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            ← Back to STRhub
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-8 px-4">
        <div className="container mx-auto text-left">
          <ClientBasicsHero />
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pt-8 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {posts.map((post: BackToBasicsPost) => (
              <BackToBasicsCard key={post.sys.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
