export type NumericRoot = { x: number; y: number; residual: number; method: 'crossing' | 'tangency' | 'boundary' };
export type NumericIntersectionOptions = { samples?: number; xTolerance?: number; residualAbsTolerance?: number; residualRelTolerance?: number; dedupeTolerance?: number };

/**
 * Numerical intersection finder on a finite interval.
 * Finds sign-changing roots with bisection and even-multiplicity candidates
 * by bracketing stationary points of h=f-g. This is a numerical search, not
 * a proof that every root has been isolated for arbitrary functions.
 */
export function findIntersections(
  f: (x: number) => number,
  g: (x: number) => number,
  minX: number,
  maxX: number,
  options: NumericIntersectionOptions = {},
): NumericRoot[] {
  const N = Math.max(1000, Math.min(200000, Math.floor(options.samples ?? 48000)));
  const xTol = options.xTolerance ?? 2e-12;
  const absTol = options.residualAbsTolerance ?? 1e-10;
  const relTol = options.residualRelTolerance ?? 1e-10;
  const dedupe = options.dedupeTolerance ?? 2e-7;
  if (!(Number.isFinite(minX) && Number.isFinite(maxX) && minX < maxX)) return [];
  const h = (x: number) => {
    const a = f(x), b = g(x);
    return Number.isFinite(a) && Number.isFinite(b) ? a - b : NaN;
  };
  const toleranceAt = (x: number) => absTol + relTol * Math.max(1, Math.abs(f(x)), Math.abs(g(x)));
  const roots: NumericRoot[] = [];
  const add = (x: number, method: NumericRoot['method']) => {
    if (!Number.isFinite(x) || x < minX - xTol || x > maxX + xTol) return;
    const a = f(x), b = g(x), residual = Math.abs(a - b);
    if (!Number.isFinite(a) || !Number.isFinite(b) || residual > toleranceAt(x)) return;
    if (roots.some(r => Math.abs(r.x - x) <= dedupe)) return;
    roots.push({ x, y: a / 2 + b / 2, residual, method });
  };
  const bisect = (fn: (x: number) => number, left: number, right: number): number => {
    let lo = left, hi = right, flo = fn(lo), fhi = fn(hi);
    if (!Number.isFinite(flo) || !Number.isFinite(fhi) || (flo !== 0 && fhi !== 0 && Math.sign(flo) === Math.sign(fhi))) return NaN;
    if (flo === 0) return lo;
    if (fhi === 0) return hi;
    for (let i = 0; i < 100; i++) {
      const mid = lo + (hi - lo) / 2, fm = fn(mid);
      if (!Number.isFinite(fm)) return NaN;
      if (fm === 0 || hi - lo <= xTol * Math.max(1, Math.abs(mid))) return mid;
      if (Math.sign(flo) !== Math.sign(fm)) { hi = mid; fhi = fm; }
      else { lo = mid; flo = fm; }
    }
    return lo + (hi - lo) / 2;
  };
  const step = (maxX - minX) / N;
  let px = minX, pv = h(px);
  if (Number.isFinite(pv) && Math.abs(pv) <= toleranceAt(px)) add(px, 'boundary');
  for (let i = 1; i <= N; i++) {
    const x = minX + i * step, v = h(x);
    if (Number.isFinite(pv) && Number.isFinite(v)) {
      if (pv !== 0 && v !== 0 && Math.sign(pv) !== Math.sign(v)) add(bisect(h, px, x), 'crossing');
      if (Math.abs(v) <= toleranceAt(x)) add(x, x === maxX ? 'boundary' : 'crossing');
    }
    px = x; pv = v;
  }
  // Stationary points of h can be even-multiplicity roots (touching curves).
  const derivative = (x: number) => {
    const room = Math.min(x - minX, maxX - x);
    const eps = Math.min(Math.max((maxX - minX) * 1e-7, 1e-7), room * 0.45);
    if (!(eps > 0)) return NaN;
    const l = h(x - eps), r = h(x + eps);
    return Number.isFinite(l) && Number.isFinite(r) ? (r - l) / (2 * eps) : NaN;
  };
  let dx = minX, dv = derivative(dx);
  for (let i = 1; i <= N; i++) {
    const x = minX + i * step, v = derivative(x);
    if (Number.isFinite(dv) && Number.isFinite(v) && dv !== 0 && v !== 0 && Math.sign(dv) !== Math.sign(v)) {
      const stationary = bisect(derivative, dx, x);
      if (Number.isFinite(stationary)) add(stationary, 'tangency');
    }
    dx = x; dv = v;
  }
  roots.sort((a, b) => a.x - b.x);
  return roots;
}
