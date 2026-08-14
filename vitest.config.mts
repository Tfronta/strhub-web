import { defineConfig } from "vitest/config";

export default defineConfig({
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
