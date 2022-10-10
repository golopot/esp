import { parse as tsParse } from "@typescript-eslint/parser";
import assert from "assert";
import glob from "fast-glob";
import { readFileSync } from "fs";
import { parse } from "./parse.js";

const files = await glob("fixture/repos/**/*.ts");

for (const f of files.slice(0, 1)) {
  it("matches", () => {
    let s = readFileSync(f).toString();
    s = "function f(): number{ return 5}";
    const a = parse(s);
    const b = tsParse(s, {
      range: true,
      loc: false,
      tokens: false,
      comment: false,
      useJSXTextNode: false,
      ecmaVersion: 6,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    });
    console.dir(a, { depth: 10 });
    console.dir(b, { depth: 10 });
    assert.deepEqual(a, b);
  });
}
