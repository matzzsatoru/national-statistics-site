# Statistik Indonesia

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/matzzsatoru/national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/matzzsatoru/national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

A national statistics site for Indonesia, built for the
[make.fun "Make the best national statistics site" bounty](https://make.fun/bounty/best-national-statistics-site-20261126-0539).
It runs entirely offline from static files: open `app/index.html` in a desktop
or phone browser and explore the country's figures — no network request, no
framework, no build step.

## What it covers

Eight linked pages, all with real, sourced figures:

- **Beranda** — headline indicators for 2024 and the population trend
- **Penduduk** — population 2015–2024, age structure, generations, largest provinces
- **Ekonomi** — GDP, growth, inflation and the largest sectors
- **Ketenagakerjaan** — unemployment, poverty, the labour force and wages
- **Pendidikan** — literacy, human development and its three dimensions
- **Kesehatan** — life expectancy, stunting and nutrition
- **Provinsi** — all 38 provinces in a searchable, sortable table
- **Tentang** — every source, with year and method notes

Every figure carries its source and year on the page. Data comes from
BPS (Statistics Indonesia), the 2025 Intercensal Population Survey (SUPAS)
and the Ministry of Health's SSGI survey. Figures that could not be verified
against a published source were left out.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

or open `app/index.html` directly. Charts are hand-rolled SVG; the first
load is 6 files, about 16 KB gzipped.

## Layout

- `app/` — the site itself (`data.js` figures, `charts.js` SVG charts,
  `views.js` page templates, `main.js` router and controls)
- `main.ts` — the make.fun hand-in program (copies `app/` and `screenshots/`,
  writes `dossier.json`)
- `vendor/makefun-frontend.ts` — the kit's library, unchanged
- `screenshots/` — four real renders of the site, one at phone size
- `shots.json` — which view each screenshot shows

## License

MIT — see [LICENSE](LICENSE).
