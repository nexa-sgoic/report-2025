# NEXA · Handoff to Claude Code

> Documento de transferencia del trabajo de diseño hecho en Claude Design al desarrollo en Claude Code.
> Esta página resume **qué fue producido**, **qué hay que copiar al repo**, y **qué pasos seguir**.
>
> **Fecha**: 2026-05-15
> **De**: Claude Design (Fernanda Zelaya, MFZ)
> **Para**: Claude Code

---

## 1. TL;DR — qué hacer en 5 minutos

Copiar **4 archivos** desde Claude Design al repo `sustainability-reports-NEXA/`:

```
sustainability-reports-NEXA/
├── NEXA.html                    ← prototipo home (this is the main file)
├── Design System.html           ← specimen visual del design system
├── nx-tokens.css                ← tokens CSS (colores, type, motion)
└── BRAND_GUIDELINES.md          ← decisiones numeradas + reglas
```

Y un sub-folder con assets ya copiados/optimizados:

```
sustainability-reports-NEXA/brand/
├── logo_horizontal_on_dark_orange_x.png   ← logo principal sobre dark (footer)
├── logo_central_fundo_branco.png          ← logo central versão sobre blanco
├── logo_horizontal_black_orange.png       ← logo horizontal sobre claro
└── KIT_Normas_NEXA.pdf                    ← manual de normas oficial (copia)
```

Eso ya alcanza para que Claude Code abra `NEXA.html` y todo funcione.

---

## 2. Estado actual del prototipo

`NEXA.html` es un **long-scroll editorial** con 7 momentos:

| # | Sección | Surface | Idea principal |
|---|---|---|---|
| 00 | **HERO** | ink | El logo NEXA se ensambla desde 14 segmentos dispersos (cinematográfico, Pentagram-style). Después la X-icon pulsa, después NEXA pulsa. |
| 01 | **IMPACT** | bone | "198M€" gigante + 3 mini KPIs (18 ativos, 10 colaboradores, 3 OIC). Watermark de X segmentada. |
| 02 | **MATERIALITY** | ink | **Mapa radial** estilo Climate Tech Map: 17 raios desde el centro, sectores E/S/G coloreados, hover destaca. |
| 03 | **ENVIRONMENTAL** | bone | "17,2%" gigante + 3 chips de stats + mini barras animadas. |
| 04 | **PHILOSOPHY** | ink | Frase italic bold sobre fondo de skyline-bars animado. |
| 05 | **CHAPTER COVER 03** | half-bleed orange | Sun-burst wallpaper + "03" numeral + lista de objetivos. |
| 06 | **EXPLORE** | paper | 4 cards de capítulos para continuar la lectura. |
| Footer | | ink | Logo oficial PNG + "efeito surpresa" easter-egg. |

### Características técnicas implementadas
- ✅ Cursor companion (X segmentada naranja que sigue al puntero con damping)
- ✅ Top chrome con scroll progress bar (línea vertical naranja a la derecha)
- ✅ Toggle PT/EN persistente (`localStorage.nx-lang`)
- ✅ Diccionario i18n inline (`STRINGS.pt` / `STRINGS.en`)
- ✅ Reveals al entrar viewport (`IntersectionObserver` con threshold .25)
- ✅ Count-ups numéricos al scrollear (198 → 198M€, 18, 10, 3, 17,2)
- ✅ 4 patterns generativos en SVG/CSS (skyline, suns)
- ✅ Easings nombradas: `arch / out / spring / in`

---

## 3. Archivos del paquete · qué hace cada uno

### 3.1 `NEXA.html` (~890 líneas)
Single-file HTML self-contained. Contiene CSS embebido y JS embebido. Solo dependencia externa: Google Fonts (Montserrat + JetBrains Mono) y el CSS de tokens.

**Estructura interna:**
- `<head>` — fonts + `<link rel="stylesheet" href="nx-tokens.css">`
- `<style>` — todos los estilos de las secciones (700 líneas)
- `<body>` — markup HTML semántico
- `<script>` — JS inline para cursor, scroll progress, reveals, count-ups, patterns, radial map, i18n

**Imports que Claude Code podría querer extraer:**
- El bloque `STRINGS` (i18n) → mover a `strings/pt.json` + `strings/en.json`
- El JS de `buildRadial()` → mover a `js/radial-map.js`
- El JS de `setupAssembly()` → mover a `js/hero-assembly.js`
- Los CSS de cada sección → mover a `css/sections/*.css`

**Pero esto es opcional.** Si Claude Code prefiere mantener single-file, está bien.

### 3.2 `Design System.html`
Página de referencia visual mostrando el sistema completo:
- Hero con X mark
- Logo anatomy (4 variantes)
- Paleta de colores
- Specimen tipográfico
- 4 patterns animados
- Inventario de componentes (.nx-vpill, .nx-statbox, .nx-widestat, .nx-tag, .nx-asset, .nx-quote, .nx-footnav)
- Tabla de motion / easings
- 3 mocks de composición

