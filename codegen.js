import { parse } from "@typescript-eslint/parser";
import glob from "fast-glob";
import { readFile } from "fs/promises";

const files = await glob("fixture/repos/**/*.{ts,tsx}");

function traverse(node, fn) {
  if (!node) {
    return;
  }
  if (typeof node !== "object") {
    return;
  }
  fn(node);
  for (const k in node) {
    traverse(node[k], fn);
  }
}

const types = {};

function enter(node) {
  const m = {};
  for (const k in node) {
    if (k === "type") {
      continue;
    } else if (typeof node[k] === "string") {
      m[k] = "";
    } else if (Array.isArray(node[k])) {
      m[k] = [];
    } else {
      m[k] = {};
    }
  }
  let t = types[node.type] || {};
  types[node.type] = {
    ...(types[node.type] || {}),
    ...m,
  };
}

let c = files.length;
for (const f of files) {
  (async () => {
    const s = (await readFile(f)).toString();
    let tree = {};
    try {
      tree = parse(s, {
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
    } catch (e) {
      //
    }
    traverse(tree, enter);
    c--;
    if (c === 0) {
      console.log(types);
    }
  })();
}
