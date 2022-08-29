import { keywordType } from './ast-enums';

export type Module = {
  path: string;
  code: string;
};

export type SchemaProperty = {
  name: string;
  type: string | boolean | undefined;
};

export type InputSchemaInfo = {
  fieldName: string;
  fieldType: string | keywordType;
  fieldProperties: SchemaProperty[];
};

export type InputImport = {
  importItems: string[];
  importFrom: string;
  defaultImport: string | undefined;
};