**Uso**: referencia para Claude Code (y MFZ) cuando se quiera ver "cómo se ve cada componente individualmente". No es producto final.

### 3.3 `nx-tokens.css`
Tokens CSS variables (~150 líneas):

```
:root {
  /* Brand · oficial Pantone */
  --nx-brand-ink:    #03020C;
  --nx-brand-orange: #C85204;
  --nx-brand-white:  #FFFFFF;
  --nx-brand-peach:  #EDCCC0;

  /* Editorial · extensión cálida */
  --nx-ink:          #2D2D2C;
  --nx-orange:       #C85204;     /* === brand */
  --nx-orange-deep:  #A8420A;
  --nx-orange-soft:  #EDCCC0;     /* === brand peach */
  --nx-bone:         #EDEAE3;
  --nx-paper:        #F5F2EB;
  --nx-mid:          #9A9794;
  --nx-line:         #D6D1C7;

  /* Type · Montserrat */
  --nx-font-sans:    "Montserrat", ...;
  --nx-font-mono:    "JetBrains Mono", ...;

  /* Scale · 11 sizes (3xs → 6xl) */
  /* Weight · thin → black */
  /* Spacing · s-1 → s-11 */
  /* Motion · 4 durations + 4 easings */
}
```

**Crítico**: este archivo es la "source of truth" del diseño. Cualquier cambio de color/tipografía/spacing debe pasar por acá, no por inline CSS en componentes.

### 3.4 `BRAND_GUIDELINES.md`
Decisiones numeradas (R1–R25) cubriendo:
- §1 Color · paleta dual brand + editorial
- §2 Tipografía · Montserrat oficial
- §3 Logo · construcción del wordmark + X segmentada
- §4 Iconografía · sin stock, sin emojis
- §5 Patterns · 4 generativos
- §6 Componentes · inventario `.nx-*`
- §7 Motion · choreografía Pentagram-style
- §8 Layout · grid y ritmo
- §9 Bilingüe · PT default + EN toggle
- §10 Estructura del scroll
- §11 Variations (A/B/C)
- §12 Archivos del proyecto
- §13 NO replicar de proyectos anteriores
- §14 "efeito surpresa"
- §15 Pendientes para MFZ

---

## 4. Estructura final propuesta del repo

```
sustainability-reports-NEXA/
│
├── 📄 README.md                          ✅ ya existe
├── 📄 NEXA.html                          ← COPIAR (prototipo home)
├── 📄 Design System.html                 ← COPIAR (specimen)
├── 📄 nx-tokens.css                      ← COPIAR (tokens)
├── 📄 BRAND_GUIDELINES.md                ← COPIAR (decisiones)
├── 📄 HANDOFF_TO_CLAUDE_CODE.md          ← este documento
│
├── 📁 brand/                             ← COPIAR (logos optimizados)
│   ├── logo_horizontal_on_dark_orange_x.png
│   ├── logo_central_fundo_branco.png
│   ├── logo_horizontal_black_orange.png
│   └── KIT_Normas_NEXA.pdf
│
├── 📁 assets/                            ✅ ya existe
│   └── brand/                            (logos AI + manual completo)
│       ├── Logo/
│       └── Manual_Normas/
│
├── 📁 data/                              ✅ ya existe (16 JSONs)
│   ├── assets.json
│   ├── company.json
│   ├── environmental.json
│   ├── materiality.json
│   └── ... (los demás 12)
│
├── 📁 docs/                              ✅ ya existe
│   └── DESIGN_BRIEF.md
│
├── 📁 pdfs/                              ✅ ya existe
│   └── RS_NEXA_2025.pdf
│
├── 📁 uploads/                           ✅ ya existe
│   ├── font/Fonte_Montserrat/           (fuentes TTF + variable)
│   ├── leed/                            (sello LEED Gold)
│   └── references/                      (PDF pages + videos)
│
└── 📁 (futuro · cuando Claude Code arme):
    ├── index.html                        (la página final, derivada de NEXA.html)
    ├── strings/
    │   ├── pt.json
    │   └── en.json
    ├── js/
    │   ├── hero-assembly.js
    │   ├── radial-map.js
    │   ├── i18n.js
    │   ├── cursor.js
    │   └── reveals.js
    ├── css/
    │   ├── sections/
    │   └── components/
    └── assets/photos/                    (fotos reales de los 18 ativos · MFZ subirá)
```

---

## 5. Cómo copiar los archivos al repo

### Opción A · Descargar individualmente
Cada artifact en Claude Design (sidebar derecha) tiene botón "Download". Bajá los 4 archivos manualmente y los pegás en el folder local del repo `C:\Users\fzelaya\Documents\GitHub\sustainability-reports-NEXA\`.

### Opción B · Copy-paste por terminal
```bash
cd C:\Users\fzelaya\Documents\GitHub\sustainability-reports-NEXA

