import { astFilePrinter } from '../../../util/ast-printer';
import { keywordType } from '../../../util/ast-enums';
import {
  addClass,
  addDecorators,
  addImport,
  addPropertyDeclaration,
} from '../../../util/ast';
import {
  InputArguments,
  InputDecorator,
  InputImport,
  InputPropertyDeclaration,
} from '../../../util/custom-types';
import { addDocumentExport, addSchemaExport } from './ast-schema';

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
  importsInfo: InputImport[],
  propertyData: InputPropertyDeclaration[],
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
  const schemaBasePropertyArgument: InputArguments[] = [
    {
      name: 'timestamp',
      type: true,
    },
  ];
  const decoratorInfo: InputDecorator = {
    name: 'Schema',
    arguments: schemaBasePropertyArgument,
  };
  const modelDecorators = [addDecorators(decoratorInfo)];
  const members = [];

  propertyData.forEach((property) => {
    members.push(addPropertyDeclaration(property));
  });
  nodes.push(addClass(modelDecorators, modelName, members));
  nodes.push(addDocumentExport(modelName));
  nodes.push(addSchemaExport(modelName));
  return nodes;
}

/* Example -- 

const propertyData: InputPropertyDeclaration[] = [
  {
    name: 'title',
    type: keywordType.STRING,
    decorators: [
      {
        name: 'Prop',
        arguments: [
          {
            name: 'required',
            type: true,
          },
        ],
      },
      {
        name: 'ApiProperty',
        arguments: [],
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
const nodes = createSchmea('Account', importsInfo, propertyData);

astFilePrinter(nodes); */
