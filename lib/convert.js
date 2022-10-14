function getRange(span) {
  return [span?.start - 1, span?.end - 1];
}

export function convert(n) {
  if (!n) {
    return n;
  }
  switch (n.type) {
    case "ParenthesisExpression":
      return convert(n.expression);
    case "ArrayExpression":
      return {
        type: "ArrayExpression",
        elements: n.elements.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "ArrayPattern":
      return {
        type: "ArrayPattern",
        elements: n.elements.map((x) => convert(x)),
        range: getRange(n.span),
        typeAnnotation: convert(n.typeAnnotation),
        decorators: n.decorators.map((x) => convert(x)),
      };
    case "ArrowFunctionExpression":
      return {
        type: "ArrowFunctionExpression",
        generator: convert(n.generator),
        id: null,
        params: n.params.map((x) => convert(x)),
        body: convert(n.body),
        async: n.async,
        expression: n.body.type !== "BlockStatement",
        range: getRange(n.span),
        returnType: convert(n.returnType),
        typeParameters: convert(n.typeParameters),
      };
    case "AssignmentExpression":
      return {
        type: "AssignmentExpression",
        operator: n.operator,
        left: convert(n.left),
        right: convert(n.right),
        range: getRange(n.span),
      };
    case "AssignmentPattern":
      return {
        type: "AssignmentPattern",
        left: convert(n.left),
        right: convert(n.right),
        range: getRange(n.span),
        decorators: n.decorators.map((x) => convert(x)),
      };
    case "AwaitExpression":
      return {
        type: "AwaitExpression",
        argument: convert(n.argument),
        range: getRange(n.span),
      };
    case "BinaryExpression": {
      let type;
      switch (n.operator) {
        case "==":
        case "&&":
        case "||":
          type = "LogicalExpression";
          break;
        default:
          type = "BinaryExpression";
      }
      return {
        type,
        operator: n.operator,
        left: convert(n.left),
        right: convert(n.right),
        range: getRange(n.span),
      };
    }
    case "BlockStatement":
      return {
        type: "BlockStatement",
        body: n.stmts.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "BreakStatement":
      return {
        type: "BreakStatement",
        label: convert(n.label),
        range: getRange(n.span),
      };
    case "CallExpression":
      return {
        type: "CallExpression",
        callee: convert(n.callee),
        arguments: n.arguments.map((x) => {
          if (x.spread) {
            return {
              type: "SpreadElement",
              range: getRange(x.spread),
              argument: convert(x.expression),
            };
          } else {
            return convert(x.expression);
          }
        }),
        optional: convert(n.optional) || false,
        range: getRange(n.span),
        typeParameters: convert(n.typeParameters),
      };
    case "CatchClause":
      return {
        type: "CatchClause",
        param: convert(n.param),
        body: convert(n.body),
        range: getRange(n.span),
      };
    case "OptionalChainingExpression":
    case "ChainExpression":
      return {
        type: "ChainExpression",
        expression: convert(n.base),
        range: getRange(n.span),
      };
    case "ClassBody":
      return {
        type: "ClassBody",
        body: n.body.map((x) => convert(x)),
        range: getRange(n.span),
      };

    case "ClassMethod":
      return {
        type: "MethodDefinition",
        key: convert(n.key),
        computed: n.key.type === "Computed",
        static: n.isStatic,
        override: n.isOverride,
        kind: n.kind,
        range: getRange(n.span),
        accessibility: n.accessibility,
        optional: convert(n.optional),
        decorators: n.decorators?.map?.((x) => convert(x)),
        value: {
          type: "FunctionExpression",
          body: convert(n.function.body),
          expression: false,
          generator: n.function.generator,
          id: null,
          async: n.function.async,
          range: getRange(n.function.span),
          params: n.function.params.map((x) => convert(x.pat)),
          returnType: convert(n.function.returnType),
        },
      };
    case "ClassProperty":
      return {
        type: "PropertyDefinition",
        key: convert(n.key),
        value: convert(n.value),
        computed: convert(n.computed),
        static: n.isStatic,
        override: n.isOverride,
        readonly: n.readonly || undefined,
        declare: convert(n.declare),
        range: getRange(n.span),
        typeAnnotation: convert(n.typeAnnotation),
        accessibility: n.accessibility,
        optional: convert(n.optional),
        decorators: n.decorators.map((x) => convert(x)),
        definite: convert(n.definite),
      };

    case "PrivateProperty":
      return {
        type: "PropertyDefinition",
        key: n.key,
        value: convert(n.value),
        computed: convert(n.computed),
        static: n.isStatic,
        override: n.isOverride,
        readonly: n.readonly || undefined,
        declare: convert(n.declare),
        range: getRange(n.span),
        typeAnnotation: convert(n.typeAnnotation),
        accessibility: n.accessibility,
        optional: convert(n.optional),
        decorators: n.decorators.map((x) => convert(x)),
        definite: convert(n.definite),
      };

    case "ClassDeclaration":
      return {
        type: "ClassDeclaration",
        id: convert(n.identifier),
        body: {
          type: "ClassBody",
          range: [0, 0],
          body: n.body.map((x) => convert(x)),
        },
        superClass: convert(n.superClass),
        range: getRange(n.span),
        typeParameters: convert(n.typeParameters),
        superTypeParameters: convert(n.superTypeParameters),
        abstract: n.isAbstract,
        implements: n.implements.map((x) => convert(x)),
        declare: convert(n.declare),
        decorators: n.decorators.map((x) => convert(x)),
      };
    case "ClassExpression":
      return {
        type: "ClassExpression",
        id: convert(n.id),
        body: convert(n.body),
        superClass: convert(n.superClass),
        range: getRange(n.span),
      };
    case "ConditionalExpression":
      return {
        type: "ConditionalExpression",
        test: convert(n.test),
        consequent: convert(n.consequent),
        alternate: convert(n.alternate),
        range: getRange(n.span),
      };
    case "ContinueStatement":
      return {
        type: "ContinueStatement",
        label: convert(n.label),
        range: getRange(n.span),
      };
    case "Decorator":
      return {
        type: "Decorator",
        expression: convert(n.expression),
        range: getRange(n.span),
      };
    case "DoWhileStatement":
      return {
        type: "DoWhileStatement",
        test: convert(n.test),
        body: convert(n.body),
        range: getRange(n.span),
      };
    case "EmptyStatement":
      return {
        type: "EmptyStatement",
        range: getRange(n.span),
      };
    case "ExportAllDeclaration":
      return {
        type: "ExportAllDeclaration",
        source: convert(n.source),
        exportKind: "value",
        exported: null,
        assertions: n.asserts || [],
        range: getRange(n.span),
      };
    case "ExportDefaultExpression": {
      return {
        type: "ExportDefaultDeclaration",
        declaration: convert(n.expression),
        exportKind: "value",
        range: getRange(n.span),
      };
    }
    case "ExportDefaultDeclaration": {
      const v = {
        type: "ExportDefaultDeclaration",
        declaration: convert(n.decl),
        exportKind: n.exportKind,
        range: getRange(n.span),
      };
      if (v.declaration.type === "FunctionExpression") {
        v.declaration.type = "FunctionDeclaration";
      }
      return v;
    }
    case "ExportDeclaration":
      return {
        type: "ExportNamedDeclaration",
        declaration: convert(n.declaration),
        specifiers: [],
        source: null,
        exportKind: "value",
        range: getRange(n.span),
        assertions: n.asserts || [],
      };
    case "ExportNamedDeclaration":
      return {
        type: "ExportNamedDeclaration",
        declaration: convert(n.declaration),
        specifiers: n.specifiers.map((x) => convert(x)),
        source: convert(n.source),
        exportKind: n.typeOnly ? "type" : "value",
        range: getRange(n.span),
        assertions: n.asserts || [],
      };
    case "ExportSpecifier":
      return {
        type: "ExportSpecifier",
        local: convert(n.orig),
        exported: convert(n.exported || n.orig),
        exportKind: n.isTypeOnly ? "type" : "value",
        range: getRange(n.span),
      };
    case "ExpressionStatement":
      return {
        type: "ExpressionStatement",
        expression: convert(n.expression),
        range: getRange(n.span),
        directive: n.directive,
      };
    case "ForInStatement":
      return {
        type: "ForInStatement",
        left: convert(n.left),
        right: convert(n.right),
        body: convert(n.body),
        range: getRange(n.span),
      };
    case "ForOfStatement":
      return {
        type: "ForOfStatement",
        left: convert(n.left),
        right: convert(n.right),
        body: convert(n.body),
        await: convert(n.await),
        range: getRange(n.span),
      };
    case "ForStatement":
      return {
        type: "ForStatement",
        init: convert(n.init),
        test: convert(n.test),
        update: convert(n.update),
        body: convert(n.body),
        range: getRange(n.span),
      };
    case "FunctionDeclaration":
      return {
        type: "FunctionDeclaration",
        id: convert(n.identifier),
        generator: convert(n.generator),
        expression: false,
        async: convert(n.async),
        params: n.params.map((x) => convert(x.pat)),
        body: convert(n.body),
        range: getRange(n.span),
        returnType: convert(n.returnType),
        typeParameters: convert(n.typeParameters),
      };
    case "FunctionExpression":
      return {
        type: "FunctionExpression",
        id: convert(n.identifier),
        params: n.params.map((x) => convert(x.pat)),
        generator: convert(n.generator),
        expression: n.body.type !== "BlockStatement",
        async: convert(n.async),
        body: convert(n.body),
        range: getRange(n.span),
        returnType: convert(n.returnType),
        typeParameters: convert(n.typeParameters),
      };
    case "Identifier":
      return {
        type: "Identifier",
        name: n.value,
        range: getRange(n.span),
        typeAnnotation: convert(n.typeAnnotation),
        // optional: convert(n.optional),
        decorators: n.decorators?.map((x) => convert(x)),
      };
    case "IfStatement":
      return {
        type: "IfStatement",
        test: convert(n.test),
        consequent: convert(n.consequent),
        alternate: convert(n.alternate),
        range: getRange(n.span),
      };
    case "ImportAttribute":
      return {
        type: "ImportAttribute",
        key: convert(n.key),
        value: convert(n.value),
        range: getRange(n.span),
      };
    case "ImportDeclaration":
      return {
        type: "ImportDeclaration",
        source: convert(n.source),
        specifiers: n.specifiers?.map((x) => convert(x)),
        importKind: n.typeOnly ? "type" : "value",
        assertions: n.asserts || [],
        range: getRange(n.span),
      };
    case "ImportDefaultSpecifier":
      return {
        type: "ImportDefaultSpecifier",
        local: convert(n.local),
        range: getRange(n.span),
      };
    case "ImportExpression":
      return {
        type: "ImportExpression",
        source: convert(n.source),
        attributes: convert(n.attributes),
        range: getRange(n.span),
      };
    case "ImportNamespaceSpecifier":
      return {
        type: "ImportNamespaceSpecifier",
        local: convert(n.local),
        range: getRange(n.span),
      };
    case "ImportSpecifier":
      return {
        type: "ImportSpecifier",
        local: convert(n.local),
        imported: convert(n.imported || n.local),
        importKind: n.isTypeOnly ? "type" : "value",
        range: getRange(n.span),
      };
    case "JSXAttribute":
      return {
        type: "JSXAttribute",
        name: convert(n.name),
        value: convert(n.value),
        range: getRange(n.span),
      };
    case "JSXClosingElement":
      return {
        type: "JSXClosingElement",
        name: convert(n.name),
        range: getRange(n.span),
      };
    case "JSXClosingFragment":
      return {
        type: "JSXClosingFragment",
        range: getRange(n.span),
      };
    case "JSXElement":
      return {
        type: "JSXElement",
        openingElement: convert(n.openingElement),
        closingElement: convert(n.closingElement),
        children: n.children.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "JSXExpressionContainer":
      return {
        type: "JSXExpressionContainer",
        expression: convert(n.expression),
        range: getRange(n.span),
      };
    case "JSXFragment":
      return {
        type: "JSXFragment",
        openingFragment: convert(n.openingFragment),
        closingFragment: convert(n.closingFragment),
        children: n.children.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "JSXIdentifier":
      return {
        type: "JSXIdentifier",
        name: n.name,
        range: getRange(n.span),
      };
    case "JSXMemberExpression":
      return {
        type: "JSXMemberExpression",
        object: convert(n.object),
        property: convert(n.property),
        range: getRange(n.span),
      };
    case "JSXOpeningElement":
      return {
        type: "JSXOpeningElement",
        typeParameters: convert(n.typeParameters),
        selfClosing: convert(n.selfClosing),
        name: convert(n.name),
        attributes: n.attributes.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "JSXOpeningFragment":
      return {
        type: "JSXOpeningFragment",
        range: getRange(n.span),
      };
    case "JSXSpreadAttribute":
      return {
        type: "JSXSpreadAttribute",
        argument: convert(n.argument),
        range: getRange(n.span),
      };
    case "JSXText":
      return {
        type: "JSXText",
        value: n.value,
        raw: n.raw,
        range: getRange(n.span),
      };

    case "StringLiteral":
    case "NumericLiteral":
      return {
        type: "Literal",
        value: n.value,
        raw: n.raw,
        range: getRange(n.span),
      };
    case "BooleanLiteral":
      return {
        type: "Literal",
        value: n.value,
        raw: n.value ? "true" : "false",
        range: getRange(n.span),
      };
    case "RegExpLiteral":
    case "Literal":
      return {
        type: "Literal",
        value: convert(n.value),
        raw: n.raw,
        range: getRange(n.span),
        regex: convert(n.regex),
      };
    case "LogicalExpression":
      return {
        type: "LogicalExpression",
        operator: n.operator,
        left: convert(n.left),
        right: convert(n.right),
        range: getRange(n.span),
      };
    case "MemberExpression":
      return {
        type: "MemberExpression",
        object: convert(n.object),
        property: convert(n.property),
        computed: n.property.type === "Computed",
        optional: n.optional || false,
        range: getRange(n.span),
      };
    case "MetaProperty":
      return {
        type: "MetaProperty",
        meta: convert(n.meta),
        property: convert(n.property),
        range: getRange(n.span),
      };
    case "MethodDefinition":
      return {
        type: "MethodDefinition",
        key: convert(n.key),
        value: convert(n.value),
        computed: convert(n.computed),
        static: convert(n.static),
        kind: n.kind,
        override: convert(n.override),
        range: getRange(n.span),
        accessibility: n.accessibility,
        optional: convert(n.optional),
        decorators: n.decorators.map((x) => convert(x)),
      };
    case "NewExpression":
      return {
        type: "NewExpression",
        callee: convert(n.callee),
        arguments: n.arguments.map((x) => convert(x)),
        range: getRange(n.span),
        typeParameters: convert(n.typeParameters),
      };
    case "ObjectExpression":
      return {
        type: "ObjectExpression",
        properties: n.properties.map((m) => {
          if (m.type === "Identifier") {
            const range = [m.span.start - 1, m.span.end - 1];
            return {
              type: "Property",
              range,
              computed: false,
              key: { type: "Identifier", range, name: m.value },
              kind: "init",
              method: false,
              shorthand: true,
              value: { type: "Identifier", range, name: m.value },
            };
          }
          if (m.type === "MethodProperty") {
            return {
              type: "Property",
              range: [m.span.start - 1, m.span.end - 1],
              computed: m.key.type === "Computed",
              key:
                m.key.type === "Computed"
                  ? convert(m.key.expression)
                  : convert(m.key),
              kind: "init",
              method: true,
              shorthand: false,
              value: {
                type: "FunctionExpression",
                range: [m.span.start, m.span.end - 1],
                async: m.async,
                body: convert(m.body),
                expression: false,
                generator: false,
                id: null,
                params: m.params.map((x) => convert(x.pat)),
              },
            };
          }

          if (m.type === "KeyValueProperty") {
            return {
              type: "Property",
              range: [m.key.span.start - 1, m.value.span.end - 1],
              computed: m.key.type === "Computed",
              key:
                m.key.type === "Computed"
                  ? convert(m.key.expression)
                  : convert(m.key),
              kind: "init",
              method: false,
              shorthand: false,
              value: convert(m.value),
            };
          }

          return m;
        }),
        range: getRange(n.span),
      };
    case "ObjectPattern":
      return {
        type: "ObjectPattern",
        properties: n.properties.map((x) => convert(x)),
        range: getRange(n.span),
        typeAnnotation: convert(n.typeAnnotation),
        decorators: n.decorators.map((x) => convert(x)),
      };
    case "PrivateIdentifier":
      return {
        type: "PrivateIdentifier",
        name: n.name,
        range: getRange(n.span),
      };
    case "Module":
      return {
        type: "Program",
        body: n.body.map((x) => convert(x)),
        sourceType: "module",
        range: getRange(n.span),
      };
    case "KeyValueProperty":
      return {
        type: "Property",
        key: convert(n.key),
        value: convert(n.value),
        computed: convert(n.computed),
        method: convert(n.method),
        shorthand: convert(n.shorthand),
        kind: n.kind,
        range: getRange(n.span),
      };
    case "Property":
      return {
        type: "Property",
        key: convert(n.key),
        value: convert(n.value),
        computed: convert(n.computed),
        method: convert(n.method),
        shorthand: convert(n.shorthand),
        kind: n.kind,
        range: getRange(n.span),
      };
    case "PropertyDefinition":
      return {
        type: "PropertyDefinition",
        key: convert(n.key),
        value: convert(n.value),
        computed: convert(n.computed),
        static: convert(n.static),
        readonly: convert(n.readonly),
        declare: convert(n.declare),
        override: convert(n.override),
        range: getRange(n.span),
        typeAnnotation: convert(n.typeAnnotation),
        accessibility: n.accessibility,
        optional: convert(n.optional),
        decorators: n.decorators.map((x) => convert(x)),
        definite: convert(n.definite),
      };
    case "RestElement":
      return {
        type: "RestElement",
        argument: convert(n.argument),
        range: getRange(n.span),
        typeAnnotation: convert(n.typeAnnotation),
        decorators: n.decorators?.map((x) => convert(x)),
      };
    case "ReturnStatement":
      return {
        type: "ReturnStatement",
        argument: convert(n.argument),
        range: getRange(n.span),
      };
    case "SpreadElement":
      return {
        type: "SpreadElement",
        argument: convert(n.arguments),
        range: getRange(n.span),
      };
    case "StaticBlock":
      return {
        type: "StaticBlock",
        body: n.body.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "Super":
      return {
        type: "Super",
        range: getRange(n.span),
      };
    case "SwitchCase":
      return {
        type: "SwitchCase",
        test: convert(n.test),
        consequent: n.consequent.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "SwitchStatement":
      return {
        type: "SwitchStatement",
        discriminant: convert(n.discriminant),
        cases: n.cases.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "TsAbstractKeyword":
      return {
        type: "TSAbstractKeyword",
        range: getRange(n.span),
        loc: convert(n.loc),
      };
    case "TsAbstractMethodDefinition":
      return {
        type: "TSAbstractMethodDefinition",
        key: convert(n.key),
        value: convert(n.value),
        computed: convert(n.computed),
        static: convert(n.static),
        kind: n.kind,
        override: convert(n.override),
        range: getRange(n.span),
      };
    case "TsAbstractPropertyDefinition":
      return {
        type: "TSAbstractPropertyDefinition",
        key: convert(n.key),
        value: convert(n.value),
        computed: convert(n.computed),
        static: convert(n.static),
        readonly: convert(n.readonly),
        declare: convert(n.declare),
        override: convert(n.override),
        range: getRange(n.span),
        typeAnnotation: convert(n.typeAnnotation),
        accessibility: n.accessibility,
      };
    case "TsAnyKeyword":
      return {
        type: "TSAnyKeyword",
        range: getRange(n.span),
      };
    case "TsArrayType":
      return {
        type: "TSArrayType",
        elementType: convert(n.elementType),
        range: getRange(n.span),
      };
    case "TsAsExpression":
      return {
        type: "TSAsExpression",
        expression: convert(n.expression),
        typeAnnotation: convert(n.typeAnnotation),
        range: getRange(n.span),
      };
    case "TsAsyncKeyword":
      return {
        type: "TSAsyncKeyword",
        range: getRange(n.span),
        loc: convert(n.loc),
      };
    case "TsBigIntKeyword":
      return {
        type: "TSBigIntKeyword",
        range: getRange(n.span),
      };
    case "TsBooleanKeyword":
      return {
        type: "TSBooleanKeyword",
        range: getRange(n.span),
      };
    case "TsCallSignatureDeclaration":
      return {
        type: "TSCallSignatureDeclaration",
        params: n.params.map((x) => convert(x)),
        range: getRange(n.span),
        returnType: convert(n.returnType),
        typeParameters: convert(n.typeParameters),
      };
    case "TsClassImplements":
      return {
        type: "TSClassImplements",
        expression: convert(n.expression),
        range: getRange(n.span),
        typeParameters: convert(n.typeParameters),
      };
    case "TsConditionalType":
      return {
        type: "TSConditionalType",
        checkType: convert(n.checkType),
        extendsType: convert(n.extendsType),
        trueType: convert(n.trueType),
        falseType: convert(n.falseType),
        range: getRange(n.span),
      };
    case "TsConstructSignatureDeclaration":
      return {
        type: "TSConstructSignatureDeclaration",
        params: n.params.map((x) => convert(x)),
        range: getRange(n.span),
        returnType: convert(n.returnType),
        typeParameters: convert(n.typeParameters),
      };
    case "TsConstructorType":
      return {
        type: "TSConstructorType",
        params: n.params.map((x) => convert(x)),
        abstract: convert(n.abstract),
        range: getRange(n.span),
        returnType: convert(n.returnType),
        typeParameters: convert(n.typeParameters),
      };
    case "TsDeclareFunction":
      return {
        type: "TSDeclareFunction",
        id: convert(n.id),
        generator: convert(n.generator),
        expression: convert(n.expression),
        async: convert(n.async),
        params: n.params.map((x) => convert(x)),
        body: convert(n.body),
        range: getRange(n.span),
        returnType: convert(n.returnType),
        typeParameters: convert(n.typeParameters),
        declare: convert(n.declare),
      };
    case "TsEmptyBodyFunctionExpression":
      return {
        type: "TSEmptyBodyFunctionExpression",
        id: convert(n.id),
        generator: convert(n.generator),
        expression: convert(n.expression),
        async: convert(n.async),
        body: convert(n.body),
        range: getRange(n.span),
        params: n.params.map((x) => convert(x)),
        returnType: convert(n.returnType),
        typeParameters: convert(n.typeParameters),
      };
    case "TsEnumDeclaration":
      return {
        type: "TSEnumDeclaration",
        id: convert(n.id),
        members: n.members.map((x) => convert(x)),
        range: getRange(n.span),
        const: convert(n.const),
        declare: convert(n.declare),
        modifiers: n.modifiers.map((x) => convert(x)),
      };
    case "TsEnumMember":
      return {
        type: "TSEnumMember",
        id: convert(n.id),
        range: getRange(n.span),
        initializer: convert(n.initializer),
        computed: convert(n.computed),
      };
    case "TsExportAssignment":
      return {
        type: "TSExportAssignment",
        expression: convert(n.expression),
        range: getRange(n.span),
      };
    case "TsExternalModuleReference":
      return {
        type: "TSExternalModuleReference",
        expression: convert(n.expression),
        range: getRange(n.span),
      };
    case "TsFunctionType":
      return {
        type: "TSFunctionType",
        params: n.params.map((x) => convert(x)),
        range: getRange(n.span),
        returnType: convert(n.typeAnnotation),
        typeParameters: convert(n.typeParams),
      };
    case "TsImportEqualsDeclaration":
      return {
        type: "TSImportEqualsDeclaration",
        id: convert(n.id),
        moduleReference: convert(n.moduleReference),
        importKind: n.importKind,
        isExport: convert(n.isExport),
        range: getRange(n.span),
      };
    case "TsImportType":
      return {
        type: "TSImportType",
        isTypeOf: convert(n.isTypeOf),
        parameter: convert(n.parameter),
        qualifier: convert(n.qualifier),
        typeParameters: convert(n.typeParameters),
        range: getRange(n.span),
      };
    case "TsIndexSignature":
      return {
        type: "TSIndexSignature",
        parameters: n.parameters.map((x) => convert(x)),
        range: getRange(n.span),
        typeAnnotation: convert(n.typeAnnotation),
        readonly: convert(n.readonly),
        export: convert(n.export),
        accessibility: n.accessibility,
        static: convert(n.static),
      };
    case "TsIndexedAccessType":
      return {
        type: "TSIndexedAccessType",
        objectType: convert(n.objectType),
        indexType: convert(n.indexType),
        range: getRange(n.span),
      };
    case "TsInferType":
      return {
        type: "TSInferType",
        typeParameter: convert(n.typeParameter),
        range: getRange(n.span),
      };
    case "TsInstantiationExpression":
      return {
        type: "TSInstantiationExpression",
        expression: convert(n.expression),
        range: getRange(n.span),
        typeParameters: convert(n.typeParameters),
      };
    case "TsInterfaceBody":
      return {
        type: "TSInterfaceBody",
        body: n.body.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "TsInterfaceDeclaration":
      return {
        type: "TSInterfaceDeclaration",
        body: convert(n.body),
        id: convert(n.id),
        range: getRange(n.span),
        extends: n.extends.map((x) => convert(x)),
        typeParameters: convert(n.typeParameters),
        declare: convert(n.declare),
        implements: n.implements.map((x) => convert(x)),
        abstract: convert(n.abstract),
      };
    case "TsInterfaceHeritage":
      return {
        type: "TSInterfaceHeritage",
        expression: convert(n.expression),
        range: getRange(n.span),
        typeParameters: convert(n.typeParameters),
        loc: convert(n.loc),
      };
    case "TsIntersectionType":
      return {
        type: "TSIntersectionType",
        types: n.types.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "TsIntrinsicKeyword":
      return {
        type: "TSIntrinsicKeyword",
        range: getRange(n.span),
      };
    case "TsLiteralType":
      return {
        type: "TSLiteralType",
        literal: convert(n.literal),
        range: getRange(n.span),
      };
    case "TsMappedType":
      return {
        type: "TSMappedType",
        typeParameter: convert(n.typeParameter),
        nameType: convert(n.nameType),
        range: getRange(n.span),
        readonly: convert(n.readonly),
        typeAnnotation: convert(n.typeAnnotation),
        optional: convert(n.optional),
      };
    case "TsMethodSignature":
      return {
        type: "TSMethodSignature",
        computed: convert(n.computed),
        key: convert(n.key),
        params: n.params.map((x) => convert(x)),
        kind: n.kind,
        range: getRange(n.span),
        returnType: convert(n.returnType),
        optional: convert(n.optional),
        typeParameters: convert(n.typeParameters),
        accessibility: n.accessibility,
        export: convert(n.export),
        readonly: convert(n.readonly),
        static: convert(n.static),
      };
    case "TsModuleBlock":
      return {
        type: "TSModuleBlock",
        body: n.body.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "TsModuleDeclaration":
      return {
        type: "TSModuleDeclaration",
        id: convert(n.id),
        range: getRange(n.span),
        body: convert(n.body),
        declare: convert(n.declare),
        global: convert(n.global),
      };
    case "TsNamedTupleMember":
      return {
        type: "TSNamedTupleMember",
        elementType: convert(n.elementType),
        label: convert(n.label),
        optional: convert(n.optional),
        range: getRange(n.span),
      };
    case "TsNamespaceExportDeclaration":
      return {
        type: "TSNamespaceExportDeclaration",
        id: convert(n.id),
        range: getRange(n.span),
      };
    case "TsKeywordType": {
      const type = {
        number: "TSNumberKeyword",
        boolean: "TSBooleanKeyword",
        string: "TSStringKeyword",
        undefined: "TSUndefinedKeyword",
        null: "TSNullKeyword",
        void: "TSVoidKeyword",
      }[n.kind];
      return type
        ? {
            type,
            range: getRange(n.span),
          }
        : n;
    }
    case "TsNeverKeyword":
      return {
        type: "TSNeverKeyword",
        range: getRange(n.span),
      };
    case "TsNonNullExpression":
      return {
        type: "TSNonNullExpression",
        expression: convert(n.expression),
        range: getRange(n.span),
      };
    case "TsNullKeyword":
      return {
        type: "TSNullKeyword",
        range: getRange(n.span),
      };
    case "TsNumberKeyword":
      return {
        type: "TSNumberKeyword",
        range: getRange(n.span),
      };
    case "TsObjectKeyword":
      return {
        type: "TSObjectKeyword",
        range: getRange(n.span),
      };
    case "TsOptionalType":
      return {
        type: "TSOptionalType",
        typeAnnotation: convert(n.typeAnnotation),
        range: getRange(n.span),
      };
    case "TsParameterProperty":
      return {
        type: "TSParameterProperty",
        accessibility: n.accessibility,
        readonly: convert(n.readonly),
        static: convert(n.static),
        export: convert(n.export),
        override: convert(n.override),
        parameter: convert(n.parameter),
        range: getRange(n.span),
        decorators: n.decorators.map((x) => convert(x)),
      };
    case "TsPrivateKeyword":
      return {
        type: "TSPrivateKeyword",
        range: getRange(n.span),
        loc: convert(n.loc),
      };
    case "TsPropertySignature":
      return {
        type: "TSPropertySignature",
        optional: convert(n.optional),
        computed: convert(n.computed),
        key: convert(n.key),
        typeAnnotation: convert(n.typeAnnotation),
        initializer: convert(n.initializer),
        readonly: convert(n.readonly),
        static: convert(n.static),
        export: convert(n.export),
        range: getRange(n.span),
        accessibility: n.accessibility,
      };
    case "TsProtectedKeyword":
      return {
        type: "TSProtectedKeyword",
        range: getRange(n.span),
        loc: convert(n.loc),
      };
    case "TsPublicKeyword":
      return {
        type: "TSPublicKeyword",
        range: getRange(n.span),
        loc: convert(n.loc),
      };
    case "TsQualifiedName":
      return {
        type: "TSQualifiedName",
        left: convert(n.left),
        right: convert(n.right),
        range: getRange(n.span),
      };
    case "TsReadonlyKeyword":
      return {
        type: "TSReadonlyKeyword",
        range: getRange(n.span),
        loc: convert(n.loc),
      };
    case "TsRestType":
      return {
        type: "TSRestType",
        typeAnnotation: convert(n.typeAnnotation),
        range: getRange(n.span),
      };
    case "TsStaticKeyword":
      return {
        type: "TSStaticKeyword",
        range: getRange(n.span),
        loc: convert(n.loc),
      };
    case "TsStringKeyword":
      return {
        type: "TSStringKeyword",
        range: getRange(n.span),
      };
    case "TsSymbolKeyword":
      return {
        type: "TSSymbolKeyword",
        range: getRange(n.span),
      };
    case "TsTemplateLiteralType":
      return {
        type: "TSTemplateLiteralType",
        quasis: n.quasis.map((x) => convert(x)),
        types: n.types.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "TsThisType":
      return {
        type: "TSThisType",
        range: getRange(n.span),
      };
    case "TsTupleType":
      return {
        type: "TSTupleType",
        elementTypes: n.elementTypes.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "TsTypeAliasDeclaration":
      return {
        type: "TSTypeAliasDeclaration",
        id: convert(n.id),
        typeAnnotation: convert(n.typeAnnotation),
        range: getRange(n.span),
        typeParameters: convert(n.typeParameters),
        declare: convert(n.declare),
      };
    case "TsTypeAnnotation":
      return {
        type: "TSTypeAnnotation",
        range: getRange(n.span),
        typeAnnotation: convert(n.typeAnnotation),
      };
    case "TsTypeLiteral":
      return {
        type: "TSTypeLiteral",
        members: n.members.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "TsTypeOperator":
      return {
        type: "TSTypeOperator",
        operator: n.operator,
        typeAnnotation: convert(n.typeAnnotation),
        range: getRange(n.span),
      };
    case "TsTypeParameter":
      return {
        type: "TSTypeParameter",
        name: convert(n.name),
        constraint: convert(n.constraint),
        default: convert(n.default),
        in: convert(n.in),
        out: convert(n.out),
        range: getRange(n.span),
      };
    case "TsTypeParameterDeclaration":
      return {
        type: "TSTypeParameterDeclaration",
        range: getRange(n.span),
        params: n.parameters.map((x) => convert(x)),
      };
    case "TsTypeParameterInstantiation":
      return {
        type: "TSTypeParameterInstantiation",
        range: getRange(n.span),
        params: n.params.map((x) => convert(x)),
      };
    case "TsTypePredicate":
      return {
        type: "TSTypePredicate",
        asserts: convert(n.asserts),
        parameterName: convert(n.parameterName),
        typeAnnotation: convert(n.typeAnnotation),
        range: getRange(n.span),
      };
    case "TsTypeQuery":
      return {
        type: "TSTypeQuery",
        exprName: convert(n.exprName),
        typeParameters: convert(n.typeParameters),
        range: getRange(n.span),
      };
    case "TsTypeReference":
      return {
        type: "TSTypeReference",
        typeName: convert(n.typeName),
        typeParameters: convert(n.typeParameters),
        range: getRange(n.span),
      };
    case "TsUndefinedKeyword":
      return {
        type: "TSUndefinedKeyword",
        range: getRange(n.span),
      };
    case "TsUnionType":
      return {
        type: "TSUnionType",
        types: n.types.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "TsUnknownKeyword":
      return {
        type: "TSUnknownKeyword",
        range: getRange(n.span),
      };
    case "TsVoidKeyword":
      return {
        type: "TSVoidKeyword",
        range: getRange(n.span),
      };
    case "TaggedTemplateExpression":
      return {
        type: "TaggedTemplateExpression",
        typeParameters: convert(n.typeParameters),
        tag: convert(n.tag),
        quasi: convert(n.quasi),
        range: getRange(n.span),
      };
    case "TemplateElement":
      return {
        type: "TemplateElement",
        value: convert(n.value),
        tail: convert(n.tail),
        range: getRange(n.span),
      };
    case "TemplateLiteral":
      return {
        type: "TemplateLiteral",
        quasis: n.quasis.map((x) => convert(x)),
        expressions: n.expressions.map((x) => convert(x)),
        range: getRange(n.span),
      };
    case "ThisExpression":
      return {
        type: "ThisExpression",
        range: getRange(n.span),
      };
    case "ThrowStatement":
      return {
        type: "ThrowStatement",
        argument: convert(n.argument),
        range: getRange(n.span),
      };
    case "TryStatement":
      return {
        type: "TryStatement",
        block: convert(n.block),
        handler: convert(n.handler),
        finalizer: convert(n.finalizer),
        range: getRange(n.span),
      };
    case "UnaryExpression":
      return {
        type: "UnaryExpression",
        operator: n.operator,
        prefix: n.operator === "!",
        argument: convert(n.argument),
        range: getRange(n.span),
      };
    case "UpdateExpression":
      return {
        type: "UpdateExpression",
        operator: n.operator,
        prefix: n.prefix,
        argument: convert(n.argument),
        range: getRange(n.span),
      };
    case "VariableDeclaration":
      return {
        type: "VariableDeclaration",
        declarations: n.declarations.map((x) => convert(x)),
        kind: n.kind,
        range: getRange(n.span),
        declare: convert(n.declare),
      };
    case "VariableDeclarator":
      return {
        type: "VariableDeclarator",
        id: convert(n.id),
        init: convert(n.init),
        range: getRange(n.span),
        definite: convert(n.definite),
      };
    case "WhileStatement":
      return {
        type: "WhileStatement",
        test: convert(n.test),
        body: convert(n.body),
        range: getRange(n.span),
      };
    case "YieldExpression":
      return {
        type: "YieldExpression",
        delegate: convert(n.delegate),
        argument: convert(n.argument),
        range: getRange(n.span),
      };
    case "Computed":
      return convert(n.expression);
  }
  return n.type;
}
