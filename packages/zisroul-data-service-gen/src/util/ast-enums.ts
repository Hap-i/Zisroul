import ts from 'typescript';

export enum keywordType {
  BOOLEAN = ts.SyntaxKind.BooleanKeyword,
  STRING = ts.SyntaxKind.StringKeyword,
  NUMBER = ts.SyntaxKind.NumberKeyword,
}
