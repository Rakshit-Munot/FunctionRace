import test from 'node:test';
import assert from 'node:assert/strict';
import { compileExpression } from '../app/lib/expression.ts';
const close=(actual,expected,tol=1e-10)=>assert.ok(Math.abs(actual-expected)<=tol,`${actual} != ${expected}`);
test('polynomial and implicit multiplication',()=>{close(compileExpression('y = ax^2 + bx + c').evaluate(2,{a:1,b:2,c:3}),11)});
test('trigonometric expression with adjacent variables',()=>{close(compileExpression('f(x) = a sin(bx)').evaluate(Math.PI/2,{a:2,b:1}),2)});
test('constants and exponential',()=>{close(compileExpression('y = e^x').evaluate(1),Math.E)});
test('logarithms and square root',()=>{close(compileExpression('y = ln(sqrt(x))').evaluate(Math.E**2),1)});
test('function arguments and commas',()=>{close(compileExpression('y = max(x, 2)').evaluate(1),2)});
test('undefined parameters do not execute arbitrary code',()=>{assert.ok(Number.isNaN(compileExpression('y = x + secret').evaluate(1)))});
test('unsupported characters are rejected',()=>{assert.throws(()=>compileExpression('y = x; alert(1)'))});

test('quartic graph evaluates symmetrically and remains mathematically unchanged', async () => {
  const { compileExpression } = await import('../app/lib/expression.ts');
  const quartic = compileExpression('y = x^4');
  assert.equal(quartic.evaluate(-2), 16);
  assert.equal(quartic.evaluate(0), 0);
  assert.equal(quartic.evaluate(2), 16);
});
