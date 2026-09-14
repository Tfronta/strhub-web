# PLAN — Cumplimiento de la nomenclatura de secuencia ISFG 2023 en el módulo *mix-profiles*

**Estado:** en progreso · **Modo de trabajo:** sin commits hasta validación 100% (herramienta en producción con usuarios activos).

## Contexto

- **Paper de referencia:** *Recommendations of the DNA Commission of the ISFG on short tandem repeat sequence nomenclature* — FSI Genetics 2023, DOI `10.1016/j.fsigen.2023.102946`, PII `S1872-4973(23)00121-7`.
- **Qué exige:** designación de alelos STR **basada en secuencia** para datos MPS/NGS — notación entre corchetes **multi-bloque** vía **STRNaming**, *sequence string* (SID) dentro del **rango mínimo ISFG**, regiones flanqueantes según **FSSG v6**.
- **Naturaleza del problema:** es de **re-anotación de datos** (5 muestras estáticas HipSTR + 1 sintética), NO de algoritmo en runtime.

## Datos actuales

- Lógica: `sections/mix-profiles/utils/mix-model.ts` (`simulateNGS`).
- Haplotipos reales: `sections/mix-profiles/data/ngs-haplotypes/` → HG00097, HG00145, HG00372, HG01063, HG02944 (21 loci autosómicos cada uno, derivados de HipSTR).
- Parseo/render: `parseNgsHaplotypes.ts`, `data.ts`, `MixProfilesDemo.tsx`.

## Hallazgos de incumplimiento (de mayor a menor gravedad)

1. **Bracketing de un solo bloque** `[motif_canonical]×N` para loci compuestos/complejos (vWA, D1S1656, D2S1338, D12S391, FGA, D21S11, SE33…). Debe ser multi-bloque STRNaming.
2. **Sin *sequence string* / SID** conforme al rango mínimo ISFG; se usa `flank_size: 25 bp` fijo.
3. **`motif_canonical` por frecuencia** (HipSTR), no por motivo/marco de lectura ISFG.
4. **Rutas placeholder** `"—"` en `simulateNGS` cuando el alelo simulado no resuelve contra los 5 haplotipos reales.
5. **Sin algoritmo de estandarización** (STRNaming o equivalente).

## Restricciones / invariantes (NO romper)

- **Los genotipos numéricos NO cambian.** `allele_call1/2` y `genotype_forense` (validados en IGV) permanecen idénticos. La nomenclatura de secuencia es **aditiva**.
- **Los flancos visuales del usuario se preservan.** Se separan en dos campos:
  - `display_seq` → secuencia con flancos amplios, **solo UI/visual** (se conserva tal cual).
  - `sequence_string` / SID → secuencia conforme al **rango mínimo ISFG**, para nomenclatura/reporte.
- **Sin commits** hasta validación 100%.
- **Regla de oro de validación:** tras re-anotar, `diff` debe mostrar `genotype_forense` idéntico en los 5 JSON. Si un número cambió → bug.

## Fases

### P0 — Fuente de verdad y herramienta de estandarización *(habilita todo)*
- Adoptar **STRNaming** (J. Hoogenboom) + tablas **FSSG v6** (motivo, reading frame, rango mínimo, coords GRCh38 por locus).
- Instalar en el pipeline de validación (junto a HipSTR), **no** en el web app.
- Validación: reproducir 2–3 alelos de referencia conocidos de STRSeq/STRidER.
- Esfuerzo: bajo · Riesgo: bajo.

#### P0 — Resultados (2026-06-28)
- ✅ **STRNaming 1.2.0** instalado en venv aislado (`scratchpad/strnaming-venv`). CLI `name-sequences -r uas-frr`. Entrada: `<marcador>\t<secuencia>` por línea.
- ✅ **La estructura multi-bloque se recupera correctamente en el strand correcto** (validado contra HG00097): vWA → `AGAT[11]AGAC[4]AGAT[2]` (=17 ✓), D2S1338 → `GGAA[2]GGAC[1]GGAA[12]GGCA[7]` (=22 ✓). Los conteos de repetición de los genotipos están intactos en los datos.
- ❌ **STRNaming NO consume los JSON tal cual.** Requiere la secuencia en la **ventana UAS-FRR** del marcador y en su **strand de reporte**. Las secuencias HipSTR (repetición ± 25 bp flanco, strand forward GRCh38) producen números CE erróneos (vWA 21.2/9 en vez de 17; D2S1338 29.3/17.3 en vez de 22) y variantes de flanco espurias, porque flancos arbitrarios se absorben en la repetición o desanclan el rango.
- ➡️ **Implicación para P1:** se necesita una capa de **normalización por marcador** → (strand de reporte, ventana UAS-FRR). Mejor obtenida re-extrayendo la ventana exacta desde el BAM/referencia, no desde el flanco ±25 bp almacenado.

