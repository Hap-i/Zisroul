import { addImport } from 'util/ast';
import { InputImport } from 'util/custom-types';

export function createDto(importsInfo: InputImport[]) {
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
}
