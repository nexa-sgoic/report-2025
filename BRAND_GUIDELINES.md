# NEXA · Brand Guidelines — Web Edition

> Documento de decisiones para la implementación de la página web del Relatório de Sustentabilidade NEXA 2025.
> Compañero de `Design System.html` (referencia visual), `nx-tokens.css` (tokens), `NEXA.html` (prototipo home).
> Handoff a Claude Code.
>
> **Versión**: v0.2 — 2026-05-15
> **Autora del input**: MFZ (Fernanda Zelaya, Responsable ESG)
> **Fuente normativa**: `assets/brand/Manual_Normas/KIT_Normas_NEXA.pdf` (23 pp · oficial)

---

## 0. Norte estratégico

Web del RS NEXA 2025: **icónica, en movimiento continuo, finance-grade**. Long-scroll editorial. Bilingüe PT (default) + EN. Coreografía tipo Pentagram/Stripe.

Tres adjetivos no negociables: **Iconic · In-motion · Finance-grade**.

---

## 1. Color · DOS sistemas conectados

> **Cambio importante v0.2**: el Manual de Normas define una paleta institucional. La web honra ambos sistemas: el oficial (logo, chrome) y la extensión editorial (superficies grandes, heredada del impreso).

### 1.1 Paleta institucional · oficial (Manual de Normas, p.18)

Pantone-certified. Inalterable. Usar para logo, marcas de agua, firmas oficiales.

| Nombre Manual | Pantone | Hex | Token | Rol |
|---|---|---|---|---|
| Preto | Black 6 C | `#03020C` | `--nx-brand-ink` | Logo monocromo negro |
| Laranja | 2020 C | `#C85204` | `--nx-brand-orange` | **Único acento institucional** |
| Branco | 663 C | `#FFFFFF` | `--nx-brand-white` | Logo monocromo blanco |
| Tom intermédio | 2309 C | `#EDCCC0` | `--nx-brand-peach` | Tom de apoio · charts secundarios |

### 1.2 Paleta editorial · extensión RS

El reporte impreso usa una interpretación cálida (grey suave + cream) para superficies grandes. Compatible con la marca; el acento permanece idéntico al oficial.

| Token | Hex | Rol |
|---|---|---|
| `--nx-ink` | `#2D2D2C` | Dark surface dominante (warm grey) |
| `--nx-orange` | `#C85204` | === idéntico al brand orange · único acento |
| `--nx-orange-deep` | `#A8420A` | Hover/pressed |
| `--nx-orange-soft` | `#EDCCC0` | === brand peach · chart fills |
| `--nx-bone` | `#EDEAE3` | Background dominante de contenido |
| `--nx-paper` | `#F5F2EB` | Cards, superficies secundarias |
| `--nx-mid` | `#9A9794` | Captions, ejes, metadata |
| `--nx-line` | `#D6D1C7` | Hairlines |

### 1.3 Reglas duras

