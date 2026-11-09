import { defineConfig } from "vitest/config";

export default defineConfig({
  // Next's tsconfig preserves JSX for Next to compile. Component regressions
  // run outside Next and need the React JSX transform in Vitest itself.
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: { "@": import.meta.dirname },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    // .claude holds agent worktrees — full checkouts of this repo. Without this
    // every test in one is collected a second time, and the run reports twice
    // the tests this working tree actually has.
    exclude: ["node_modules/**", ".next/**", ".claude/**"],
  },
});
