# STRhub: Métodos de simulación de electropherogramas CE y mezclas

**Documento técnico para constancia del proyecto**

Este documento describe de forma detallada cómo STRhub calcula y simula los picos de electroforesis capilar (CE) y las mezclas de ADN en el módulo de perfiles de mezcla. No incluye código; el objetivo es dejar constancia de los modelos, parámetros y fuentes de datos para uso en documentación científica o publicaciones.

---

## 1. Alcance y propósito

STRhub incluye un simulador educativo de electropherogramas (CE) y de lecturas tipo NGS derivadas de la misma mezcla. El modelo:

- Genera **señal CE** (picos verdaderos, stutter, ruido de línea de base) a partir de contribuyentes, proporciones y parámetros de locus.
- Aplica **degradación** dependiente del tamaño del amplicón.
- Usa **tasas de stutter por locus** (cuando están disponibles) y permite un factor de escala global.
- Mantiene **reproducibilidad** mediante una semilla determinista (sin incluir umbrales analíticos en la semilla, para que AT/ST no alteren la señal generada).
- Calcula **área de pico equivalente CE** para visualización (no integración numérica de la curva dibujada).
- Deriva **curvas suaves** para la gráfica sumando gaussianas centradas en cada pico.

Los umbrales **AT** (Analytical Threshold) y **ST** (Stochastic Threshold) se aplican solo en la capa de interpretación (marcadores, notas de riesgo de drop-out), no en la generación de la señal.

---

## 2. Datos de entrada

### 2.1 Catálogo de loci y alelos

- Los loci y alelos válidos provienen de un **catálogo** filtrado por marcadores tipo CODIS Core.
- Para cada locus se dispone de una lista de alelos (tamaños enteros o microvariantes, p. ej. 9.3, 14.2).
- Este catálogo se usa para: (1) validar que las posiciones de stutter (−1, −2, +1) correspondan a alelos conocidos o a desplazamientos de una unidad repetida; (2) definir el rango de alelos para la visualización.

### 2.2 Base de datos de muestras (genotipos)

- Existe una **base de datos de muestras** (por ejemplo, identificadores tipo HG00097, HG00145, HG00372, HG02944, HG01063, más muestras sintéticas como SYN_TRI01 para loci trialélicos).
- Cada muestra tiene, por locus, un conjunto de **alelos** (genotipo). Se admiten alelos enteros y microvariantes.
- Los contribuyentes a la mezcla se eligen entre estas muestras; cada contribuyente tiene una **etiqueta** (A, B, C) y una **proporción** (porcentaje o fracción) que suma 100 % entre los activos.

### 2.3 Parámetros de la mezcla y del sistema CE

- **Cantidad de ADN (ng):** entrada global que, junto con las proporciones, define la cantidad efectiva por contribuyente.
- **Proporciones de los contribuyentes:** normalizadas a suma 1; solo intervienen los contribuyentes con proporción > 0.
- **Eficiencia del locus:** factor por locus (por defecto 0,95) que reduce la señal (captura eficiencia de amplificación/detección).
- **Degradación:** parámetro *k* por 100 pb que controla la atenuación en función del tamaño del amplicón (véase más adelante).
- **Línea de base / ruido:** media y desviación estándar (en RFU) para generar ruido de fondo; no dependen de AT/ST.
- **Umbrales AT y ST:** solo para interpretación (marcadores "Llamado", "Riesgo de drop-out", y si un pico de stutter se muestra como marcador).
- **Nivel de stutter (factor de escala):** multiplicador aplicado a las tasas de stutter base (minus1, minus2, plus1) del locus.

---

## 3. Modelo de señal CE (picos verdaderos)

### 3.1 Escala de señal por contribuyente y locus

Para cada contribuyente con proporción > 0 y para el locus seleccionado:

