/**
 * IGV.js is distributed as ESM without bundled TypeScript types.
 * @see https://github.com/igvteam/igv.js
 */
declare module "igv/dist/igv.esm.js" {
  const igv: {
    removeAllBrowsers?: () => void
    createBrowser: (
      parentDiv: HTMLElement,
      options: Record<string, unknown>
    ) => Promise<unknown>
    [key: string]: unknown
  }
  export default igv
}