#### Decisión (Ruta A) y POC VALIDADO (2026-06-28)

**Ruta elegida: A.** Implementada como variante determinista que NO requiere re-llamar variantes ni descargar los BAM:
- Tabla `strnaming/data/ranges_uas-frr.txt` da por marcador: cromosoma, ventana UAS-FRR y **strand** (`start>end` ⇒ hebra reversa).
- **Ventana FRR construida por coordenadas:** `refFRR = get_refseq(chrom, lo, hi)` (referencia, 1-based inclusivo) → se reemplaza el tramo `[hipstr_start, hipstr_end]` por el `repeat_seqN` validado del JSON → reverse-complement si el marcador es reverso → `strnaming name-sequences -r uas-frr`.
- El flanco proviene de la **referencia de STRNaming** (invariante entre samples); la parte variable (repetición) viene del **JSON HipSTR validado**. Los genotipos numéricos no se tocan.

**Resultado del POC (script `scratchpad/poc_strnaming.py`):**
- **HG00097: 20/21 loci OK** — CE de STRNaming == `genotype_forense`.
- **HG00145: 20/21 loci OK** (mismo patrón, cross-sample).
- Nombres ISFG multi-bloque correctos, p.ej.:
  - vWA 17 → `CE17 GGAT[3]AGAT[1]GGAT[1]AGAT[11]AGAC[4]AGAT[2]` (¡los dos alelos CE17 difieren en secuencia: AGAT[11]AGAC[4] vs AGAT[12]AGAC[3] = **isoalelos** que `[TCTA]17` no distingue!).
  - D2S1338 22/24 → `GGAA[2]GGAC[1]GGAA[12]GGCA[7]` / `…GGAA[14]…`.
  - D1S1656 17.3 → `AC[6]CTAT[13]CAT[1]CTAT[3]`.
  - FGA, D12S391, D3S1358 → estructuras compuestas correctas.

**Items abiertos (para P1):**
1. **D19S433** — RESUELTO (investigación 2026-06-28). Causa: **HipSTR sobre-cuenta +2 de forma sistemática** vs la designación CE forense. Evidencia:
   - `strnaming/length_adjustments.py` documenta explícitamente: `19 29926234 29926286 +4 # D19S433 14` → tabla de ajustes "for obtaining correct CE allele numbers"; **alelo de referencia D19S433 = 14**.
   - STRNaming sobre la referencia GRCh38 pura → CE14 (coincide). HG00097 = referencia −1 unidad → **CE13**. HipSTR (conteo crudo de su región repetida de 64 bp = 16 fourmers) → 16 en referencia, 15 en HG00097. Offset constante +2.
   - Literatura (Carbó-Ramírez et al. 2025, FSI Gen, D19S433 CE-vs-NGS): *"ForenSeq UAS does not use the ISFG minimum range for allele calling, but a shorter sequence string is used for CE allele designation"* → CE cuenta menos unidades que la región repetida completa. Confirma el offset sistemático.
   - **Conclusión:** CE forense **y** STRNaming coinciden en **13**; HipSTR (15) es el outlier. El "15" validado en IGV fue conteo visual de repeticiones, no el alelo CE/ISFG.
   - **DECISIÓN (usuario):** corregir `genotype_forense` de D19S433 al valor ISFG/CE en las 5 muestras + documentar offset. Nota: estos JSON usan flancos de **referencia** (`*_hg38`), así que un posible variante de flanco sample-específico (paper 2025) NO sería visible aquí.
   - **Valores corregidos validados (offset −2 uniforme en los 10 alelos):**
     - HG00097: 15/15 → **13/13**
     - HG00145: 15/16 → **13/14**
     - HG00372: 15/16 → **13/14**
     - HG01063: 14/16 → **12/14**
     - HG02944: 15/16.2 → **13/14.2** (`CE14.2 TCCT[14]_+6CT>-`)
   - Se aplicará al generar los JSON ISFG paralelos (P1), NO sobre los JSON de producción todavía.
