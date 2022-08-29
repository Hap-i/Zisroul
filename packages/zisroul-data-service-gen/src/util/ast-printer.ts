import * as ts from 'typescript';

const node = ts.createSourceFile(
  'someFileName.ts',
  '',
  ts.ScriptTarget.Latest,
  /*setParentNodes*/ false,
  ts.ScriptKind.TS,
);

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
  omitTrailingSemicolon: false,
});

export function astFilePrinter(arr) {
  const sourceNode = ts.factory.updateSourceFile(
    node,
    ts.factory.createNodeArray(arr),
  );
  console.log(printer.printFile(sourceNode));
}
