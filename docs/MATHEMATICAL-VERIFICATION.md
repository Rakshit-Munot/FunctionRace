# Function Studio — Mathematical verification notes

## Scope

The playground compares the selected functions on the finite inspection interval `[-12, 12]`. Reported intersections are numerical estimates, not symbolic proofs and not a guarantee that every root has been found for every possible coefficient configuration.

## Intersection algorithm in this release

1. Evaluate `h(x) = f(x) - g(x)` on a dense uniform grid (48,000 subintervals).
2. For sign-changing brackets, refine a root using bisection.
3. Estimate `h'(x)` by a centered finite difference. Bracket sign changes of this derivative and refine stationary points by bisection.
4. Accept a stationary point as a tangency candidate only if the original function residual is within a scale-relative tolerance.
5. Sort and deduplicate candidates, then report the midpoint y-value and absolute residual.

This is stronger than a sign-change-only scan, but it is still a numerical heuristic. A finite grid can miss tightly clustered roots, high-frequency oscillations, narrow features, or roots close to singularities. Finite-difference derivatives can also be unreliable near nonsmooth points or singularities.

## Domain handling

- `log` and `ln`: `x > 0`.
- `sqrt`: `x >= 0`.
- `reciprocal`: `x != 0` (the mathematical singularity is at zero; no artificial exclusion band is imposed).
- Other functions use their real-valued definitions, subject to finite floating-point evaluation.

## Regression reference: cubic versus exponential

For `x^3 = 2^x` on `[-12, 12]`, the two positive roots are approximately:

- `x = 1.3734671197`, `y = 2.5909247585`
- `x = 9.9395351414`, `y = 981.9700013423`

These values are numerical reference values and should be checked against an independent high-precision solver when validating a release.

## Required before claiming exhaustive or formally certified results

- Interval arithmetic with outward-rounded enclosures.
- Adaptive interval subdivision and interval Newton/Krawczyk methods to prove root existence/uniqueness or exclude roots.
- Analytic domain partitioning at singularities and nonsmooth points.
- Symbolic identity checks (or certified equivalence checks) for coincident functions.
- Automated regression tests across all 120 unordered function-type pairs, multiple coefficient sets, tangencies, boundary roots, near-multiple roots, and high-frequency settings.

The UI should therefore describe results as **numerically detected estimates within the visible interval**, not as mathematically guaranteed complete root counts.

## Verification upgrade included in this package

The intersection calculation has been extracted into `app/lib/intersections.ts` so it can be tested independently from the React UI. It now:

- Uses sign comparisons rather than multiplying endpoint values (avoids overflow in sign tests).
- Refines crossing brackets with bisection and an explicit x tolerance.
- Searches stationary points of the difference function as tangency candidates.
- Checks every candidate against an absolute-plus-relative residual tolerance.
- Labels results as `crossing`, `tangency`, or `boundary` in the UI.
- Sorts and deduplicates results before display.

Run the regression suite with `npm test`. It contains tests for the two cubic/exponential roots, an even-multiplicity tangency, five sine zeros, no-root cases, interval-boundary roots, invalid logarithm domains, and a smoke sweep of all 120 unordered pairs among the 16 function types using representative default parameters.

### What the tests establish—and what they do not

The test suite establishes that these selected regression examples pass and that the 120-pair default-parameter smoke sweep produces finite, low-residual results. It does **not** prove completeness for every coefficient setting. The sweep is not exhaustive over the continuous coefficient ranges.

This implementation is not an interval-arithmetic certified solver. In particular, finite sampling and finite-difference stationary-point detection can miss tightly clustered roots, high-frequency roots beyond the sampling resolution, or unusual behaviour near singularities. The `coincident` check is also a numerical probe-based heuristic, not a symbolic identity proof. The interface and documentation must continue to call the results numerical estimates.

For formal completeness guarantees, the next engineering step is interval arithmetic with outward-rounded bounds, adaptive subdivision, and interval Newton/Krawczyk root isolation, plus symbolic identity checks for coincident functions. No claim of formal mathematical certification is made in this release.
