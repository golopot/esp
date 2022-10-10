import { parseSync } from "@swc/core";
import { convert } from "./convert.js";

export function parse(source) {
  const ast = parseSync(source, { syntax: "typescript" });
  const estreeAST = convert(ast);
  return estreeAST;
}
