import { NextResponse } from "next/server";

export function retiredRecipeRoute() {
  return NextResponse.json(
    { ok: false, error: "recipe_workflow_retired", url: "/verified/submit" },
    { status: 410 },
  );
}
