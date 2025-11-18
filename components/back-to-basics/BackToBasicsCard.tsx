"use client";

import { FileText, Dna, Search, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ClientReadTime,
  ClientTopicsCovered,
  ClientReadArticle,
} from "@/app/basics/client-components";

export type BackToBasicsPost = {
  sys: { id: string };
  fields: {
    title: string;
    summary: string;
    postReadMinutes: number;
    keywords: string[];
    slug?: string;
  };
};

function getIconForPost(keywords: string[]): typeof FileText {
  const keywordString = keywords.join(" ").toLowerCase();

  if (
    keywordString.includes("dna") ||
    keywordString.includes("pcr") ||
    keywordString.includes("str")
  ) {
    return Dna;
  }
  if (
    keywordString.includes("search") ||
    keywordString.includes("terminology")
  ) {
    return Search;
  }
  return FileText;
}

interface BackToBasicsCardProps {
  post: BackToBasicsPost;
}

export function BackToBasicsCard({ post }: BackToBasicsCardProps) {
  const IconComponent = getIconForPost(post.fields.keywords);
  const slug = post.fields.slug || post.sys.id;

  return (
    <Card
      className="border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow flex flex-col h-full"
    >
      <CardHeader className="flex-shrink-0 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
          <IconComponent className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">{post.fields.title}</CardTitle>
        <CardDescription>{post.fields.summary}</CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            {post.fields.postReadMinutes} <ClientReadTime />
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col flex-grow">
        <div className="space-y-2 flex-grow">
          <ClientTopicsCovered />
          <div className="flex flex-wrap gap-2">
            {post.fields.keywords.map((keyword: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
        <Link href={`/basics/${slug}`} className="mt-auto">
          <Button className="w-full">
            <ClientReadArticle />
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

