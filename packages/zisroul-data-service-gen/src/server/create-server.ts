import { readStaticModule } from 'read-static-module';
import { addImport } from 'util/ast';

async function createServer() {
  const modules = await readStaticModule('/');
}