# pegar el contenido de cada uno
notepad NEXA.html
notepad "Design System.html"
notepad nx-tokens.css
notepad BRAND_GUIDELINES.md
notepad HANDOFF_TO_CLAUDE_CODE.md
```

### Opción C · Vía Claude Code mismo
Decirle a Claude Code:
> *Lee `NEXA.html`, `Design System.html`, `nx-tokens.css` y `BRAND_GUIDELINES.md` desde el último mensaje de Claude Design en este chat (los archivos generados están adjuntados) y guárdalos en el root del repo.*

Probablemente la **Opción A** es la más simple.

### Para los logos:
Crear `brand/` en el root del repo y copiar desde `assets/brand/Logo/Logo/0_Versao_Principal/Com_icon/PNG/sem_fundo/`:
- `Nexa_horizontal_branco_laranja.png` → renombrar a `logo_horizontal_on_dark_orange_x.png`
- `Nexa_central_fundo_branco.png` (de `com_fundo/`) → `logo_central_fundo_branco.png`
- `Nexa_horizontal_preto_laranja.png` (de `sem_fundo/`) → `logo_horizontal_black_orange.png`

Estos paths simplificados son los que `NEXA.html` actualmente referencia.

---

## 6. Primer prompt para Claude Code

Una vez que los archivos estén en el repo, abrí Claude Code en el folder del repo y mandale algo como:

```
Estoy trabajando en la página web del Relatório de Sustentabilidade NEXA 2025.

He recibido un prototipo de diseño (NEXA.html) de Claude Design junto a su
design system (Design System.html), tokens (nx-tokens.css) y guidelines
(BRAND_GUIDELINES.md y HANDOFF_TO_CLAUDE_CODE.md).

Por favor:

1. Lee HANDOFF_TO_CLAUDE_CODE.md y BRAND_GUIDELINES.md primero para entender
   el sistema completo.

2. Lee NEXA.html para entender el prototipo actual.

3. Revisá los JSON en data/ para entender los datos del reporte.

4. Hagamos un plan: el prototipo NEXA.html es un single-file. Quiero
   refactorizarlo a una arquitectura mantenible:
   - index.html (el HTML semántico, con imports)
   - strings/pt.json + strings/en.json (i18n extraído)
   - js/ separado por módulos (hero-assembly, radial-map, cursor, i18n, reveals)
   - css/sections/ separado por sección
   - Mantenemos nx-tokens.css como source-of-truth de tokens

5. Después de refactorizar, hagamos los siguientes pasos sobre la página real:
   - Conectar las secciones con data/*.json (hoy hay strings hardcoded)
   - Configurar deploy a GitHub Pages
   - Agregar las fotos reales de los 18 ativos cuando estén disponibles
   - Pasar a las próximas variations (B Half-deck, C Pin-stage) si MFZ las pide

Empezá por leerme NEXA.html y decime cuál es tu plan de refactor antes
de tocar nada.
```

---

## 7. Pendientes para MFZ antes del refactor

- [ ] **Subir fotos reales** de los 18 ativos imobiliários → `assets/photos/ativos/`
- [ ] **Subir 4 retratos** del Board → `assets/photos/board/`
- [ ] **Revisar strings EN** dentro de `NEXA.html` (actualmente son calco directo del PT)
- [ ] **Aprobar variation**: ¿quedamos con la A (long-scroll editorial actual) o exploramos B (Half-deck) o C (Pin-stage cinematográfico)?
- [ ] **Decidir si querés sumar**: mapa interactivo de Portugal con los 18 ativos (estilo Climate Tech Map pero geográfico) — siguiente sección potencial
- [ ] **Validar colores en pantalla calibrada**: el naranja oficial `#C85204` rendereado en monitor vs impreso

---

## 8. Lo que **NO** hacer

Reglas que vienen del Manual de Normas (`KIT_Normas_NEXA.pdf` p.14):

- ❌ Alterar los colores del logo
- ❌ Cambiar formato, tipo de letra, o forças de tamaño del wordmark
- ❌ Aplicar sombras, volúmenes o contornos al logo
- ❌ Mezclar la paleta editorial cálida con el logo (el logo siempre usa paleta brand oficial)

Reglas heredadas de este proyecto:

- ❌ Verde ESG / azul institucional · NEXA es duotone
- ❌ X sólida en el ícono · es segmentada (nexus)
- ❌ Tagline "Connect, Invest, Build the future." en la home · ya está en nexa-sgoic.pt
- ❌ `prefers-reduced-motion` como off-switch global · iOS Low Power Mode lo dispara
- ❌ Carousels auto-rotate, page transitions JS-heavy

---

## 9. Contacto continuo con Claude Design

Si surgen decisiones de diseño durante el dev en Claude Code (nuevos componentes, ajustes de paleta, nuevas secciones), volver a Claude Design para:
- Diseñar el nuevo componente
- Actualizar tokens si hace falta
- Actualizar BRAND_GUIDELINES.md
- Actualizar Design System.html con el nuevo componente

Claude Code implementa. Claude Design decide.

---

*Documento generado por Claude Design · NEXA · 2026-05-15 · v0.2*
