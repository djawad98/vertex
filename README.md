# Vertex website

Next.js static export, deployed to GitHub Pages on a custom domain.

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # writes out/
npm run check      # every page: one h1, title, description, no broken local links
npm start          # serve out/ at http://localhost:4173
```

## Pages

`/` home, `/services/`, `/work/`, `/mag/` + `/mag/<slug>/`, `/about/`, `/contact/`.

## Content

- Copy, services, projects, results, team, phone, address: `app/content.ts`.
- Mag posts: `app/mag/posts.ts` (one string per paragraph, `## ` for subheadings).
- Before launch, replace in `app/content.ts`:
  - `site.email` (placeholder)
  - the project `results` (illustrative numbers, marked TODO)
  - `site.geo` (approximate Ghasem Abad pin; set the tower's exact coordinates)

## Contact form

GitHub Pages has no server. Create a free form endpoint (Formspree, Web3Forms, etc.) and set it as
`NEXT_PUBLIC_FORM_ENDPOINT` (repo variable `FORM_ENDPOINT` in CI). Without it, the form opens the
visitor's email app with the message filled in.

## Images

Raw files live in `_src/` (not deployed, not in git). `npm run assets` turns them into WebP in `public/`.

- Project screenshots: `_src/shots/<id>-desktop.png` and `<id>-mobile.png` (ids: `hamyar`, `subchi`, `hitech`).
  Missing ones render as placeholders. Capture a live site with `npm run shoot -- https://site.ir _src/shots/<id>`.
- Team photos: mapped in `scripts/assets.mjs`. Hana has no photo yet, so her card shows initials.

## Deploy to GitHub Pages

Every push to `main` runs `.github/workflows/pages.yml`, which builds, runs the check and publishes.

- **Now:** no `CUSTOM_DOMAIN` variable, so the site is built for https://djawad98.github.io/vertex/ (base path `/vertex`).
- **Moving to vertex-software-solutions.ir:**
  1. At your DNS provider, add `A` records for the domain: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
  2. Repo **Settings > Secrets and variables > Actions > Variables**: add `CUSTOM_DOMAIN` = `vertex-software-solutions.ir`.
  3. Repo **Settings > Pages**: enter the same custom domain, then enable **Enforce HTTPS** once the certificate is issued.
  4. Re-run the workflow. It builds without the `/vertex` prefix and writes `CNAME`.

To preview the github.io build locally:

```sh
NEXT_PUBLIC_BASE_PATH=/vertex npm run build
mkdir -p /tmp/ghp && rm -rf /tmp/ghp/vertex && cp -R out /tmp/ghp/vertex && python3 -m http.server 4174 -d /tmp/ghp
# open http://localhost:4174/vertex/
```
