# Function Arena — 3D visual upgrade

This is a drop-in redesign of the saved Function Race page and stylesheet. It preserves the existing seven-stage cubic-vs-factorial race controls and completion logic while replacing the 2D canvas visualization with a procedural Three.js arena.

## Install

```bash
npm install three gsap lucide-react
npm install -D @types/three
```

## Integrate

- Replace your current `app/page.tsx` (or the route's page component) with `page.tsx`.
- Replace the current global stylesheet imported by `app/layout.tsx` with `globals.css`, or merge its contents into your existing global stylesheet.
- Keep the existing Next.js app layout and Tailwind/PostCSS configuration. This page uses plain CSS and does not require Tailwind classes.

## Included

- Procedural Three.js WebGL arena: reflective floor, grid, glowing rails, seven physical platforms per lane, animated energy orbs, central rotating core, atmospheric point field, fog and dynamic lighting.
- GSAP entrance transition when the simulation starts.
- Original palette: `#000814`, `#001D3D`, `#003566`, `#FFC300`, `#FFD60A`.
- Responsive editorial layout, race status, speed, reset and pause/start controls.
- The existing race progression and seven capacities are retained.

## Notes

- No paid CodePen or Awwwards assets are used. All 3D geometry is generated in code.
- The sound control is a visual preference toggle in this first pass; no audio is played yet.
- The winner remains determined by the simulation's existing progression model, not by a hard-coded label.
