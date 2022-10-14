import { parse as tsParse } from "@typescript-eslint/parser";
import { readFileSync } from "fs";
const s = readFileSync(
  "/home/jchn/swc-eslint-parser/fixture/repos/typescript-eslint-5.39.0/packages/scope-manager/src/referencer/PatternVisitor.ts"
).toString();
import { parse } from "./lib/parse.js";

const code = "class f{ q(){}}";

let parseFn = parse;
if (process.argv.includes("--ts")) {
  parseFn = (c) =>
    tsParse(c, {
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
}

function sortObject(object, overrides = []) {
  if (!object || typeof object !== "object") {
    return object;
  }

  var sortedObj = {};
  if (Array.isArray(object)) {
    sortedObj = object.map((item) => sortObject(item, overrides));
  } else {
    var keys = Object.keys(object);
    keys.sort(function (key1, key2) {
      if (overrides.includes(key1) && overrides.includes(key2)) {
        return overrides.indexOf(key1) - overrides.indexOf(key2);
      }
      if (overrides.includes(key1)) {
        return -1;
      }
      if (overrides.includes(key2)) {
        return 1;
      }
      (key1 = key1.toLowerCase()), (key2 = key2.toLowerCase());
      if (key1 < key2) return -1;
      if (key1 > key2) return 1;
      return 0;
    });

    for (var index in keys) {
      var key = keys[index];
      if (typeof object[key] == "object") {
        sortedObj[key] = sortObject(object[key], overrides);
      } else {
        sortedObj[key] = object[key];
      }
    }
  }

  return sortedObj;
}

function deleteProperties(tree) {
  if (!tree || typeof tree === "string") {
    return;
  }
  for (let k in tree) {
    if (
      [
        "typeParameters",
        "returnType",
        "typeAnnotation",
        "decorators",
        "directive",
      ].includes(k) &&
      tree[k] == undefined
    ) {
      delete tree[k];
    }
    deleteProperties(tree[k]);
  }
}

let ast = parseFn(code || s);
ast = sortObject(ast.body, ["type", "span", "range"]);
deleteProperties(ast);
ast = console.dir(ast, { depth: null });
