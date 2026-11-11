/**
 * Serve the original files of a trial straight from its run artifact.
 */
import { type NextRequest, NextResponse } from "next/server";
import { getTrial, getTrialFile, TRIAL_ID_RE } from "@/lib/verified/trial";
import { isTrialFileName } from "@/lib/verified/log-files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const name = request.nextUrl.searchParams.get("name") ?? "";
  if (!TRIAL_ID_RE.test(id) || !isTrialFileName(name)) {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  let bytes = getTrialFile(id, name);
  if (!bytes) {
    await getTrial(id); // fills the cache when the trial has finished
    bytes = getTrialFile(id, name);
  }
  if (!bytes) return NextResponse.json({ ok: false, error: "not available" }, { status: 404 });
  const slug = ((await getTrial(id)).slug ?? id).replace(/[^A-Za-z0-9._-]/g, "-");
  const type = name === "pdf" ? "application/pdf" : name === "html" ? "text/html" : "text/plain";
  const filename = name === "pdf" || name === "html" ? `${slug}.${name}` : `${slug}.${name}.txt`;
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": name === "pdf" ? type : `${type}; charset=utf-8`,
      "Content-Disposition": `${name === "pdf" ? "attachment" : "inline"}; filename="${filename}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
