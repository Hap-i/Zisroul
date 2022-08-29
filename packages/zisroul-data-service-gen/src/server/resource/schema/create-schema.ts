// import { astFilePrinter } from '../../../util/ast-printer';
import {
  addClass,
  addDecorators,
  addImport,
  addPropertyAssignment,
} from '../../../util/ast';
import { InputImport, InputSchemaInfo } from '../../../util/custom-types';
import {
  addDocumentExport,
  addSchemaExport,
  addSchemaProperty,
} from './ast-schema';

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

export function createSchmea(
  modelName: string,
  fieldsInfo: InputSchemaInfo[],
  importsInfo: InputImport[],
) {
  const nodes = [];
  DEFAULT_IMPORTS.forEach((item) => {
    const node = addImport(
      item.importItems,
      item.importFrom,
      item.defaultImport,
    );
    nodes.push(node);
  });

  importsInfo.forEach((importInfo) => {
    nodes.push(
      addImport(
        importInfo.importItems,
        importInfo.importFrom,
        importInfo.defaultImport,
      ),
    );
  });

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

/* Example --

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
const importsInfo = [
  {
    importItems: ['User'],
    importFrom: 'src/user/schema.ts',
    defaultImport: undefined,
  },
];
const nodes = createSchmea('Account', fieldsInfo, importsInfo);

astFilePrinter(nodes); */
