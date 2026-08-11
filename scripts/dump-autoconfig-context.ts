import { gatherRepoContext, renderContext } from "../lib/verified/autoconfig-context";
import { AutoConfigError } from "../lib/verified/autoconfig-errors";

async function main(): Promise<void> {
  const [repo, ref] = process.argv.slice(2);
  if (!repo || !ref) {
    console.error("usage: tsx scripts/dump-autoconfig-context.ts <repo-url> <ref>");
    process.exit(2);
  }

  try {
    const ctx = await gatherRepoContext(repo, ref);
    const rendered = renderContext(ctx);
    console.error(
      [
        `slug:        ${ctx.slug}`,
        `ref:         ${ctx.ref}`,
        `files:       ${ctx.files.map((f) => `${f.path}${f.truncated ? " (truncated)" : ""}`).join(", ") || "none"}`,
        `workflows:   ${ctx.workflows.map((f) => f.path).join(", ") || "none"}`,
        `tree paths:  ${ctx.tree.length}${ctx.treeTruncated ? " (truncated)" : ""}`,
        `fingerprint: ${ctx.manifestFingerprint}`,
        `characters:  ${rendered.length}`,
        "",
      ].join("\n"),
    );
    console.log(rendered);
  } catch (e) {
    if (e instanceof AutoConfigError) {
      console.error(`failed: ${e.code}${e.message === e.code ? "" : ` — ${e.message}`}`);
      process.exit(1);
    }
    throw e;
  }
}

void main();
