# NEXA · Relatório de Sustentabilidade 2025 · Handoff IT

> Documento para o equipa IT da Nexa SGOIC, S.A.
> Objetivo: ativar o site público sob o domínio `nexa-sgoic.pt`.
>
> **Data**: 2026-05-19
> **Site origem**: <https://nexa-sgoic.github.io/report-2025/>
> **Repositório**: <https://github.com/nexa-sgoic/report-2025>
> **Responsável de conteúdo**: Fernanda Zelaya · Responsável ESG da NEXA

---

## 0 · TL;DR · 3 passos para apontar o domínio

1. **DNS** · criar um CNAME em `nexa-sgoic.pt` apontando para `nexa-sgoic.github.io` (subdomínio sugerido: `sustentabilidade.nexa-sgoic.pt`).
2. **Repo** · adicionar um ficheiro `CNAME` na raíz do repo com o subdomínio escolhido.
3. **GitHub Pages** · ativar HTTPS nas settings do repo após a propagação DNS (24-48h).

Pronto. Sem servidores, sem build, sem CI/CD. É um único `index.html` servido estaticamente pelo GitHub Pages.

---

## 1 · O que é este site

Single-page editorial bilíngue (PT default · EN toggle) com o Relatório de Sustentabilidade 2025 da NEXA SGOIC. Conteúdo fiel ao PDF impresso (cross-checked com `pdfs/RS_NEXA_2025.pdf`).

**Stack**: HTML estático + CSS + JavaScript vanilla. **Sem framework, sem build step, sem dependências externas em runtime** (só Google Fonts CDN para Montserrat + JetBrains Mono).

**Tamanho**: ~265 KB de HTML único + ~6 KB de tokens CSS + ~4 MB de fotos dos ativos (em `uploads/projects/`).

**Browser support**: Chrome / Edge / Firefox / Safari modernos (últimas 2 versões). Mobile-first, iOS + Android.

---

## 2 · Opção A · GitHub Pages com subdomínio NEXA (recomendado)

A configuração atual já tem GitHub Pages ativo. Falta só apontar um subdomínio próprio.

### 2.1 · Configurar DNS no provedor de `nexa-sgoic.pt`

No painel DNS do registrador (cPanel, Cloudflare, OVH, etc.), adicionar:

```
Tipo    Nome                          Valor                                        TTL
CNAME   sustentabilidade               nexa-sgoic.github.io.   3600
```

> Sugestões alternativas de subdomínio: `relatorio.nexa-sgoic.pt`, `rs.nexa-sgoic.pt`, `2025.nexa-sgoic.pt`.

Não é necessário modificar registros A — GitHub Pages resolve via CNAME directly.

### 2.2 · Adicionar `CNAME` no repo

Na raíz do repositório, criar um ficheiro chamado **CNAME** (sem extensão), conteúdo:

```
sustentabilidade.nexa-sgoic.pt
```

Pode ser feito via interface web do GitHub: `Add file → Create new file → CNAME`.

### 2.3 · Ativar HTTPS

GitHub → repo → **Settings → Pages**:
- Confirmar que `Source` = `Deploy from a branch · main · /`
- Em **Custom domain**, escrever `sustentabilidade.nexa-sgoic.pt` (já preenchido se o CNAME está no repo)
- Aguardar 5-30 min após a propagação DNS
- Marcar o checkbox **Enforce HTTPS** quando ficar disponível

### 2.4 · Verificar

```
nslookup sustentabilidade.nexa-sgoic.pt
# deve retornar IPs do GitHub Pages (185.199.108-111.153)

curl -I https://sustentabilidade.nexa-sgoic.pt/
# deve retornar HTTP/2 200
```

---

## 3 · Opção B · Hosting próprio (Vercel / Netlify / servidor da empresa)

Se preferirem não usar GitHub Pages:

1. Fazer `git clone https://github.com/nexa-sgoic/report-2025.git`
2. Servir o conteúdo estático do repo a partir de qualquer servidor HTTP (nginx, Apache, S3+CloudFront, Vercel, Netlify, etc.)
3. Configurar o vhost para responder em `sustentabilidade.nexa-sgoic.pt`
4. Activar HTTPS com Let's Encrypt ou certificado próprio

