import { factory, ImportSpecifier } from 'typescript';
import * as ts from 'typescript';
import {
  InputArguments,
  InputDecorator,
  InputPropertyDeclaration,
} from './custom-types';
import { objectIdSchemaProperty } from './../server/resource/schema/ast-schema';

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
  decorators: ts.Decorator[] | undefined,
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

export function addDecorators(decoratorInfo: InputDecorator): ts.Decorator {
  const propertyAssignments = [];
  decoratorInfo.arguments.forEach((argument) => {
    /* for mongoose.Schema.Type.ObjectId*/
    if (argument.name === 'ObjectId')
      propertyAssignments.push(objectIdSchemaProperty);
    else propertyAssignments.push(addPropertyAssignment(argument));
  });
  return factory.createDecorator(
    factory.createCallExpression(
      factory.createIdentifier(decoratorInfo.name),
      undefined,
      propertyAssignments.length == 0
        ? []
        : [factory.createObjectLiteralExpression(propertyAssignments, false)],
    ),
  );
}

export function addPropertyAssignment(
  argumentsInfo: InputArguments,
): ts.PropertyAssignment {
  if (typeof argumentsInfo.type === 'boolean') {
    return factory.createPropertyAssignment(
      factory.createIdentifier(argumentsInfo.name),
      argumentsInfo.type ? factory.createTrue() : factory.createFalse(),
    );
  } else if (typeof argumentsInfo.type === 'string') {
    return factory.createPropertyAssignment(
      factory.createIdentifier(argumentsInfo.name),
      factory.createStringLiteral(argumentsInfo.type),
    );
  } else {
    return null;
  }
}

export function addPropertyDeclaration(
  propertyInfo: InputPropertyDeclaration,
): ts.PropertyDeclaration {
  const decorators = [];
  propertyInfo.decorators.forEach((decorator) => {
    decorators.push(addDecorators(decorator));
  });
  return factory.createPropertyDeclaration(
    decorators,
    undefined,
    factory.createIdentifier(propertyInfo.name),
    undefined,
    typeof propertyInfo.type === 'string'
      ? factory.createTypeReferenceNode(
          factory.createIdentifier(propertyInfo.type),
          undefined,
        )
      : factory.createKeywordTypeNode(
          propertyInfo.type as unknown as ts.KeywordTypeSyntaxKind,
        ),
    undefined,
  );
}
