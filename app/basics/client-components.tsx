"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  BackToBasicsCard,
  type BackToBasicsPost,
} from "@/components/back-to-basics/BackToBasicsCard";
import { Button } from "@/components/ui/button";

export function ClientBasicsTitle() {
  const { t } = useLanguage();
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{t("basics.title")}</h1>
      <p className="text-lg text-muted-foreground text-pretty">
        {t("basics.description")}
      </p>
    </>
  );
}

export function ClientReadTime() {
  const { t } = useLanguage();
  return <>{t("basics.readTime")}</>;
}

export function ClientTopicsCovered() {
  const { t } = useLanguage();
  return (
    <p className="text-sm font-medium text-muted-foreground">
      {t("basics.topicsCovered")}
    </p>
  );
}

export function ClientReadArticle() {
  const { t } = useLanguage();
  return <>{t("basics.readArticle")}</>;
}

const PRIORITY_TITLES = [
  "Understanding Sequencing File Formats: An Introductory Guide",
  "FASTQ files",
];

const prioritizePosts = (posts: BackToBasicsPost[]) => {
  const priorityMap = new Map(
    PRIORITY_TITLES.map((title, index) => [title, index])
  );

  return [...posts].sort((a, b) => {
    const aPriority = priorityMap.get(a.fields.title);
    const bPriority = priorityMap.get(b.fields.title);

    if (aPriority === bPriority) {
      return 0;
    }

    if (aPriority === undefined) {
      return 1;
    }

    if (bPriority === undefined) {
      return -1;
    }

    return aPriority - bPriority;
  });
};

export function ClientBackToBasicsGrid() {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState<BackToBasicsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadPosts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/back-to-basics?locale=${language}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as {
          items: BackToBasicsPost[];
        };

        if (isMounted) {
          setPosts(prioritizePosts(data.items));
        }
      } catch (err) {
        if (controller.signal.aborted || !isMounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load Back to Basics posts."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [language, refreshIndex]);

  const handleRetry = () => setRefreshIndex((value) => value + 1);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        {t("communityHub.recentPosts.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={handleRetry} variant="outline">
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {posts.map((post) => (
        <BackToBasicsCard key={post.sys.id} post={post} />
      ))}
    </div>
  );
}
