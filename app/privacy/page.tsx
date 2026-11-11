"use client";

import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/page-title";
import { ConsentPreferencesButton } from "@/components/consent-banner";
import { useLanguage } from "@/contexts/language-context";
import { CONSENT_COOKIE } from "@/lib/consent";
import { CONTACT_EMAIL } from "@/lib/verified/contact";

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
      <div className="space-y-2 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  const { t } = useLanguage();
  const p = (key: string) => t(`privacy.${key}`);

  const storage: Array<{ names: string[]; purpose: string; duration: string }> = [
    { names: ["strhub-language"], purpose: p("storage.language"), duration: p("storage.oneYear") },
    { names: [CONSENT_COOKIE], purpose: p("storage.consent"), duration: p("storage.oneYear") },
    { names: ["theme"], purpose: p("storage.theme"), duration: p("storage.untilCleared") },
    {
      names: ["strhub-verified-submit-form"],
      purpose: p("storage.verified"),
      duration: p("storage.untilTabClosed"),
    },
    {
      names: ["_ga", "_ga_07HDMGRYM4"],
      purpose: p("storage.analytics"),
      duration: p("storage.upToTwoYears"),
    },
  ];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <PageTitle title={p("title")} description={p("lead")} />
      <p className="mt-2 text-xs text-muted-foreground">{p("updated")}</p>

      <div className="mt-8 space-y-8">
        <Section heading={p("who.heading")}>
          <p>
            {p("who.body")}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section heading={p("measure.heading")}>
          <p>{p("measure.body")}</p>
        </Section>

        <Section heading={p("when.heading")}>
          <p>{p("when.consentRegion")}</p>
          <p>{p("when.elsewhere")}</p>
        </Section>

        <Section heading={p("storage.heading")}>
          {/* A table from `sm` up; on a phone each row stacks. */}
          <table className="w-full border-collapse text-sm">
            <thead className="hidden sm:table-header-group">
              <tr>
                {[p("storage.name"), p("storage.purpose"), p("storage.duration")].map((h) => (
                  <th
                    key={h}
                    className="border-b px-2 py-2 text-left text-xs font-semibold text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {storage.map((row) => (
                <tr key={row.names[0]} className="block border-b py-2 align-top last:border-0 sm:table-row sm:py-0">
                  <td className="block sm:table-cell sm:whitespace-nowrap sm:px-2 sm:py-2">
                    {row.names.map((name) => (
                      <code
                        key={name}
                        className="mr-1 inline-block rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
                      >
                        {name}
                      </code>
                    ))}
                  </td>
                  <td className="block pt-1 sm:table-cell sm:px-2 sm:py-2">{row.purpose}</td>
                  <td className="block pt-0.5 text-xs sm:table-cell sm:whitespace-nowrap sm:px-2 sm:py-2 sm:text-sm">
                    {row.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section heading={p("videos.heading")}>
          <p>{p("videos.body")}</p>
        </Section>

        <Section heading={p("hosting.heading")}>
          <p>{p("hosting.body")}</p>
        </Section>

        <Section heading={p("rights.heading")}>
          <p>{p("rights.body")}</p>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <ConsentPreferencesButton />
          </Button>
        </Section>
      </div>
    </div>
  );
}