- **R1**: El logo SIEMPRE usa la paleta institucional (#03020C / #C85204 / #FFFFFF). Nunca recolorearlo con el ink warm grey.
- **R2**: Las superficies grandes (chapters, philosophy, hero) usan la editorial.
- **R3**: El naranja `#C85204` es el **único acento**, en ambas paletas.
- **R4**: Verde / azul / rojo: prohibidos. Charts monocromos del orange + peach + ink + mid.

---

## 2. Tipografía · Montserrat (oficial)

> Manual p.16: *"A tipografia Montserrat foi escolhida pela sua modernidade, estética profissional e por garantir uma fácil leitura. Além disso, é uma fonte open source."*

### 2.1 Familia
- **Montserrat** — Google Fonts. Pesos 200, 300, 400, 500, 600, 700, 800 + italics 300/400/700.
- **JetBrains Mono** — para metadata, captions técnicos, footer nav.

### 2.2 Voces tipográficas

| Voz | Peso | Tracking | Uso |
|---|---|---|---|
| Display | Montserrat **Light 300** | -0.02em | Hero, taglines, h1 |
| Editorial | Montserrat **Bold 700 Italic** | -0.02em | Frases-filosofía (4 momentos en el scroll) |
| Numeral | Montserrat **Light 300** | -0.04em | KPIs gigantes (198M€, 17,2%, 03) |
| Caps mono | JetBrains Mono **Medium 500** | 0.14em | Eyebrows, footer nav, etiquetas |
| Body | Montserrat **Regular 400** | 0 | Texto corrido (62ch max-width, 1.55 leading) |
| Wordmark caps | Montserrat **Medium 500** | 0.32em | "SGOIC" debajo del wordmark |

### 2.3 Escala (`--nx-size-*`)
Modular base 16. Ver `nx-tokens.css` §SCALE.

---

## 3. Logo · Construcción

> Manual pp. 4–14. Reglas estructurales de la marca.

### 3.1 Anatomía
El logotipo es **dos elementos modulares**:
1. **Wordmark NEXA**: glifos geométricos custom (N completa con diagonal · ≡ tres barras en lugar de E · X sólida · ∧ V invertida en lugar de A).
2. **Ícon X**: **dos pares de líneas cruzadas con gap central** (nexus, conexión).

### 3.2 La X-ícon — segmentada, NO sólida

Diferencia crítica: el ícono X **no es una X tipográfica**. Son **4 strokes diagonales** con un gap rectangular en el centro. La metáfora: dos líneas que se aproximan a cruzarse, suspendidas en el punto de conexión.

SVG canonical (viewBox 100×100, stroke ≈ 8% del viewBox):

```html
<svg viewBox="0 0 100 100">
  <line x1="14" y1="14" x2="42" y2="42" stroke-width="8"/>
  <line x1="58" y1="58" x2="86" y2="86" stroke-width="8"/>
  <line x1="86" y1="14" x2="58" y2="42" stroke-width="8"/>
  <line x1="42" y1="58" x2="14" y2="86" stroke-width="8"/>
</svg>
```

### 3.3 Versiones (en orden de preferencia)
1. **Versão Principal · Com ícon · Central** — icon arriba + NEXA + SGOIC (apilados) → para layouts centrados.
2. **Versão Principal · Com ícon · Horizontal** — icon | NEXA | SGOIC (en línea) → para layouts left/right.
3. **Versão Secundária · Sem ícon** — solo wordmark + SGOIC → uso pontual.
4. **Versão Extensa** — wordmark + "Sociedade Gestora de Organismos de Investimento Coletivo" → docs formales.
5. **Versão Monocromática** — preto (#03020C) o branco (#FFFFFF), única opción permitida fuera de la paleta.

### 3.4 Reglas duras

- **R5**: Tamaño mínimo en web = altura de N ≥ 18px (caracteres ≥ 14px).
- **R6**: Área de protección = altura de N en los 4 lados. Sin elementos dentro.
- **R7**: Tracking del wordmark: fijo. No apretar ni expandir.
- **R8**: SGOIC siempre presente en la "Versão Principal".
- **R9**: Prohibido (Manual p.14):
   - Alterar colores
   - Cambiar tipografía o proporciones
   - Aplicar sombras / volúmenes / contornos
- **R10**: En la web, el ícon X puede animarse (drawing-in, transformaciones suaves), pero la wordmark NEXA **no se distorsiona** — solo aparece o desaparece.

---

## 4. Iconografía

- ❌ Stock icons (Heroicons, Font Awesome, Material).
- ❌ Emojis.
- ✅ Hairlines (1px) como separadores y conectores.
- ✅ Variantes del ícon X (segmented) como motivo recurrente.
- ✅ Primitivas geométricas custom para data viz (círculos, líneas, dashes).
- ✅ LEED Gold® official seal (en `uploads/leed/`).

---

## 5. Patterns generativos

Cuatro patrones-firma, uno por momento narrativo. Heredados del impreso (pp. 8, 23, 28, 30 RS_NEXA_2025).

| Pattern | Inspiración (pg RS) | Momento narrativo | Animación |
|---|---|---|---|
| **A · Skyline bars** | pg 8 | Solidez · portfolio · construir | Bars rise from bottom, stagger |
| **B · Wind dashes** | pg 23 | Transición climática · cambio | Dashes drift, loop infinito |
| **C · Wheat field** | pg 28 | Rigor · governance · tejido | Stalks breathe in opacity |
| **D · Sun bursts** | pg 30 (chapter) | Perspetivas futuras | Cada sun spins (12–22s, alternating direction) |

Reglas:
- **R11**: SVG/CSS generativo. No imágenes raster.
- **R12**: Cada pattern responde al cursor (paralaje sutil ±6px).
- **R13**: Solo **un** pattern visible a la vez en pantalla.

---

## 6. Componentes

Inventario en `Design System.html` §05. Prefijo `.nx-*`.

| Componente | Selector | Superficie | Origen (pg RS) |
|---|---|---|---|
| Vertical KPI pill | `.nx-vpill` | ink | pg 4 (198M€, 10, 8) |
| Square stat | `.nx-statbox` | paper | pg 4 (números orange) |
| Wide stat band | `.nx-widestat` | ink | pg 18 (17,2%) |
| Materiality tag | `.nx-tag` | varía | pg 14 |
| Footer chapter nav | `.nx-footnav` | paper | todas |
| Asset card | `.nx-asset` | paper | pp. 9-10 |
| Editorial quote | `.nx-quote` | ink | pp. 8, 23, 28, 35 |

Reglas:
- **R14**: Cada componente en **una sola superficie** (ink, paper, o orange). Sin gradientes internos de surface.
- **R15**: Border-radius: solo `--nx-r-md` (10px) o `--nx-r-pill` (999px).
- **R16**: Sombras: ninguna por defecto. `--nx-shadow-card` solo en hover de cards.

---

## 7. Motion · Coreografía

### 7.1 Principios
1. **Siempre algo en movimiento.** Patterns, micro-paralaje, cursor.
2. **Entrada desde un lado.** Cada elemento entra desde right/left/top/bottom/scale-in. Stagger 40ms × index.
3. **Easings nombradas:** `arch` (default), `out` (UI), `spring` (sparse), `in` (salidas).
4. **Durations limitadas:** `quick 180ms`, `base 360ms`, `slow 720ms`, `epic 1400ms`.

### 7.2 Scroll choreography (Pentagram-style)
- **R17**: Cada sección define 3–5 beats triggered a 10/30/50/70/90% de viewport.
- **R18**: Secciones consecutivas usan ejes de entrada distintos (right vs left vs scale).
- **R19**: Elementos respiran después de entrar (micro-loop).
- **R20**: La X-ícon segmentada actúa como cursor companion con damping 18%.

### 7.3 Reduced motion
- **R21**: NUNCA usar `prefers-reduced-motion: reduce` como off-switch global (iOS Low Power Mode lo dispara y rompe el sitio). Sí para: cursor (off), pattern spin (a 60s), parallax (off).

### 7.4 Tipos de animación a usar (per MFZ direction)
- ✅ Section reveals al entrar viewport
- ✅ Number count-ups (cubic ease)
- ✅ Cursor interactivo (X segmentada follow + hot state)
- ✅ Scroll-driven (paralaje, color shifts)
- ✅ Scale-in y "settle" (signature Pentagram)
- ✅ Color changes on hover (tags invierten a ink)
- ❌ Page transitions JS-heavy
- ❌ Carousels auto-rotate

---

## 8. Layout

- **R22**: 12-column grid · `gap: clamp(16px, 2vw, 32px)` · max-width `1440px` · padding `clamp(24px, 4vw, 72px)`.
- **R23**: Sections nunca centered title. Eyebrow + número + título left-aligned (escalonados).
- **R24**: Frases-filosofía right-aligned, ancladas a esquina (heredado del impreso).
- **R25**: Chapter covers half-bleed (mitad orange + mitad bone). Numeral en la mitad orange.

---

## 9. Bilingüe · PT ↔ EN

- **PT** default (português europeu, exact match al PDF). **EN** toggle on-demand.
- Persistencia: `localStorage.nx-lang`.
- Hidratación via `data-i18n="key"` + diccionario `STRINGS.pt / STRINGS.en` (ver `NEXA.html`).
- Voz EN: institutional fund-grade, "we" para Nexa, calco directo del PT con ajuste idiomático mínimo.

---

## 10. Estructura del scroll (variation A · default)

```
00 HERO                          [ink · X-icon assembles · wordmark builds · SGOIC]
01 TAGLINE                       [ink · "Connect, Invest, Build the future."]
02 IMPACT                        [bone · 198M€ + 18 ativos + 10 colaboradores]
03 MATERIALITY                   [ink · matriz interactiva · tags]
04 ENVIRONMENTAL                 [bone · 17,2% + mini chart + chips]
05 PHILOSOPHY                    [ink · skyline + frase italic bold]
06 CHAPTER COVER 03              [half-bleed orange · suns + 03 numeral]
07 EXPLORE                       [paper · 4 cards de capítulos]
FOOTER                           [ink · wordmark gigante + efeito surpresa]
```

---

## 11. Variations (3 opciones por explorar)

- **A — Editorial long-scroll** (default, implementado en `NEXA.html`). Long-scroll con secciones encadenadas.
- **B — Half-deck**: home con destaques en grid; cada sección expande full-bleed al click.
- **C — Pin-stage cinematográfico**: cada sección pin-sticky mientras scroll-horizontal o transform.

Pendiente decisión de MFZ.

---

## 12. Estructura del repo

```
report-2025/
├── index.html                  Página completa (single-file)
├── nx-tokens.css               Tokens de design
├── BRAND_GUIDELINES.md         Este documento
├── design-system.html          Specimen visual
├── HANDOFF_IT.md               Documentación para IT NEXA
├── README.md
├── assets/brand/               Logo + Manual de Normas
├── brand/                      Variantes del logo
├── data/                       16 JSONs estruturados
├── pdfs/RS_NEXA_2025.pdf       PDF oficial del relatório
└── uploads/
    ├── leed/                   Selo LEED Gold®
    └── projects/               Fotos dos ativos
```

### 12.3 Próximos pasos para que Claude Code arme `index.html`

1. **Mover** `nx-tokens.css` a la raíz del repo.
2. **Importar Montserrat** via Google Fonts en el `<head>`.
3. **Usar SVG inline** para la X-ícon (4 strokes segmentados) y para la wordmark NEXA (geometric glyphs).
4. **Para imagen oficial del logo**: usar los PNG/AI de `assets/brand/Logo/Logo/0_Versao_Principal/`.
5. **Datos**: leer de `data/*.json` (especialmente `environmental.json` para los 17,2% y demás).
6. **Strings i18n**: extraer del bloque `STRINGS` en `NEXA.html` a archivos JSON separados.
7. **Construir sección por sección** siguiendo §10. Implementar la coreografía Pentagram-style descrita en §7.
8. **Validar mobile** <380px (lecciones RS26: hero translateX magnitudes pequeñas).
9. **Deploy** a GitHub Pages desde `main` rama, source `/`.

---

## 13. Lo que NO replicar

- ❌ Paleta de 5 colores (NEXA es duotono brand + neutrals).
- ❌ Verde ESG / azul institucional.
- ❌ X sólida (NEXA tiene X segmentada — nexus mark).
- ❌ Wordmark con caracteres Unicode (es geometric SVG custom).
- ❌ Quote-orbits / personitas isotype (eso es vocabulario Castro Group RS26).
- ❌ Carousels, modales pesados, page transitions JS-heavy.

---

## 14. "Efeito surpresa"

Pg 37 del impreso cierra con la frase **"efeito surpresa"** casi invisible. Honrar en la web:

> Después del footer, si el usuario hace scroll-down extra (overscroll), aparece la X-ícon completándose en pantalla, después se transforma en el numeral **"2026"** que se queda 2 segundos y se desvanece. Sin texto. Sin explicación. Es una guiñada.

---

## 15. Pendientes para MFZ

- [ ] Aprobar paleta dual (brand institucional + extensión editorial RS)
- [ ] Aprobar variation: A / B / C
- [ ] Subir fotografías de los 18 ativos (a `assets/photos/assets/`)
- [ ] Subir 4 retratos board (a `assets/photos/people/`)
- [ ] Revisar strings EN (currentemente traducción direct del PT)
- [ ] Aprobar el cierre "efeito surpresa"

---

*Documento vivo. Versionar antes de cada PR significativa.*

— Claude Design / NEXA · 2026-05-15 · v0.2