2. **D12S391**: CE correcto pero STRNaming reporta `+1T>C` de flanco → posible off-by-one en `hipstr_end`; QC de boundary.
3. **D21S11 ausente** del JSON de HG00097 (cobertura de datos a verificar por sample).
4. **HG02944**: NO está en el repo `Tfronta/strhub-demo-data` (sí HG00263); el JSON del web app sí existe. Confirmar fuente.

**Entorno POC:** venv aislado `scratchpad/strnaming-venv` (STRNaming 1.2.0). Ningún archivo de producción modificado.

### P1 — Re-anotar los 5 haplotipos *(arregla #1, #3)*
- Paso post-HipSTR: tomar la región repetida y producir `bracketed1/2` multi-bloque STRNaming + motivo/marco ISFG.
- Solo toca campos de secuencia; **nunca** `allele_call`/`genotype_forense`.
- Regenerar los 5 JSON (y su copia espejo).
- Validación: diff por locus contra STRidER; foco en compuestos.
- Esfuerzo: medio · Riesgo: bajo.

### P2 — Sequence string / SID + rango mínimo por locus *(arregla #2, #3)*
- Añadir `sequence_string`/`SID` e `iso_min_range` por locus; preservar `display_seq` con flancos visuales.
- Reemplazar `flank_size: 25` por el rango FSSG v6 en el string de nomenclatura.
- Validación: longitudes del string coinciden con el rango mínimo publicado por locus.
- Esfuerzo: medio · Riesgo: bajo.

### P3 — Eliminar rutas placeholder en el simulador *(arregla #4)*
- En `simulateNGS` (`mix-model.ts`): derivar secuencia desde la BD de haplotipos por nº de repeticiones; si no hay match, etiquetar "solo longitud (no secuencia)".
- Validación: ninguna fila NGS muestra `"—"`.
- Esfuerzo: bajo-medio · Riesgo: medio (toca runtime).

### P4 — UI + tests de regresión *(constancia de validación)*
- Mostrar bracketed multi-bloque + SID en la tabla (`MixProfilesDemo.tsx`).
- Test que compara la salida contra un set de alelos de referencia ISFG.
- Validación: suite verde + captura para el dossier.
- Esfuerzo: medio · Riesgo: bajo.

## Nota de integración (doble fuente de datos) — 2026-06-28

El módulo usa **dos fuentes separadas**:
- **Gráfico CE** ← `SAMPLE_DATABASE` (alelos numéricos) en `sections/mix-profiles/data.ts`.
- **Planilla NGS** ← JSONs en `data/ngs-haplotypes/`.

Implicación: la re-anotación ISFG (campos de secuencia) **no afecta CE** salvo **D19S433**, cuyo cambio de número (15→13) debe aplicarse en **AMBAS** fuentes para mantener coherencia (si no, CE mostraría 15 y NGS 13). El pico CE de D19S433 se moverá a 13 (correcto).

Además: AT/ST solo re-gatean la interpretación, no regeneran la señal CE (core vs interpretación separados en `mix-model.ts`).

### Entorno local (preview sin commits)
- Proyecto usa **pnpm**. Arrancar con `pnpm dev` (no `npm`). Si falta `tailwindcss`: `pnpm install --frozen-lockfile`.
- `http://localhost:3000/mix-profiles`.

## Preview local ISFG (2026-06-28) — EN WORKING TREE, sin commit

Implementado preview funcional en `localhost:3000/mix-profiles`:
- **Datos:** `apply_isfg_local.py` actualizó in-place `bracketed1/2` (ISFG `[MOTIF]n` multi-bloque) en los 5 JSON + corrigió D19S433 (números 13-based) — 42 alelos/muestra, 0 cambios inesperados.
- **Render:** `charts/NGSChart.tsx` (líneas 240-244) ahora prefiere `r.repeatSequence` (ISFG real) en vez de recomputar `formatMicrovariant(allele, motivo_primario)` = `[TAGA]N`.
- **Hallazgo:** `SAMPLE_DATABASE` (fuente del gráfico CE) **ya tenía** D19S433 en 13-based; el desajuste vivía solo en los JSON NGS. CE no requiere cambios.
- **Causa raíz UI confirmada:** la columna "Repeat Sequence" la genera `NGSChart.tsx`, no el JSON; recomputaba single-block ignorando `bracketed1/2`.
- **Revertir:** `git -C strhub-web checkout sections/mix-profiles/data/ngs-haplotypes/ sections/mix-profiles/charts/NGSChart.tsx`

