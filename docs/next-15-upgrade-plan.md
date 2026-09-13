# Plan de subida a Next 15

Estado actual (septiembre 2026): `next` 14.2.35 con React 19.2 y `@types/react` 18.
Next 14 declara `react ^18.2.0` como peer dependency, así que la combinación funciona
por accidente. Además `next` 14.2.35 tiene un aviso crítico (DoS en Image Optimizer y
en la deserialización RSC) cuyo fix está en 15.5.16 o superior.

## Por qué no se hizo en la misma tanda que la auditoría

La subida cambia APIs de runtime (params/searchParams asíncronos, caché de `fetch`
no persistente por defecto, `cookies()`/`headers()` asíncronos) y toca casi todas las
rutas. Conviene hacerla sola, en una rama, con build y smoke test antes de desplegar.

## Pasos

1. Rama nueva `chore/next-15` desde `main` con el árbol limpio.
2. `pnpm add next@15 react@19 react-dom@19 @types/react@19 @types/react-dom@19 @next/third-parties@15`
   y `pnpm dlx @next/codemod@canary upgrade latest` para los codemods automáticos.
3. Cambios que el codemod no cubre, revisar a mano:
   - `app/layout.tsx`: `cookies()` pasa a ser `await cookies()`.
   - Todos los `generateMetadata({ params })` y páginas dinámicas: `params` y
     `searchParams` son Promises. Afecta `app/marker/[id]/layout.tsx`,
     `app/basics/[locale]/[slug]/page.tsx`, `app/verified/[slug]/page.tsx`,
     `app/api/**/[id]/route.ts`, `app/api/back-to-basics/[slug]/route.ts`.
   - Route handlers GET ya no se cachean por defecto; `app/api/catalog` y
     `app/api/back-to-basics` deben declarar `export const revalidate` o
     `dynamic = "force-static"` si se quiere caché.
   - `fetch` dentro de server components ya no se cachea por defecto:
     `lib/verified.ts` (`fetchJson`) necesita `next: { revalidate }` explícito.
   - `middleware.ts` sigue igual en 15.
4. `pnpm typecheck && pnpm test && pnpm build`, luego `pnpm start` y smoke test de:
   home, /catalog, /marker/CSF1PO, /mix-profiles, /tools/igv-viewer (igv.js dinámico),
   /basics/es/strs-forenses, /verified, /sitemap.xml, /opengraph-image, un 404.
5. Desplegar como preview en Vercel y repetir el smoke test antes de mergear a `main`.

## Después de Next 15

- Evaluar `images.unoptimized: false` con `remotePatterns` para `images.ctfassets.net`.
- Pasar el token de admin de `localStorage` a cookie httpOnly y proteger `/admin` en
  `middleware.ts`.
- Definir una Content-Security-Policy completa (`script-src`, `connect-src`) y probarla
  primero en modo `Content-Security-Policy-Report-Only`.
- Reemplazar `xlsx` (vulnerabilidades sin fix) por `exceljs` o exportar solo CSV.
