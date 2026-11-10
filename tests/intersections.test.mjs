import test from 'node:test';
import assert from 'node:assert/strict';
import { findIntersections } from '../app/lib/intersections.ts';

const near = (a,b,t=2e-6) => assert.ok(Math.abs(a-b) < t, `${a} not within ${t} of ${b}`);

test('cubic and exponential have both positive intersections in [-12,12]', () => {
  const roots = findIntersections(x => x**3, x => 2**x, -12, 12);
  assert.equal(roots.length, 2);
  near(roots[0].x, 1.3734671197, 2e-6);
  near(roots[1].x, 9.9395351414, 2e-6);
  for (const r of roots) assert.ok(r.residual < 1e-7);
});

test('detects an even-multiplicity tangency', () => {
  const roots = findIntersections(x => x*x, () => 0, -2, 2);
  assert.equal(roots.length, 1);
  near(roots[0].x, 0, 1e-6);
});

test('detects multiple sine intersections', () => {
  const roots = findIntersections(x => Math.sin(x), () => 0, -2*Math.PI, 2*Math.PI);
  assert.equal(roots.length, 5);
  for (let i=0;i<5;i++) near(roots[i].x, (i-2)*Math.PI, 2e-6);
});

test('reports no intersection when functions remain separated', () => {
  assert.equal(findIntersections(x => x*x+1, () => 0, -5, 5).length, 0);
});

test('detects a root at a finite interval boundary', () => {
  const roots = findIntersections(x => x, () => 0, 0, 3);
  assert.equal(roots.length, 1);
  near(roots[0].x, 0, 1e-8);
});

test('handles invalid domains without bridging across NaN gaps', () => {
  const roots = findIntersections(x => x > 0 ? Math.log(x) : NaN, () => 0, -2, 2);
  assert.equal(roots.length, 1);
  near(roots[0].x, 1, 2e-6);
});

// 120 unordered function-type pairs: a smoke/regression sweep with representative
// coefficients. This is not a proof for every coefficient combination.
const funcs = [
  x=>x, x=>1, x=>2*x-1, x=>x*x, x=>x**3, x=>x**4,
  x=>Math.sin(2.5*x), x=>Math.cos(2*x), x=>2**x,
  x=>x>0?Math.log(x)/Math.log(10):NaN, x=>x>0?Math.log(x):NaN,
  x=>Math.abs(x), x=>x>=0?Math.sqrt(x):NaN, x=>x!==0?1/x:NaN,
  x=>Math.exp(-.28*Math.abs(x))*Math.sin(2.2*x), x=>-x*x,
];
test('smoke-tests all 120 unordered function-type pairs', () => {
  let pairs=0;
  for(let i=0;i<funcs.length;i++) for(let j=i+1;j<funcs.length;j++) {
    const roots=findIntersections(funcs[i],funcs[j],-12,12,{samples:12000});
    for(const r of roots) {
      assert.ok(r.x>=-12-1e-8 && r.x<=12+1e-8);
      assert.ok(Number.isFinite(r.y) && Number.isFinite(r.residual));
      assert.ok(r.residual < 1e-6, `pair ${i},${j} residual ${r.residual}`);
    }
    pairs++;
  }
  assert.equal(pairs,120);
});