1. Se obtienen los alelos del genotipo de esa muestra en ese locus.
2. **ADN efectivo:** se calcula como (ADN total en ng) × (proporción del contribuyente) × (eficiencia del locus).
3. **Escala de RFU:** escala de señal = κ_RFU × (ADN efectivo), donde κ_RFU es un parámetro global (por defecto 8000) que relaciona cantidad de ADN con altura en RFU.
4. **Media por copia:** si el individuo es heterocigoto (dos alelos), la media de RFU por copia es (escala de RFU) / 2; para homocigoto, (escala de RFU) / 1. En el modelo actual no se introduce desbalance interalélico dentro del mismo contribuyente: se hace **una sola realización** de una variable aleatoria para ese contribuyente y locus, y esa misma realización se asigna a todas las copias de sus alelos en ese locus.
5. **Realización de la altura base:** la altura base (en RFU) por contribuyente y locus se obtiene como una **distribución lognormal** con media igual a la media por copia y un parámetro de dispersión (σ lognormal, por defecto 0,12–0,25 según configuración). Así se introduce variabilidad estocástica entre repeticiones o entre loci.
6. **Acumulación por alelo:** si varios contribuyentes comparten el mismo alelo, las alturas base (ya una por contribuyente) se **suman** en ese alelo. Cada pico "verdadero" en una posición de alelo es por tanto la suma de las contribuciones de todos los contribuyentes que portan ese alelo, cada una con su propia realización lognormal.

No se modela explícitamente el desbalance heterocigótico (p. ej. 60:40) en esta etapa; la variabilidad entre realizaciones viene de la lognormal por contribuyente.

---

## 4. Degradación

- La degradación se aplica **después** de obtener las alturas base y **antes** de calcular el stutter.
- Para cada alelo se calcula una **longitud de amplicón** aproximada (en pb) a partir de metadatos por locus: longitud de referencia, alelo de referencia y longitud del motivo repetido. Fórmula conceptual: *L = L_ref + motivo × (alelo − alelo_ref)*. Loci con motivos de 4 pb o 5 pb (p. ej. PentaD, PentaE) tienen sus propios parámetros.
- Se considera un subconjunto de **loci largos** (p. ej. PentaE, PentaD, FGA, D21S11, D18S51, D2S1338) para los que el factor interno de degradación se escala de forma distinta (factor 6 frente a 4).
- **Atenuación:** factor de atenuación = exp(−k_interno × (L / 100)), donde *k_interno* es el parámetro de degradación por 100 pb multiplicado por 4 o 6 según el locus. El resultado se limita al intervalo [0, 1].
- La **altura degradada** del pico verdadero es: (altura base) × (factor de atenuación). Esta altura degradada es la que se usa como "padre" para generar el stutter.

---

## 5. Stutter

### 5.1 Tipos de stutter

Se consideran tres tipos en relación al alelo padre:

- **−1:** una repetición menos (posición padre − 1).
- **−2:** dos repeticiones menos (posición padre − 2), si está definido para el locus.
- **+1:** una repetición más (posición padre + 1), si está definido para el locus.

La posición del producto de stutter puede ser decimal si el padre es microvariante (p. ej. 9.3 → 8.3 y 10.3); en ese caso se redondea a un decimal.

### 5.2 Tasas por locus

- Las **tasas base** (minus1, minus2, plus1) pueden ser **específicas por locus**. Cuando existen, provienen de datos publicados (en el código se cita "Luciellen" como fuente de tasas por locus para CE). Para loci sin preset se usa un valor por defecto (p. ej. minus1 ≈ 0,06–0,10, plus1 ≈ 0,02).
- Un **factor de escala de stutter** (por defecto 1,0) multiplica todas las tasas; puede subir hasta ~1,5–2,0 en la interfaz para simular condiciones con más stutter.
- La tasa efectiva usada en cada realización se obtiene añadiendo una perturbación gaussiana pequeña (desviación típica ≈ 0,01–0,02) y se limita a un máximo (p. ej. 0,22 o 0,30 si el factor de escala es alto) para evitar tasas no realistas.

### 5.3 Cálculo del RFU de stutter

Para cada alelo padre (con su altura ya degradada) y para cada tipo de stutter (−1, −2, +1) habilitado:

1. **Tasa efectiva *s*:** tasa base × factor de escala + ruido gaussiano, limitada a [0, máximo].
2. **Media del stutter:** media_RFU_stutter = (altura degradada del padre) × *s*.
3. **Realización:** el RFU del stutter se obtiene con una **lognormal** de media = media_RFU_stutter y parámetro de dispersión (σ) fijo (p. ej. 0,12) para stutter.
4. **Límites de razón:** el RFU de stutter se restringe a un intervalo razonable respecto al padre (p. ej. −1 entre 8 % y 20 % del padre; −2 y +1 entre 1 % y 5 % del padre) para evitar valores extremos.
5. **Validación:** solo se emite stutter en posiciones que pertenecen al catálogo de alelos del locus o que están a una unidad (o dos para −2) del padre.
6. **Acumulación:** si en una misma posición de alelo confluyen stutters de distintos padres (p. ej. stutter −1 del alelo 10 y stutter +1 del alelo 8, ambos en la posición 9), los **RFU se suman**. El sistema guarda un desglose por padre y tipo (delta) para mostrar en tooltips la contribución de cada uno.

### 5.4 Colocalización con pico verdadero

Cuando en una misma posición hay tanto un pico verdadero como stutter:

- La **altura mostrada del pico verdadero** (curva azul) es la **suma** del RFU verdadero y del RFU de stutter en esa posición, de forma análoga a un electropherograma real donde no se separan.
- Además, se mantiene por separado la lista de "picos de stutter" con su RFU y su desglose por padre, para la curva roja didáctica y los tooltips.

---

## 6. Ruido de línea de base

- La línea de base (nivel medio de ruido) se fija como una realización: **baseline = max(0, μ_baseline + N(0, σ_baseline))** con μ y σ configurables (por defecto μ ≈ 30, σ ≈ 10 RFU).
- El **ruido de fondo** se genera como un número de picos discretos (entre ~15 y ~30 en función del rango de alelos). Cada pico de ruido tiene:
  - Posición en "alelo" repartida en el rango visible.
  - Altura (RFU) obtenida por lognormal con media en un rango entre un mínimo (p. ej. 10 % de μ_baseline) y un techo (μ_baseline + 2σ_baseline), con dispersión adicional.
- Estos picos se interpolan y suavizan para formar una **trazado de ruido** continuo que se dibuja como línea gris; no se suman a la señal de los picos verdaderos ni del stutter en el modelo de datos, solo son visuales.

---

## 7. Trazado visual (curva suave) del electropherograma

- Los **picos verdaderos** (ya con RFU combinado verdadero + stutter donde aplica) se convierten en una curva continua sumando **gaussianas** centradas en cada posición de alelo.
- Cada gaussiana tiene la forma: amplitud × exp(−0,5 × ((x − μ) / σ)²), donde μ es la posición del pico (alelo), la amplitud es el RFU del pico y σ es un ancho fijo pequeño (p. ej. 0,04 en unidades de alelo) para mantener microvariantes visualmente separadas.
- La curva se evalúa en pasos pequeños (p. ej. 0,01) en el rango de alelos. Lo mismo se hace por separado para la **curva de stutter** (solo picos de stutter, misma σ), que se dibuja en rojo en modo educativo.
- La **línea de base/ruido** se dibuja aparte (gris) y no se suma a la señal en el modelo; es solo contexto visual.

---

## 8. Área de pico equivalente CE

- En CE real, el área del pico suele ser proporcional a la altura × anchura en el tiempo, con una relación área/altura típica en un rango aproximado de 3,5–5,0 (Butler, 2015).
- En STRhub **no se integra numéricamente** la curva dibujada (que usa σ muy estrecho); eso daría áreas ~100× menores que las típicas de instrumentos reales.
- En su lugar, el **área mostrada** por pico se calcula como: **área = RFU del pico × factor fijo**, con un factor (p. ej. 4,25) dentro del rango citado, de modo que la magnitud sea "equivalente CE" y comprensible para el usuario. Es decir, es un escalado de la altura para dar un número de área razonable, no una integración de la forma del pico.

---

