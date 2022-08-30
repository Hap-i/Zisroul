import { keywordType } from './../../../util/ast-enums';
import { astFilePrinter } from '../../../util/ast-printer';
import {
  addClass,
  addImport,
  addPropertyDeclaration,
} from './../../../util/ast';
import {
  InputImport,
  InputPropertyDeclaration,
} from './../../../util/custom-types';

export function createDto(
  dtoName: string,
  importsInfo: InputImport[],
  propertyData: InputPropertyDeclaration[],
) {
  const nodes = [];
  importsInfo.forEach((importInfo) => {
    nodes.push(
      addImport(
        importInfo.importItems,
        importInfo.importFrom,
        importInfo.defaultImport,
      ),
    );
  });
  const members = [];
  propertyData.forEach((property) => {
    members.push(addPropertyDeclaration(property));
  });
  nodes.push(addClass(undefined, dtoName, members));
  return nodes;
}

/* Example --

const propertyData: InputPropertyDeclaration[] = [
  {
    name: 'title',
    type: keywordType.STRING,
    decorators: [
      {
        name: 'IsNotEmpty',
        arguments: [],
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
    importItems: ['IsNotEmpty'],
    importFrom: 'class-validator',
    defaultImport: undefined,
  },
];
const nodes = createDto('CreateTaskDto', importsInfo, propertyData);
astFilePrinter(nodes); */
