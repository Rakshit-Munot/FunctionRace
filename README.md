# Function Studio — Graphing Workspace

A Next.js 15 / React 19 / TypeScript mathematical graphing workspace.

## Features

- Multi-expression editor with visibility and color controls
- Safe recursive-descent expression parser (does not use `eval` or `Function`)
- Operators: `+ - * / ^`, unary signs, parentheses, implicit multiplication (`2x`, `3(x+1)`)
- Functions: `sin`, `cos`, `tan`, inverse trig, hyperbolic trig, `sqrt`, `abs`, `ln`, `log`, `log2`, `exp`, `floor`, `ceil`, `round`, `sign`, `min`, `max`, `pow`
- Constants: `pi`, `e`
- Automatically generated sliders for free variables such as `a`, `b`, `c`
- Canvas plotting, adaptive grid spacing, wheel zoom, pointer pan, trace cursor
- Live expression values, numerical crossing candidates for the selected pair
- Trace animation, undo/redo, shareable URL state
- Responsive layout

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run typecheck
npm run build
```

## Mathematical and implementation notes

This is an original graphing workspace inspired by common graphing-calculator workflows. It does not use Desmos source code, branding, assets, or private APIs.

The expression parser is a deliberately limited arithmetic/function parser. It is not a complete CAS. Current graph rows are explicit `y = expression` functions of `x`; implicit relations, inequalities, polar/parametric plots, tables, symbolic differentiation/integration, and interval-certified root isolation are not implemented in this release.

Intersection readout currently searches sign-changing roots for the first two visible expressions over a finite x-window. It can miss tangencies, roots closer than the sampling resolution, and roots outside the search interval. Treat results as exploratory numerical candidates, not certified mathematics.

Share links serialize the current expression state into the URL. Very large states may exceed practical URL length limits.

## Viewport fitting for steep functions

The graph now keeps independent horizontal and vertical pixel scales. Use the **FIT** control in the graph toolbar to frame the currently visible expressions. This is useful for steep functions such as `y = x^4`, whose values grow much faster than the default viewport can display. The FIT operation changes only the viewport (axis scales and center); it never alters, clamps, or bends the mathematical function. Horizontal and vertical grid intervals are calculated independently and the footer reports both scales. Scroll zoom remains cursor-anchored, and dragging pans in the corresponding axis units.

This is an adaptive Cartesian viewport, not a nonlinear transformation of function values. If a future logarithmic/symlog axis mode is added, it must be explicitly labelled because tangent geometry and distances change under nonlinear coordinate transforms.