## 9. Interpretación: umbrales AT y ST

- **AT (Analytical Threshold):** picos con RFU < AT no se consideran reportables; pueden no mostrarse como "llamados" en la leyenda.
- **ST (Stochastic / Interpretation Threshold):** picos con RFU ≥ AT pero < ST se marcan como **riesgo de drop-out** (p. ej. marcador naranja); picos con RFU ≥ ST se marcan como **llamados** (p. ej. marcador verde).
- Los **picos de stutter** con RFU ≥ AT pueden mostrarse como marcadores (p. ej. triángulos) en la vista educativa. La semilla del generador **no** depende de AT ni ST, de modo que la señal simulada sea la misma aunque el usuario cambie los umbrales.

---

## 10. Simulación NGS (derivada de la mezcla CE)

- A partir de la misma mezcla (contribuyentes, proporciones, locus, degradación), STRhub puede derivar **conteos de lecturas** tipo NGS.
- Se usa una **distribución binomial negativa** (o similar) para el número de lecturas por alelo, con media proporcional al ADN efectivo y a un parámetro de lecturas totales (ρ), y con un parámetro de dispersión.
- Las **proporciones por alelo** se obtienen repartiendo el peso entre los alelos del contribuyente (sin desbalance heterocigótico explícito en la lógica base).
- El **stutter en NGS** se modela con tasas más bajas (minus1, minus2, plus1 típicamente del orden de 0,001–0,01) y se suma como lecturas en la posición (padre − 1), etc.
- Criterios de "llamado" NGS: mínimo de lecturas y fracción mínima respecto al total; solo se muestran alelos que superan ambos.

---

## 11. Reproducibilidad y semilla

- La **semilla** del generador pseudoaleatorio se construye a partir de: identificador del locus, contribuyentes (etiqueta, muestra, proporción), cantidad de ADN, y parámetros que afectan la señal (κ_RFU, eficiencia, degradación, línea de base, escala de stutter, tasa base de stutter). **No** se incluyen AT ni ST.
- Con la misma semilla y los mismos parámetros, la secuencia de alturas (verdaderas, stutter, ruido) es reproducible. Cambiar solo AT/ST no altera esa secuencia.

---

## 12. Resumen de parámetros numéricos típicos

| Concepto | Valor o rango típico |
|----------|----------------------|
| κ_RFU (escala CE) | 8000 |
| Eficiencia locus CE | 0,95 |
| σ lognormal (altura base) | 0,12–0,25 |
| Stutter minus1 (por locus) | ~0,05–0,17 (Luciellen); default ~0,06–0,10 |
| Stutter plus1 | ~0,01–0,04; default ~0,02 |
| Stutter minus2 | ~0,01 (cuando existe) |
| σ lognormal stutter | 0,12 |
| Límites stutter −1 respecto al padre | 8 %–20 % |
| Límites stutter −2 / +1 | 1 %–5 % |
| μ línea de base | ~30 RFU (configurable) |
| σ línea de base | ~10 RFU (configurable) |
| σ gaussiana visual (curva CE) | 0,04 (unidades de alelo) |
| Factor área/altura CE | 4,25 (Butler, 2015) |
| Degradación: factor interno (loci "cortos") | 4 × k por 100 pb |
| Degradación: factor interno (loci "largos") | 6 × k por 100 pb |

---

## 13. Referencias y fuentes de datos

- **Tasas de stutter por locus (CE):** cuando se usan valores específicos, se citan como "de Luciellen" en el código (referencia a datos de tasas por locus para CE).
- **Relación área/altura en CE:** rango 3,5–5,0 para condiciones típicas (Butler, 2015).
- **Catálogo de alelos:** derivado del catálogo del proyecto (CODIS Core) para definir alelos válidos y microvariantes.
- **Genotipos de muestra:** base de datos interna (p. ej. muestras 1000 Genomes u otras) para definir contribuyentes y sus alelos por locus.

---

*Documento generado para constancia del proyecto STRhub. Los métodos descritos corresponden al módulo de perfiles de mezcla y simulador CE/NGS educativo.*
