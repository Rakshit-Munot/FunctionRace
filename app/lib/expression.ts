export type Scope = Record<string, number>;
type Node = { k:'n'; v:number } | { k:'v'; name:string } | { k:'u'; op:string; a:Node } | { k:'b'; op:string; a:Node; b:Node } | { k:'f'; name:string; args:Node[] };
const FUNCTIONS: Record<string,(...x:number[])=>number> = {
 sin:Math.sin, cos:Math.cos, tan:Math.tan, asin:Math.asin, acos:Math.acos, atan:Math.atan,
 sinh:Math.sinh, cosh:Math.cosh, tanh:Math.tanh, sqrt:Math.sqrt, abs:Math.abs,
 ln:Math.log, log:Math.log10, log2:Math.log2, exp:Math.exp, floor:Math.floor, ceil:Math.ceil,
 round:Math.round, sign:Math.sign, min:Math.min, max:Math.max, pow:Math.pow
};
type Token = {t:'num'|'id'|'op'|'(' | ')'|','; v:string};
function tokenize(s:string):Token[]{
 const out:Token[]=[]; let i=0;
 while(i<s.length){const c=s[i]; if(/\s/.test(c)){i++;continue;}
  const num=s.slice(i).match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i); if(num){out.push({t:'num',v:num[0]});i+=num[0].length;continue;}
  const id=s.slice(i).match(/^[a-zA-Z_][a-zA-Z_0-9]*/); if(id){const name=id[0].toLowerCase(); if(name.length===2&&!/[0-9_]/.test(name)&&!FUNCTIONS[name]&&name!=='pi'&&name!=='e'){for(const ch of name)out.push({t:'id',v:ch});}else out.push({t:'id',v:name});i+=id[0].length;continue;}
  if('+-*/^'.includes(c)){out.push({t:'op',v:c});i++;continue;} if(c==='('||c===')'||c===','){out.push({t:c,v:c});i++;continue;}
  throw new Error(`Unsupported character: ${c}`);
 }
 // Insert implicit multiplication: 2x, 2(x+1), (x+1)(x-1), 2sin(x)
 const fixed:Token[]=[]; for(let j=0;j<out.length;j++){const a=out[j],b=out[j+1];fixed.push(a); if(!b)continue;
  const left=a.t==='num'||a.t===')'||(a.t==='id'&&!FUNCTIONS[a.v]&&a.v!=='pi'&&a.v!=='e');
  const right=b.t==='num'||b.t==='('||(b.t==='id'&&!['and','or'].includes(b.v));
  const isCall=a.t==='id'&&!!FUNCTIONS[a.v]&&b.t==='(';
  if(left&&right&&!isCall)fixed.push({t:'op',v:'*'});
 }
 return fixed;
}
class Parser{
 private i=0; private ts:Token[]; constructor(ts:Token[]){this.ts=ts;}
 private peek(){return this.ts[this.i]} private take(){return this.ts[this.i++]}
 parse():Node{const n=this.expr(0);if(this.i<this.ts.length)throw new Error(`Unexpected token ${this.peek().v}`);return n;}
 private expr(min:number):Node{
  let t=this.take(); if(!t)throw new Error('Expression is empty'); let left:Node;
  if(t.t==='num')left={k:'n',v:Number(t.v)};
  else if(t.t==='op'&&(t.v==='+'||t.v==='-'))left={k:'u',op:t.v,a:this.expr(25)};
  else if(t.t==='('){left=this.expr(0);if(this.take()?.t!==')')throw new Error('Missing closing parenthesis');}
  else if(t.t==='id'){
   if(this.peek()?.t==='('&&FUNCTIONS[t.v]){this.take();const args:Node[]=[];if(this.peek()?.t!==')'){do{args.push(this.expr(0));if(this.peek()?.t!==',')break;this.take();}while(true);}if(this.take()?.t!==')')throw new Error('Missing ) after function');left={k:'f',name:t.v,args};}
   else if(t.v==='pi')left={k:'n',v:Math.PI};else if(t.v==='e')left={k:'n',v:Math.E};else left={k:'v',name:t.v};
  } else throw new Error(`Unexpected token ${t.v}`);
  while(this.peek()?.t==='op') {const op=this.peek().v;const prec=op==='+'||op==='-'?10:op==='*'||op==='/'?20:30;if(prec<min)break;this.take();const right=this.expr(prec+(op==='^'?0:1));left={k:'b',op,a:left,b:right};}
  return left;
 }
}
export function compileExpression(source:string){
 const clean=source.trim().replace(/^(?:y|[a-z]\s*\(\s*x\s*\))\s*=\s*/i,'').replace(/²/g,'^2').replace(/³/g,'^3').replace(/π/g,'pi').replace(/×/g,'*').replace(/÷/g,'/');
 const ast=new Parser(tokenize(clean)).parse(); const vars=new Set<string>();
 const walk=(n:Node)=>{if(n.k==='v')vars.add(n.name);else if(n.k==='u')walk(n.a);else if(n.k==='b'){walk(n.a);walk(n.b);}else if(n.k==='f')n.args.forEach(walk)};walk(ast);
 const evalNode=(n:Node,s:Scope):number=>{switch(n.k){case'n':return n.v;case'v':if(!(n.name in s))throw new Error(`Define ${n.name} with a slider`);return s[n.name];case'u':{const a=evalNode(n.a,s);return n.op==='-'?-a:a;}case'b':{const a=evalNode(n.a,s),b=evalNode(n.b,s);switch(n.op){case'+':return a+b;case'-':return a-b;case'*':return a*b;case'/':return a/b;default:return Math.pow(a,b)}}case'f':return FUNCTIONS[n.name](...n.args.map(a=>evalNode(a,s)));}};
 return {variables:[...vars].filter(v=>v!=='x').sort(),evaluate:(x:number,scope:Scope={})=>{try{return evalNode(ast,{...scope,x});}catch{return NaN;}}};
}
