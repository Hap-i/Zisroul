import { keywordType } from './ast-enums';

export type Module = {
  path: string;
  code: string;
};

export type InputArguments = {
  name: string;
  type: string | boolean | undefined;
};

export type InputSchemaInfo = {
  fieldName: string;
  fieldType: string | keywordType;
  fieldProperties: InputArguments[];
};

export type InputImport = {
  importItems: string[];
  importFrom: string;
  defaultImport: string | undefined;
};

export type InputDecorator = {
  name: string;
  arguments: InputArguments[] | [];
};

export type InputPropertyDeclaration = {
  decorators: InputDecorator[];
  name: string;
  type: string | keywordType;
};
