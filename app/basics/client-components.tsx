"use client";

import { useLanguage } from "@/contexts/language-context";

export function ClientBasicsTitle() {
  const { t } = useLanguage();
  return <>{t("basics.title")}</>;
}

export function ClientBasicsHero() {
  const { t } = useLanguage();
  return (
    <>
      <h2 className="text-4xl font-bold mb-6">{t("basics.subtitle")}</h2>
      <p className="text-xl text-muted-foreground text-pretty">
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

