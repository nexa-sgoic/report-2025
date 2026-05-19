# NEXA · Relatório de Sustentabilidade 2025

Edição web do Relatório de Sustentabilidade da **Nexa SGOIC, S.A.** — sociedade gestora de organismos de investimento coletivo regulada pela CMVM (Portugal).

**Site live**: <https://nexa-sgoic.github.io/report-2025/>

---

## Sobre o relatório

Período coberto · 1 de janeiro a 31 de dezembro de 2025 (com comparativos vs 2024).

- 198 M€ em ativos sob gestão
- 18 ativos imobiliários em 8 cidades de Portugal
- 10 colaboradores
- 3 OIC sob gestão (Icon SIC, Fuse Valley FII, Castro Capital SIC)
- Primeira certificação LEED Gold® · edifício La Movida

PDF oficial · `pdfs/RS_NEXA_2025.pdf`

---

## Stack técnico

Long-scroll editorial bilingüe (PT default · EN toggle). Single-file `index.html` (HTML + CSS + JavaScript inline · sem framework · sem build step). Servido estaticamente via GitHub Pages.

- `index.html` — página completa
- `nx-tokens.css` — tokens de design (cores, tipografia, espaçamento)
- `BRAND_GUIDELINES.md` — decisões de design v0.2 (paleta, tipografia, layout)
- `design-system.html` — specimen visual do sistema
- `data/` — JSONs estruturados (referência para edições futuras)
- `brand/` + `assets/brand/` — kit oficial (logos, normas)
- `uploads/projects/` — fotos dos ativos
- `uploads/leed/` — selo LEED Gold®
- `pdfs/` — PDF oficial do relatório

### Local

```
python -m http.server 8765
# http://localhost:8765/
```

---

## Manutenção e domínio

Configuração técnica para a equipa IT (apontar subdomínio NEXA, alternativas de hosting): ver `HANDOFF_IT.md`.

---

## Contacto

Fernanda Zelaya · Responsável ESG da NEXA
