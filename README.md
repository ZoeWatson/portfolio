# Zoe Watson — Portfolio

A clean, fast, static portfolio site. No frameworks, no build step, no trackers — just HTML, CSS, and a small progressive-enhancement JS file.

## Files

```
index.html                  Single-page site
styles.css                  All styling (light base, deep + warm green accents)
script.js                   Mobile nav, scroll reveal, footer year
assets/Zoe-Watson-Resume.pdf   Downloadable résumé (linked in nav + contact)
.claude/launch.json         Local preview config (python http.server)
```

## Run locally

Any static server works. For example:

```bash
python -m http.server 4321
# then open http://localhost:4321
```

## Deploy

It's fully static, so it deploys anywhere:

- **GitHub Pages** — push to a repo, enable Pages on the `main` branch (root). Site is `https://<user>.github.io/<repo>/`.
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop the folder, or point at the repo. No build command; publish directory is the project root.
- **Any web host** — upload the folder contents to the web root.

## Updating content

- Text lives directly in `index.html`, organized by clearly commented sections
  (`HERO`, `ABOUT`, `EXPERIENCE`, `SELECTED WORK`, `SKILLS`, `EDUCATION + CONTACT`).
- To swap the résumé, replace `assets/Zoe-Watson-Resume.pdf` (keep the filename, or
  update the two links in `index.html`: the nav `.nav__resume` and the contact
  `.contact__link--file`).
- Accent colors are CSS variables at the top of `styles.css` (`--green-*`).

## Accessibility & performance notes

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`), skip link,
  labelled sections, visible focus states, and `prefers-reduced-motion` support.
- Fonts load from Google Fonts with `preconnect`; everything else is local.
- No third-party scripts or analytics.
