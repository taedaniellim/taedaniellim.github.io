# taedaniellim.github.io

Personal portfolio site for Daniel Lim — live at [taedaniellim.github.io](https://taedaniellim.github.io).

## Stack

Plain HTML, CSS, and a single ES module. No build step, no framework, no dependencies — deploys directly via GitHub Pages on push to `main`.

```
.
├── index.html
├── styles/
│   ├── reset.css     # modern reset
│   ├── tokens.css    # design tokens (color, spacing, type)
│   └── main.css      # components and layout
├── scripts/
│   └── main.js       # ES module: nav, scroll, typing effect
├── img/
└── pdfs/
```

## Local development

Any static file server works. Easiest:

```sh
python3 -m http.server 8000
# or
npx serve .
```

Then open <http://localhost:8000>.

## Deploying

Push to `main` — GitHub Pages serves the root directly.