Não há nenhuma rota dinâmica · qualquer servidor de ficheiros estáticos serve.

---

## 4 · Opção C · ZIP estático para upload manual

Para quem prefere descarregar e fazer upload via FTP:

1. No GitHub repo, **Code → Download ZIP** (ou clone + zip)
2. Descomprimir
3. Upload de **todo o conteúdo** (preservando estrutura de pastas) para o webroot do servidor
4. Apontar o subdomínio para a pasta no servidor

Ficheiros e pastas necessários:
- `index.html` (obrigatório · é a página inteira)
- `nx-tokens.css` (obrigatório · tokens de design)
- `brand/` (logos PNG)
- `assets/brand/` (variantes do logo)
- `uploads/projects/` (fotos dos ativos referenciadas pelo modal)
- `uploads/leed/` (selo LEED)
- `pdfs/RS_NEXA_2025.pdf` (linkado pelo botão "PDF" da nav)
- `data/` (JSONs · não usados em runtime hoje mas mantidos para edições futuras)

Não são necessários: `_archive/`, `docs/`, `uploads/font/`, `uploads/references/`.

---

## 5 · Manutenção · como editar conteúdo no futuro

Todo o conteúdo está embebido no `index.html`. Para alterar valores numéricos (KPIs, percentagens, datas):

1. Abrir `index.html` num editor (VS Code, Notepad++)
2. Procurar pelo valor a alterar (Ctrl+F)
3. Há duas instâncias na maioria dos casos:
   - A versão **PT** (texto em `data-i18n=" ... "` + valor no markup)
   - A versão **EN** (no objecto `STRINGS.en` no JavaScript)
4. Guardar
5. `git commit` + `git push` (se usando GitHub Pages, rebuild automático em 1-3 min)

Para o reporte 2026 ou futuras edições, **considerar refatorar para ler de `data/*.json`** em vez de embebido no HTML. Os 16 JSONs em `data/` já contêm a estrutura.

### Atualizar fotos dos ativos

Adicionar a foto a `uploads/projects/` com nome ASCII (sem espaços nem acentos, ex: `palacete.jpg`). Depois editar em `index.html` o array `ASSETS`, no campo `photo` do ativo correspondente.

### Adicionar idiomas

A toggle PT/EN está hard-coded. Para suportar outro idioma:
1. Adicionar `STRINGS.es = { ... }` no JavaScript (clonar de `STRINGS.en` e traduzir)
2. Adicionar `<button data-lang="es">ES</button>` no `.nx-chrome__lang`

---

## 6 · Performance & SEO

- **Page weight**: ~290 KB HTML/CSS/JS + ~4 MB fotos. Lighthouse Mobile ~85 (penalizado pelas fotos, que são essenciais).
- **First Contentful Paint** em 4G mobile: ~1.5s.
- **Time to Interactive**: ~2.5s.
- **Acessibilidade**: ARIA labels em todos os interactive elements · contraste WCAG AA.
- **SEO**: o `<title>` traduz com o toggle de idioma. Sem sitemap.xml — o conteúdo é uma SPA estática, não precisa.

Para melhorar performance:
- Converter fotos `uploads/projects/*.jpg` para WebP (mantém qualidade, reduz tamanho ~30%)
- Comprimir o PDF `pdfs/RS_NEXA_2025.pdf` (2.6 MB) com Ghostscript se precisar de descarga rápida

---

## 7 · Segurança

- Sem backend → sem superfície de ataque servidor-side
- Sem cookies → sem GDPR cookie banner necessário
- Sem analytics → não enviamos dados a terceiros (se quiserem adicionar: Plausible / Fathom são privacy-friendly)
- Conteúdo do PDF é informação pública corporativa (não há dados pessoais sensíveis)

---

## 8 · Suporte & contato

Para questões técnicas sobre o código:
- Repo GitHub: <https://github.com/nexa-sgoic/report-2025>
- Memória do projeto: ver `README.md` no repo

Para questões de conteúdo:
- Fernanda Zelaya · Responsável ESG NEXA · `mariafernandazelayaferrer@gmail.com`

---

*Documento gerado 2026-05-19 · cobre Pages atual + opções alternativas de hosting.*
