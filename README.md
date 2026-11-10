# Function Studio Pro — Function Builder & Intersection Explorer

A Next.js 15 / React 19 / TypeScript interactive mathematics playground.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Included function families

- Identity and constant
- Linear: `ax + b`
- Quadratic: `ax² + bx + c`
- Cubic: `ax³ + bx² + cx + d`
- Quartic: `ax⁴ + bx³ + cx² + dx + e`
- Sine: `a sin(bx + c) + d`
- Cosine: `a cos(bx + c) + d`
- Exponential: `a · bˣ + c`
- Logarithm: `a · log_b(x) + c`
- Natural logarithm: `a · ln(x) + c`
- Absolute value: `a|x − b| + c`
- Square root: `a√x + c`
- Reciprocal: `a/x + c`
- Damped wave: `a e^(−b|x|) sin(cx) + d`
- Inverted parabola: `−ax² + bx + c`

## Coefficient controls and bounds

Each function exposes only the coefficients that belong to its general form. Numeric inputs are clamped to their displayed minimum and maximum so users cannot enter arbitrarily large coefficients. The graph derives its vertical scale from the current functions and clips invalid/out-of-domain values (for example, logarithms for `x <= 0`).

## Intersections

The app numerically searches the visible x interval `[-12, 12]` for sign-changing roots using bisection and separately brackets stationary points of `f(x)-g(x)` as tangency candidates. It displays all detected intersections (up to 12 rows), plus the minimum and maximum intersection x-values and their y-values. These are numerical estimates, not symbolic proofs; very close or high-multiplicity roots may require higher precision.

The graph uses a symmetric-log vertical display transform to preserve detail near zero and keep large values visible. Live outputs and intersection coordinates remain in original mathematical units.


## Intersection engine correction (updated)

- The horizontal inspection interval is now `[-12, 12]`, so the default comparison `x^3` and `2^x` includes both real intersections in the displayed interval (approximately `1.373467` and `9.939535`).
- Intersection detection scans the full visible interval, brackets sign-changing roots with bisection, and separately searches local minima of `|f(x)-g(x)|` for tangential contacts.
- Duplicate roots are merged and results are sorted before minimum/maximum intersection values are displayed.
- The UI labels now describe the actual `[-12, 12]` interval rather than `[-2π, 2π]`.

Numerical caveat: this is a numerical detector, not a symbolic proof. Very closely spaced roots, pathological high-multiplicity contacts, and roots outside the current viewing interval can require a more specialized method. The displayed count refers to the current interval only.

## Mathematical verification and tests

The intersection engine is isolated in `app/lib/intersections.ts` and has an automated regression suite. Run it with:

```bash
npm test
```

The suite tests cubic-vs-exponential (both roots), tangency, multiple sine roots, no-root cases, interval-boundary roots, invalid logarithm domains, and a smoke sweep of all 120 unordered pairs of the 16 function types using representative default parameters.

See [`docs/MATHEMATICAL-VERIFICATION.md`](docs/MATHEMATICAL-VERIFICATION.md) for the algorithm, domain notes, regression results, and limitations. Results are numerical estimates over `[-12, 12]`, not formally certified complete root counts for arbitrary coefficient settings.
