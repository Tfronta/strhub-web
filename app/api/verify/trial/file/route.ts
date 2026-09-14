/**
 * GET /api/verify/trial/file?id=tr_…&name=pdf|html
 *
 * The PDF and the static HTML page a trial produced, straight from its run
 * artifact. The same documents an attestation gets; a trial's reader deserves
 * no less detail about what broke and where.
 */
import { type NextRequest, NextResponse } from "next/server";
import { getTrial, getTrialFile, TRIAL_ID_RE } from "@/lib/verified/trial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const name = request.nextUrl.searchParams.get("name");
  if (!TRIAL_ID_RE.test(id) || (name !== "pdf" && name !== "html")) {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  let bytes = getTrialFile(id, name);
  if (!bytes) {
    await getTrial(id); // fills the cache when the trial has finished
    bytes = getTrialFile(id, name);
  }
  if (!bytes) return NextResponse.json({ ok: false, error: "not available" }, { status: 404 });
  const slug = (await getTrial(id)).slug ?? id;
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": name === "pdf" ? "application/pdf" : "text/html; charset=utf-8",
      "Content-Disposition": `${name === "pdf" ? "attachment" : "inline"}; filename="${slug}.${name}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
