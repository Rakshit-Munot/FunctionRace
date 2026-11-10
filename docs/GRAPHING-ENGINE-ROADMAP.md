# Function Studio Graphing Engine — implementation notes

## Product direction

Function Studio is moving from a two-function comparison demo toward a general mathematical graphing workspace. The reference study used publicly documented Desmos workflows (expression lists, points, curves, sliders, tables, inequalities and restrictions) as product research. This implementation is original and does not use Desmos code, assets, branding or private APIs.

## Included in this release

- Multiple editable expression rows; add/remove/hide expressions.
- Explicit function expressions of x, including `y = ...` and `f(x) = ...` labels.
- Safe arithmetic parser; no JavaScript `eval` or `Function` constructor.
- Operators `+ - * / ^`, unary signs, parentheses, implicit multiplication (`2x`, `3(x+1)`, `bx`).
- Trigonometric and hyperbolic functions, square root, absolute value, logarithms, exponential, rounding, sign, min/max and power.
- `pi` and `e` constants.
- Automatically generated bounded sliders for free variables (e.g. `a`, `b`, `c`).
- Canvas graphing, adaptive grid intervals, mouse-wheel zoom, pointer drag/pan, trace cursor and trace animation.
- Live function values, numerical sign-changing intersection candidates for the selected expression and another visible expression.
- Undo/redo and shareable URL state.

## Deliberate limits in this release

This is a strong first graphing-workspace foundation, not a feature-complete Desmos replacement.

- Rows currently plot explicit y-as-a-function-of-x expressions. Implicit equations such as `x^2+y^2=1` are not rendered.
- Inequalities and shaded regions are not implemented.
- Parametric and polar equations are not implemented.
- Tables and draggable plotted points are not implemented.
- Sliders are generated for free variables with a fixed bounded range; there is not yet a full slider configuration panel for min/max/step/play speed.
- Intersection candidates currently use sign-change sampling on a finite search interval for the selected pair. Tangencies, very close roots, high-frequency roots and roots outside that interval may be missed. These are not certified results.
- Symbolic derivatives, integrals, extrema and exact algebra are not implemented in this release.
- URL state is intended for modest graph configurations; large expression collections can exceed practical URL length limits.

## Verification performed in this workspace

- 7 expression-parser tests passed.
- Existing 7 intersection regression groups passed, including the 120 unordered function-type smoke test from the prior project.
- ZIP archive integrity checked after packaging.
- Full Next.js typecheck/build could not be completed here because dependencies could not be installed in this environment. Run `npm install`, `npm test`, `npm run typecheck`, and `npm run build` locally before production deployment.

## Next engineering milestones

1. Add parser grammar for implicit relations, equation restrictions and piecewise expressions.
2. Add robust implicit-curve and inequality rendering.
3. Add parametric/polar plot models.
4. Add tables and movable points with constraint support.
5. Add adaptive root isolation and interval arithmetic for certified intersection results.
6. Add symbolic differentiation/integration through a dedicated CAS layer.
7. Add persistent graph documents and import/export.
