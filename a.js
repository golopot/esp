import { parse as tsParse } from "@typescript-eslint/parser";
import { readFileSync } from "fs";
const s = readFileSync(
  "./fixture/repos/typescript-eslint-5.39.0/packages/eslint-plugin/src/rules/naming-convention-utils/format.ts"
).toString();
import { parse } from "./lib/parse.js";

const code = "";

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

let ast = parseFn(code || s).body;
ast = sortObject(ast, ["type", "span", "range"]);

console.dir(ast, { depth: null });
