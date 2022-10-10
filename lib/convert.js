function enter(n) {
  if (!n) {
    return;
  }
  switch (n.type) {
    case "Module":
      n.type = "Program";
      n.sourceType = "module";
      delete n.interpreter;
      break;
    case "FunctionDeclaration":
      n.id = n.identifier;
      n.expression = n.expression || false;
      n.params = n.params.map((x) => {
        return x.pat;
      });
      delete n.identifier;
      delete n.declare;
      delete n.decorators;
      if (!n.returnType) {
        delete n.returnType;
      }
      if (!n.typeParameters) {
        delete n.typeParameters;
      }
      break;
    case "FunctionExpression":
      n.params = n.params.map((x) => {
        return x.pat;
      });
      if (!n.returnType) {
        delete n.returnType;
      }
      if (!n.typeParameters) {
        delete n.typeParameters;
      }
      break;
    case "ArrowFunctionExpression":
      n.id = null;
      n.expression = n.body.type !== "BlockStatement";
      if (!n.returnType) {
        delete n.returnType;
      }
      if (!n.typeParameters) {
        delete n.typeParameters;
      }
      break;
    case "ClassExpression":
      n.body = { type: "ClassBody", body: n.body, range: [0, 0] };
      n.id = n.identifier;
      delete n.identifier;
      n.abstract = n.isAbstract;
      delete n.isAbstract;
      if (!n.superTypeParams) {
        delete n.superTypeParams;
      }
      if (!n.typeParams) {
        delete n.typeParams;
      }
      if (!n.abstract) {
        delete n.abstract;
      }
      if (n.decorators.length === 0) {
        delete n.decorators;
      }
      if (n.implements.length === 0) {
        delete n.implements;
      }
      break;
    case "ClassDeclaration":
      n.body = { type: "ClassBody", body: n.body, range: [0, 0] };
      n.id = n.identifier;
      delete n.identifier;
      n.abstract = n.isAbstract;
      delete n.isAbstract;
      if (!n.superTypeParams) {
        delete n.superTypeParams;
      }
      if (!n.typeParams) {
        delete n.typeParams;
      }
      if (!n.abstract) {
        delete n.abstract;
      }
      if (!n.declare) {
        delete n.declare;
      }
      if (n.decorators.length === 0) {
        delete n.decorators;
      }
      if (n.implements.length === 0) {
        delete n.implements;
      }
      break;
    case "ClassMethod":
      n.type = "MethodDefinition";
      n.computed = false;
      n.override = false;
      n.static = n.isStatic;
      n.value = n.function;
      n.value.type = "FunctionExpression";
      n.value.id = null;
      n.value.expression = false;
      delete n.function;
      delete n.isStatic;
      delete n.isAbstract;
      delete n.isOptional;
      delete n.isOverride;
      delete n.accessibility;
      break;
    case "ClassProperty":
      n.type = "PropertyDefinition";
      n.override = n.isOverride;
      n.readonly = undefined;
      n.static = n.isStatic;
      n.computed = false;
      delete n.isStatic;
      delete n.isAbstract;
      delete n.isOptional;
      delete n.isOverride;
      delete n.definite;
      if (!n.accessibility) {
        delete n.accessibility;
      }
      if (n.decorators.length === 0) {
        delete n.decorators;
      }
      break;
    case "NewExpression":
      if (!n.arguments) {
        n.arguments = [];
      }
      if (!n.typeArguments) {
        delete n.typeArguments;
      }
      break;
    case "ForOfStatement":
      n.await = !!n.await;
      break;
    case "KeyValueProperty":
      n.type = "Property";
      n.range = [n.key.span.start - 1, n.value.span.end - 1];
      n.computed = n.key.type === "Computed";
      if (n.key.type === "Computed") {
        n.key = n.key.expression;
      }
      n.kind = "init";
      n.method = false;
      n.shorthand = false;
      break;
    case "ObjectExpression":
      for (let i in n.properties) {
        const m = n.properties[i];
        if (m.type === "Identifier") {
          const range = [m.span.start - 1, m.span.end - 1];
          n.properties[i] = {
            type: "Property",
            range,
            computed: false,
            key: { type: "Identifier", range, name: m.name },
            kind: "init",
            method: false,
            shorthand: true,
            value: { type: "Identifier", range, name: m.name },
          };
        }
      }
      break;
    case "ArrayExpression":
      n.elements = n.elements.map((x) => {
        if (x === null) {
          return null;
        } else if (x.spread) {
          return {
            type: "SpreadElement",
            spread: x.spread,
            arguments: x.expression,
          };
        } else {
          return x.expression;
        }
      });
      break;
    case "MethodProperty":
      n.type = "Property";
      n.computed = false;
      n.kind = "init";
      n.method = true;
      n.shorthand = false;
      n.value = {
        type: "FunctionExpression",
        range: [n.span.start, n.span.end - 1],
        async: n.async,
        body: n.body,
        expression: false,
        generator: false,
        id: null,
        params: [],
      };
      delete n.async;
      delete n.decorators;
      delete n.body;
      delete n.generator;
      delete n.params;
      delete n.returnType;
      break;
    case "ImportDeclaration":
      n.type = "PropertyDefinition";
      n.assertions = n.asserts || [];
      n.importKind = "value";
      delete n.asserts;
      break;
    case "ExportDefaultExpression":
      n.type = "ExportDefaultDeclaration";
      n.declaration = n.expression;
      delete n.expression;
      n.exportKind = "value";
      break;
    case "ExportDefaultDeclaration":
      n.declaration = n.decl;
      n.exportKind = "value";
      delete n.decl;
      if (n.declaration.type === "FunctionExpression") {
        n.declaration.type = "FunctionDeclaration";
      }
      break;
    case "ExportDeclaration":
      n.type = "ExportNamedDeclaration";
      n.assertions = [];
      n.exportKind = "value";
      n.source = null;
      n.specifiers = [];
      break;
    case "ExportNamedDeclaration":
      n.declaration = null;
      n.exportKind = "value";
      n.assertions = n.asserts || [];
      delete n.asserts;
      delete n.typeOnly;
      break;
    case "ExportSpecifier":
      n.local = n.orig;
      if (!n.exported) {
        n.exported = { ...n.orig };
      }
      n.exportKind = "value";
      delete n.orig;
      delete n.isTypeOnly;
      break;
    case "SpreadElement":
      n.argument = n.arguments;
      n.range = [n.spread.start - 1, n.spread.end];
      delete n.arguments;
      delete n.spread;
      break;
    case "BlockStatement":
      n.body = n.stmts;
      delete n.stmts;
      break;
    case "StringLiteral":
    case "NumericLiteral":
      n.type = "Literal";
      break;
    case "BooleanLiteral":
      n.type = "Literal";
      n.raw = n.value ? "true" : "false";
      break;
    case "RegExpLiteral":
      n.type = "Literal";
      n.regex = {
        flags: n.flags,
        pattern: n.pattern,
      };
      n.value = {};
      n.raw = "/" + n.pattern + "/" + n.flags;

      delete n.flags;
      delete n.pattern;
      break;
    case "Identifier":
      n.name = n.value;
      delete n.optional;
      delete n.value;
      if (!n.typeAnnotation) {
        delete n.typeAnnotation;
      }
      break;
    case "UnaryExpression":
      if (n.operator === "!") {
        n.prefix = true;
      }
      break;
    case "BinaryExpression":
      if (n.operator === "&&" || n.operator === "||") {
        n.type = "LogicalExpression";
      }
      break;
    case "CallExpression":
      n.arguments = n.arguments.map((x) => {
        if (x.spread) {
          return {
            type: "SpreadElement",
            spread: x.spread,
            arguments: x.expression,
          };
        } else {
          return x.expression;
        }
      });
      n.optional = n.optional || false;
      if (n.typeArguments) {
        n.typeParameters = n.typeArguments;
      }
      delete n.typeArguments;
      break;
    case "OptionalChainingExpression":
      n.type = "ChainExpression";
      n.expression = n.base;
      if (n.expression.type === "CallExpression") {
        n.expression.optional = true;
      }
      delete n.base;
      delete n.questionDotToken;
      break;
    case "MemberExpression":
      n.computed = n.property.type === "Computed";
      n.optional = n.optional || false;
      if (n.property.type === "Computed") {
        n.property = n.property.expression;
      }
      break;
    case "TemplateElement":
      n.span.start -= 1;
      n.span.end += 2;
      n.value = {
        cooked: n.cooked,
        raw: n.raw,
      };
      delete n.cooked;
      delete n.raw;
      // n.computed = n.property.type === "Computed";
      // n.optional = n.optional || false;
      // if (n.property.type === "Computed") {
      //   n.property = n.property.expression;
      // }
      break;

    case "TemplateLiteral":
      if (n.quasis.length > 0) {
        n.quasis[n.quasis.length - 1].span.end -= 1;
      }
      break;
    case "ParenthesisExpression":
      return n.expression;
    case "VariableDeclarator":
      delete n.definite;
      break;
    case "VariableDeclaration":
      delete n.declare;
      break;
    case "TsFunctionType":
      n.type = "TSFunctionType";
      if (!n.typeParams) {
        delete n.typeParams;
      }
      n.returnType = n.typeAnnotation;
      delete n.typeAnnotation;
      break;
    case "TsTypeParameter":
      n.type = "TSTypeParameter";
      n.constraint = n.constraint || undefined;
      n.default = n.default || undefined;
      break;
    case "TsTypeQuery":
      n.type = "TSTypeQuery";
      n.typeParameters = n.typeArguments || undefined;
      delete n.typeArguments;
      break;
    case "TsTypeOperator":
      n.type = "TSTypeOperator";
      if (n.init) {
        n.initializer = n.init;
        delete n.init;
      }
      if (n.op) {
        n.operator = n.op;
        delete n.op;
      }
      break;
    case "TsEnumMember":
      n.type = "TSEnumMember";
      if (n.init) {
        n.initializer = n.init;
        delete n.init;
      }
      if (n.op) {
        n.operator = n.op;
        delete n.op;
      }
      break;
    case "TsEnumDeclaration":
      n.type = "TSEnumDeclaration";
      delete n.declare;
      delete n.isConst;
      break;
    case "TsArrayType":
      n.type = "TSArrayType";
      n.elementType = n.elemType;
      delete n.elemType;
      break;
    case "TsUnionType":
      n.type = "TSUnionType";
      break;
    case "TsIndexSignature":
      n.type = "TSIndexSignature";
      break;
    case "TsTypeParameterDeclaration":
      n.type = "TSTypeParameterDeclaration";
      break;
    case "TsTypeParameterInstantiation":
      n.type = "TSTypeParameterInstantiation";
      break;
    case "TsTypeAliasDeclaration":
      n.type = "TSTypeAliasDeclaration";
      if (n.typeParams) {
        n.typeParameters = n.typeParams;
      }
      delete n.typeParams;
      delete n.declare;
      break;
    case "TsLiteralType":
      n.type = "TSLiteralType";
      break;
    case "TsTypeReference":
      n.type = "TSTypeReference";
      n.typeParameters = n.typeParams || undefined;
      delete n.typeParams;
      break;
    case "TsTypeAnnotation":
      n.type = "TSTypeAnnotation";
      break;
    case "TsInterfaceDeclaration":
      n.type = "TSInterfaceDeclaration";
      delete n.declare;
      break;
    case "TsPropertySignature":
      n.type = "TSPropertySignature";
      n.initializer = n.init;
      delete n.init;
      break;
    case "TsKeywordType":
      switch (n.kind) {
        case "number":
          n.type = "TSNumberKeyword";
          break;
        case "boolean":
          n.type = "TSBooleanKeyword";
          break;
        case "string":
          n.type = "TSStringKeyword";
          break;
        case "any":
          n.type = "TSAnyKeyword";
          break;
        case "void":
          n.type = "TSVoidKeyword";
          break;
      }
      if (n.type !== "TsKeywordType") {
        delete n.kind;
      }
      break;
  }

  if (n.span) {
    n.range = [n.span.start - 1, n.span.end - 1];
    delete n.span;
  }

  if (!n.typeAnnotation) {
    delete n.typeAnnotation;
  }
}

function traverse(ast, fn) {
  if (typeof ast !== "object") {
    return;
  }
  const v = fn(ast);
  for (const k in ast) {
    const n = ast[k];
    const w = traverse(n, fn);
    if (w) {
      ast[k] = w;
    }
  }
  return v;
}

export function convert(ast) {
  traverse(ast, enter);
  return ast;
}
