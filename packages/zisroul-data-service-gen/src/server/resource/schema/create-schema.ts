import { astFilePrinter } from '../../../util/ast-printer';
import {
  addClass,
  addDecorators,
  addImport,
  addPropertyAssignment,
} from '../../../util/ast';
import { InputSchemaInfo } from 'util/custom-types';
import {
  addDocumentExport,
  addSchemaExport,
  addSchemaProperty,
} from './ast-schema';
import ts from 'typescript';
import { keywordType } from '../../../util/ast-enums';

const DEFAULT_IMPORTS = [
  {
    importItems: ['Prop', 'Schema', 'SchemaFactory'],
    importFrom: '@nestjs/mongoose',
    defaultImport: undefined,
  },
  {
    importItems: ['Document'],
    importFrom: 'mongoose',
    defaultImport: 'mongoose',
  },
];

// schema export

export function createSchmea(modelName: string, fieldsInfo: InputSchemaInfo[]) {
  const nodes = [];
  DEFAULT_IMPORTS.forEach((item) => {
    const node = addImport(
      item.importItems,
      item.importFrom,
      item.defaultImport,
    );
    nodes.push(node);
  });
  //TODO: Depency imports

  const schemaBaseProperties = [addPropertyAssignment('timestamp', true)];
  const modelDecorators = [addDecorators('Schema', schemaBaseProperties)];
  const members = [];
  fieldsInfo.forEach((field) => {
    members.push(
      addSchemaProperty(
        field.fieldName,
        field.fieldType,
        field.fieldProperties,
      ),
    );
  });
  nodes.push(addClass(modelDecorators, modelName, members));
  nodes.push(addDocumentExport(modelName));
  nodes.push(addSchemaExport(modelName));
  return nodes;
}

const fieldsInfo = [
  {
    fieldName: 'name',
    fieldType: keywordType.BOOLEAN,
    fieldProperties: [
      {
        name: 'required',
        type: true,
      },
    ],
  },
];
const nodes = createSchmea('Account', fieldsInfo);

astFilePrinter(nodes);
