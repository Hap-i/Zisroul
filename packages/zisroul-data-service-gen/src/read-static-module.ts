import * as fs from 'fs';
import * as normalize from 'normalize-path';
import * as fg from 'fast-glob';
import * as path from 'path';

export async function readStaticModule(destPath: string): Promise<any> {
  const sourcePath = normalize(path.join(__dirname, 'server', 'static'));
  const staticFilePath = await fg(`${sourcePath}/**/*`, {
    dot: true,
    ignore: ['**.js', '**.js.map', '**.d.ts', '**/node_modules/**'],
  });

  const modules = await Promise.all(
    staticFilePath.map(async (path) => ({
      path: path.replace(sourcePath, destPath),
      code: await fs.promises.readFile(path, 'utf-8'),
    })),
  );
  console.log(modules[0]);
}

/* readStaticModule(normalize(path.join(__dirname, '..', '..', 'generated'))); */
