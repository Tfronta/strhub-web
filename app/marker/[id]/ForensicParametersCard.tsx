import { BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ForensicParameters } from "./forensicParameters";

const COLUMNS = ["N", "Na", "Ho", "He", "MP", "PD", "PIC", "PE"] as const;

/**
 * Forensic parameters of an NGS dataset, one row per population, exactly as the
 * source table prints them: N and Na whole, the rest to four decimals, under the
 * paper's own labels. `description` carries a {citation} placeholder that
 * becomes the link to the publication.
 */
export function ForensicParametersCard({
  title,
  description,
  citation,
  citationUrl,
  populationLabel,
  legend,
  rows,
}: {
  title: string;
  description: string;
  citation: string;
  citationUrl?: string;
  populationLabel: string;
  legend: string;
  rows: Array<{ label: string; color?: string; params: ForensicParameters }>;
}) {
  const [before, after = ""] = description.split("{citation}");
  const format = (key: (typeof COLUMNS)[number], value: number) =>
    key === "N" || key === "Na" ? String(value) : value.toFixed(4);
  return (
    <Card className="border rounded-md shadow-none bg-card">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
        <CardDescription className="text-xs font-normal mt-1">
          {before}
          <a
            href={citationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {citation}
          </a>
          {after}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 space-y-4">
        <div className="border border-border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                    {populationLabel}
                  </th>
                  {COLUMNS.map((key) => (
                    <th
                      key={key}
                      className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={cn(
                      "border-b border-border last:border-b-0",
                      i % 2 === 0 ? "bg-background" : "bg-muted/30",
                    )}
                  >
                    <td className="px-3 py-2 font-medium text-foreground">
                      <span className="flex items-center gap-2">
                        {row.color && (
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: row.color }}
                          />
                        )}
                        {row.label}
                      </span>
                    </td>
                    {COLUMNS.map((key) => (
                      <td
                        key={key}
                        className="px-3 py-2 text-right tabular-nums text-foreground"
                      >
                        {format(key, row.params[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{legend}</p>
      </CardContent>
    </Card>
  );
}
