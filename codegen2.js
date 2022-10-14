import { readFileSync } from "fs";
const v = readFileSync("1.json").toString();
const w = JSON.parse(v);

for (let t in w) {
  console.log(`case "${t}":`);
  console.log("  return {");
  console.log(`    type: "${t}",`);
  for (let k in w[t]) {
    const r = w[t][k];
    if (typeof r === "string") {
      console.log(`    ${k}: n.${k},`);
    } else if (k === "range") {
      console.log(`    ${k}: getRange(n.span),`);
    } else if (Array.isArray(r)) {
      console.log(`    ${k}:  n.${k}?.map(x => convert(x)),`);
    } else {
      console.log(`    ${k}: convert(n.${k}),`);
    }
  }
  console.log("  }");
}