Pendiente validar visualmente en navegador y decidir promoción a commit.

## Estado final de cumplimiento ISFG (2026-06-28)

| Recomendación ISFG 2023 | Estado |
|---|---|
| Bracketed multi-bloque (STRNaming) | ✅ 100% |
| **Formato de corchetes 2023** = `MOTIF[n]` (p. ej. `GGAT[3]`), NO el histórico 2016 `[MOTIF]n` | ✅ (corregido 2026-06-28; FSSG v6 distingue ambos) |
| Alelo CE conservado | ✅ |
| Sequence string sobre rango definido, coloreado por bloque | ✅ |
| Estandarización STRNaming 1.2.0 | ✅ |
| Isoalelos distinguidos por secuencia | ✅ |
| Microvariantes (.1/.2/.3) | ✅ |
| Variantes de región flanqueante | ⛔ **FUERA DE ALCANCE** (decisión usuario) |
| Rango = ISFG minimum range | ⚠️ se usa **UAS-FRR** (única opción en STRNaming 1.2) |

**Conclusión:** la **región repetida** — núcleo de la recomendación ISFG — está **100% conforme**.

### Variantes de flanco — fuera de alcance (justificación documentada)
- Requieren la secuencia flanqueante **real del sample** (reads del BAM). Los JSON usan flancos de **referencia** (`*_hg38`), así que el empalme referencia+repetición puede generar variantes de flanco **fantasma** en el borde (ej. D12S391 `+1T>C`, no validable).
- STRhub es una herramienta **educativa**; las variantes de flanco se documentan como fuera de alcance.
- Si en el futuro se quieren incluir 100% reales: re-extraer la ventana FRR desde los BAM de `Tfronta/strhub-demo-data` y correr STRNaming sobre los reads.

### Caveat de rango (documentar en dossier)
STRNaming 1.2.0 solo ofrece rangos **UAS-FRR**. El "ISFG minimum range" (FSSG v6) puede diferir levemente por locus. El artículo lo contempla; versiones futuras de STRNaming ofrecerán más rangos.

## Implementación final (working tree, SIN commit)

Archivos modificados (revertir: `git -C strhub-web checkout sections/mix-profiles/`):
- 5× `data/ngs-haplotypes/*.json`: `bracketed1/2` ISFG multi-bloque, D19S433 corregido (13-based), `+ isfgSegments1/2` (segmentación coloreada de STRNaming `--html`).
- `utils/simulate.ts`: `+ isfgSegments` en tipo `NGSRow`.
- `data.ts`: pasa `isfgSegments` a la fila NGS.
- `charts/NGSChart.tsx`: usa `r.repeatSequence` (ISFG) en "Repeat Sequence"; render coloreado por bloque + tooltips `[MOTIF]N` en "Full Sequence".

Scripts (en scratchpad): `apply_isfg_local.py`, `gen_segments.py`, `poc_strnaming.py`, venv `strnaming-venv`.
`SAMPLE_DATABASE` (gráfico CE): SIN cambios (ya tenía D19S433 correcto).

## Pendiente (decisión usuario)
- Validación visual final en navegador (✅ confirmada por usuario para vWA).
- ¿Promover a commit + push? (regla: sin commit hasta 100% validado).
- ¿Actualizar copy de la UI / methods doc para mencionar nomenclatura ISFG?
- Limpieza de archivos auxiliares (`isfg-reannotation/`, scratchpad).

## Ruta crítica

`P0 → P1 → P2` secuenciales (incumplimiento de fondo). `P3` y `P4` independientes/paralelizables.

## Nota de alcance

Solo 5 muestras + 1 sintética ⇒ **no** portar STRNaming a TypeScript. Re-anotar offline y embeber el resultado.
