import { factory } from 'typescript';
import * as ts from 'typescript';
import { InputArguments } from '../../../util/custom-types';
// import { keywordType } from './../../../util/ast-enums';
import { addDecorators, addPropertyAssignment } from '../../../util/ast';
import { keywordType } from 'util/ast-enums';

export const objectIdSchemaProperty = factory.createPropertyAssignment(
  factory.createIdentifier('type'),
  factory.createPropertyAccessExpression(
    factory.createPropertyAccessExpression(
      factory.createPropertyAccessExpression(
        factory.createIdentifier('mongoose'),
        factory.createIdentifier('Schema'),
      ),
      factory.createIdentifier('Types'),
    ),
    factory.createIdentifier('ObjectId'),
  ),
);

// export function addSchemaProperty(
//   propertyName: string,
//   propertyType: string | keywordType,
//   schemaProperties: InputArguments[],
// ): ts.PropertyDeclaration {
//   const properties = [];
//   schemaProperties.forEach((property) => {
//     if (property.name === 'ObjectId') properties.push(objectIdSchemaProperty);
//     else properties.push(addPropertyAssignment(property.name, property.type));
//   });

//   const decorators = [addDecorators('Prop', properties)];
//   return factory.createPropertyDeclaration(
//     decorators,
//     undefined,
//     factory.createIdentifier(propertyName),
//     undefined,
//     typeof propertyType === 'string'
//       ? factory.createTypeReferenceNode(
//           factory.createIdentifier(propertyType),
//           undefined,
//         )
//       : factory.createKeywordTypeNode(
//           propertyType as unknown as ts.KeywordTypeSyntaxKind,
//         ),
//     undefined,
//   );
// }

export function addDocumentExport(modelName: string): ts.TypeAliasDeclaration {
  return factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(`${modelName}Document`),
    undefined,
    factory.createIntersectionTypeNode([
      factory.createTypeReferenceNode(
        factory.createIdentifier(modelName),
        undefined,
      ),
      factory.createTypeReferenceNode(
        factory.createIdentifier('Document'),
        undefined,
      ),
    ]),
  );
}

export function addSchemaExport(modelName: string): ts.VariableStatement {
  return factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(`${modelName}Schema`),
          undefined,
          undefined,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('SchemaFactory'),
              factory.createIdentifier('createForClass'),
            ),
            undefined,
            [factory.createIdentifier(modelName)],
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
}
