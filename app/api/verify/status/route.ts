/**
 * GET /api/verify/status?dispatchId=... — poll a dispatched run.
 *
 * A workflow_dispatch does not return a run id, so the engine surfaces the
 * unique dispatch id via its run-name; we filter the runs list to find it
 * (§10). The UI polls this to show live gate progress and the final link.
 */
import { type NextRequest, NextResponse } from "next/server";
import {
  findRunByDispatchId,
  GitHubConfigError,
  GitHubApiError,
} from "@/lib/verified/github";
import { getByDispatchId } from "@/lib/verified/store";
import { getRejection } from "@/lib/verified/rejection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const dispatchId = request.nextUrl.searchParams.get("dispatchId");
  if (!dispatchId || !/^sv_[a-z0-9_]+$/.test(dispatchId)) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid dispatchId" },
      { status: 400 }
    );
  }

  const record = await getByDispatchId(dispatchId);

  try {
    const run = await findRunByDispatchId(dispatchId);
    if (!run) {
      // The run may not have registered yet right after dispatch.
      return NextResponse.json({
        ok: true,
        state: "pending",
        slug: record?.slug ?? null,
      });
    }

    const completed = run.status === "completed";
    const slug = record?.slug ?? null;

    // A run that stopped before any gate leaves a notice saying what happened
    // and whose fault it is. Fetched only once the run has finished and only
    // when it did not succeed — the poll runs every few seconds, and there is
    // nothing to explain about a run that is still going or that worked.
    const rejection =
      completed && run.conclusion !== "success" && slug
        ? await getRejection(slug, run.html_url)
        : null;

    return NextResponse.json({
      ok: true,
      state: completed ? "completed" : run.status, // queued | in_progress | completed
      conclusion: run.conclusion, // success | failure | cancelled | null
      runUrl: run.html_url,
      startedAt: run.run_started_at ?? run.created_at,
      slug,
      // Absent on an ordinary failed run: the tool ran and did not clear a gate,
      // which the attestation itself reports. This is only for a run that never
      // got that far.
      rejection,
    });
  } catch (e) {
    if (e instanceof GitHubConfigError) {
      return NextResponse.json(
        { ok: false, error: "Server is not configured for submissions yet." },
        { status: 503 }
      );
    }
    if (e instanceof GitHubApiError) {
      return NextResponse.json(
        { ok: false, error: "GitHub API error", status: e.status },
        { status: 502 }
      );
    }
    console.error("verify/status error:", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
