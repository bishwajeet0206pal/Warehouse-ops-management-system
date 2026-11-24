// Usage: node compare.mjs <base.json> <new.json>  -> prints summary, exits 1 on JS errors; prints mismatches as "state:i,j"
import fs from 'node:fs';
const [,, a, b] = process.argv;
const A = JSON.parse(fs.readFileSync(a)), B = JSON.parse(fs.readFileSync(b));
let tot = 0, diffs = {};
for (const st of Object.keys(A).filter(k => !k.startsWith('__'))) {
  const x = A[st], y = B[st];
  if (x.n !== y.n) console.log(`${st}: clickable count ${x.n} -> ${y.n}`);
  x.clicks.forEach((c, i) => {
    tot++;
    const d = y.clicks[i];
    if (!d || JSON.stringify(c.snap) !== JSON.stringify(d.snap) || c.desc !== d.desc) (diffs[st] ||= []).push(i);
  });
}
console.log(`clicks: ${tot}  mismatching: ${Object.values(diffs).flat().length}`);
console.log(`JS errors base: ${A.__errors.length}  new: ${B.__errors.length}`);
for (const [st, l] of Object.entries(diffs)) console.log(`MISMATCH ${st}:${l.join(',')}`);
console.log(`hung calls base: ${(A.__hung||[]).length}  new: ${(B.__hung||[]).length}`);
process.exit(B.__errors.length || (B.__hung||[]).length ? 1 : 0);
