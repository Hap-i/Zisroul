import { factory, ImportSpecifier } from 'typescript';
import * as ts from 'typescript';
/* This function return import statement node */
export function addImport(
  importItems: string[],
  importFrom: string,
  defaultImport: string | undefined,
): ts.ImportDeclaration {
  const node = factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      defaultImport ? factory.createIdentifier(defaultImport) : undefined,
      factory.createNamedImports(resolveImportItem(importItems)),
    ),
    factory.createStringLiteral(importFrom),
    undefined,
  );

  return node;
}

/* This function will handle multiple import statement */
export function resolveImportItem(items: string[]): ts.ImportSpecifier[] {
  const nodeArray: ImportSpecifier[] = [];
  items.forEach((item) => {
    const node = factory.createImportSpecifier(
      false,
      undefined,
      factory.createIdentifier(item),
    );
    nodeArray.push(node);
  });
  return nodeArray;
}

export function addClass(
  decorators: ts.Decorator[],
  className: string,
  members: ts.ClassElement[],
): ts.ClassDeclaration {
  return factory.createClassDeclaration(
    decorators,
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(className),
    undefined,
    undefined,
    members,
  );
}

export function addDecorators(
  decoratorName: string,
  propertyAssignments: ts.PropertyAssignment[],
): ts.Decorator {
  return factory.createDecorator(
    factory.createCallExpression(
      factory.createIdentifier(decoratorName),
      undefined,
      [factory.createObjectLiteralExpression(propertyAssignments, false)],
    ),
  );
}

export function addPropertyAssignment(
  identifier: string,
  literal: string | boolean,
) {
  if (typeof literal === 'boolean') {
    return factory.createPropertyAssignment(
      factory.createIdentifier(identifier),
      literal ? factory.createTrue() : factory.createFalse(),
    );
  } else {
    return factory.createPropertyAssignment(
      factory.createIdentifier(identifier),
      factory.createStringLiteral(literal),
    );
  }
}
