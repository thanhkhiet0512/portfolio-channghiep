# channghiep.io.vn — Portfolio of Nghiep Nguyen

Personal brand site for **Nghiep Nguyen** (Nguyễn Chấn Nghiệp), Senior Application Engineer @ Akselos — CFD · Digital Twins · AI Automation.

- **Stack:** Astro 5 · Tailwind CSS 4 · TypeScript · WebGL2 (custom fluid solver)
- **Languages:** English (`/`) and Vietnamese (`/vi/`)
- **Signature:** the hero is a live incompressible-flow simulation (stable fluids) — the name acts as a solid obstacle and sheds a wake; the cursor stirs the flow. Falls back to static streamlines without WebGL2 / with reduced motion.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Edit content

Everything lives in two files — no CMS needed:

| What | Where |
|---|---|
| Bio, numbers, case studies, journey, talks, skills, certifications (EN + VI) | `src/data/profile.ts` |
| Interface text (buttons, headings, About story) | `src/data/i18n.ts` |
| Extra photos (auto-detected) | drop `sea.jpg` and/or `japan.jpg` into `public/photos/` |
| Portrait | `public/avatar.png` |
| Social share image | `public/og.png` (1200×630) |

Add a new case study by appending an object to `projects` in `profile.ts`; its pages (`/work/<slug>` and `/vi/work/<slug>`) are generated automatically. `art` picks one of the schematic illustrations in `src/components/CaseArt.astro`.

## Deploy (Vercel + channghiep.io.vn)

1. vercel.com → **Add New → Project** → import this GitHub repo (framework auto-detected as Astro, no settings to change).
2. Project → **Settings → Domains** → add `channghiep.io.vn` (and `www.channghiep.io.vn`, redirecting to the apex).
3. At the `.io.vn` domain registrar's DNS panel, add the records Vercel shows — usually:
   - `A` · `@` · `76.76.21.21`
   - `CNAME` · `www` · `cname.vercel-dns.com`
4. Wait for DNS to propagate (minutes to a few hours); HTTPS is issued automatically.

See `PLAN.md` for the brand strategy and roadmap.
