import { factory, ImportSpecifier } from 'typescript';
import * as ts from 'typescript';
import {
  InputArguments,
  InputConstructorDeclaration,
  InputDecorator,
  InputMethodDeclaration,
  InputParameterDeclaration,
  InputPropertyDeclaration,
} from './custom-types';
import { objectIdSchemaProperty } from './../server/resource/schema/ast-schema';
import { keywordType } from './ast-enums';

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

export function addConstructorDeclaration(
  constructorInfo: InputConstructorDeclaration,
) {
  const parameters = [];
  constructorInfo.parameters.forEach((parameter) => {
    parameters.push(addParameterDeclaration(parameter));
  });
  return factory.createConstructorDeclaration(
    undefined,
    undefined,
    parameters,
    factory.createBlock([], false),
  );
}

export function addModifier(keywordType: keywordType) {
  return factory.createModifier(
    keywordType as unknown as ts.ModifierSyntaxKind,
  );
}

export function addParameterDeclaration(
  parameterInfo: InputParameterDeclaration,
) {
  const modifiers = [];
  parameterInfo.modifiers.forEach((modifier) => {
    modifiers.push(addModifier(modifier));
  });
  return factory.createParameterDeclaration(
    undefined,
    modifiers,
    undefined,
    factory.createIdentifier(parameterInfo.name),
    undefined,
    factory.createTypeReferenceNode(
      factory.createIdentifier(parameterInfo.type),
      undefined,
    ),
    undefined,
  );
}

// export function addMethodDeclaration(methodInfo: InputMethodDeclaration) {
//   return factory.createMethodDeclaration(
//     undefined,
//     [factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
//     undefined,
//     factory.createIdentifier(methodInfo.name),
//     undefined,
//     undefined,
//     [],
//     factory.createTypeReferenceNode(factory.createIdentifier('Promise'), [
//       factory.createArrayTypeNode(
//         factory.createTypeReferenceNode(
//           factory.createIdentifier('Task'),
//           undefined,
//         ),
//       ),
//     ]),
//     factory.createBlock(
//       [
//         factory.createReturnStatement(
//           factory.createCallExpression(
//             factory.createPropertyAccessExpression(
//               factory.createPropertyAccessExpression(
//                 factory.createThis(),
//                 factory.createIdentifier('taskRepository'),
//               ),
//               factory.createIdentifier('find'),
//             ),
//             undefined,
//             [factory.createObjectLiteralExpression([], false)],
//           ),
//         ),
//       ],
//       true,
//     ),
//   );
// }

// factory.createMethodDeclaration(
//   undefined,
//   [factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
//   undefined,
//   factory.createIdentifier('getTaskById'),
//   undefined,
//   undefined,
//   [
//     factory.createParameterDeclaration(
//       undefined,
//       undefined,
//       undefined,
//       factory.createIdentifier('id'),
//       undefined,
//       factory.createTypeReferenceNode(
//         factory.createIdentifier('uuid'),
//         undefined,
//       ),
//       undefined,
//     ),
//   ],
//   factory.createTypeReferenceNode(factory.createIdentifier('Promise'), [
//     factory.createTypeReferenceNode(
//       factory.createIdentifier('Task'),
//       undefined,
//     ),
//   ]),
//   factory.createBlock(
//     [
//       factory.createReturnStatement(
//         factory.createAwaitExpression(
//           factory.createCallExpression(
//             factory.createPropertyAccessExpression(
//               factory.createPropertyAccessExpression(
//                 factory.createThis(),
//                 factory.createIdentifier('taskRepository'),
//               ),
//               factory.createIdentifier('findOne'),
//             ),
//             undefined,
//             [
//               factory.createObjectLiteralExpression(
//                 [
//                   factory.createPropertyAssignment(
//                     factory.createIdentifier('id'),
//                     factory.createIdentifier('id'),
//                   ),
//                 ],
//                 false,
//               ),
//             ],
//           ),
//         ),
//       ),
//     ],
//     true,
//   ),
// );
