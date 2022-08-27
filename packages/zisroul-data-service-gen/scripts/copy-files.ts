import * as fg from 'fast-glob';
import * as path from 'path';
import * as normalize from 'normalize-path';
import * as fs from 'fs';

const SOURCE_DIR = path.join(__dirname, '..', 'src', 'server', 'static');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'src', 'server', 'static');
const SOURCE_DIR_GLOB = normalize(path.join(SOURCE_DIR, '**'));

async function copyFiles() {
  const filePaths = await fg([SOURCE_DIR_GLOB], {
    dot: true,
    ignore: ['**/node_modules/**'],
  });

  await Promise.all(
    filePaths.map(async (filePath: string) => {
      const normalizedFilePath = path.normalize(filePath);
      const dest = normalizedFilePath.replace(SOURCE_DIR, DEST_DIR);
      await fs.promises.mkdir(path.dirname(dest), { recursive: true });
      await fs.promises.copyFile(normalizedFilePath, dest);
    }),
  );
}

copyFiles();
