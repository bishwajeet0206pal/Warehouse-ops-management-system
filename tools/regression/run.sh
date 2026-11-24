#!/usr/bin/env bash
# Interaction regression: compares committed HEAD (baseline) with the current working tree.
# Needs Node 22+ and Chrome (set CHROME=/path if not the macOS default). Takes ~20 min.
# Mismatches are re-run once in isolation to filter timing noise; whatever persists is real.
set -u
ROOT="$(git rev-parse --show-toplevel)"; HERE="$ROOT/tools/regression"
T="$(mktemp -d)"; mkdir "$T/base" "$T/new"
git -C "$ROOT" archive HEAD | tar -x -C "$T/base"
(cd "$ROOT" && tar --exclude=.git --exclude=tools -cf - .) | tar -x -C "$T/new"
node "$HERE/harness.mjs" "$T/base" "$T/base.json" & node "$HERE/harness.mjs" "$T/new" "$T/new.json" & wait
node "$HERE/compare.mjs" "$T/base.json" "$T/new.json" | tee "$T/report.txt"
for m in $(grep '^MISMATCH' "$T/report.txt" | sed 's/MISMATCH //'); do
  st="${m%%:*}"; idx="${m#*:}"
  node "$HERE/harness.mjs" "$T/base" "$T/b2.json" "$st" "$idx" & node "$HERE/harness.mjs" "$T/new" "$T/n2.json" "$st" "$idx" & wait
  node -e "
const f=require('fs'),s='$st';const a=JSON.parse(f.readFileSync('$T/b2.json'))[s].clicks,b=JSON.parse(f.readFileSync('$T/n2.json'))[s].clicks;
a.forEach((c,k)=>{if(JSON.stringify(c.snap)!==JSON.stringify(b[k].snap))console.log('PERSISTENT',s,c.i,c.desc)})"
done
echo "artifacts: $T"
