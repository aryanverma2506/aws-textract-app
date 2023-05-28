import fs from "fs/promises";
import path from "path";

const sourceFolder = "./dist";
const destinationFolder = "./maps";

async function moveFiles(source: string, destination: string) {
  const files = await fs.readdir(source);

  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    const fileStat = await fs.stat(sourcePath);

    if (fileStat.isDirectory()) {
      await moveFiles(sourcePath, path.join(destination, file));
    } else if (path.extname(file) === ".map") {
      const directory = path.dirname(destinationPath);

      try {
        await fs.access(directory);
      } catch {
        await fs.mkdir(directory, { recursive: true });
      }

      try {
        await fs.unlink(destinationPath);
      } catch {}

      await fs.rename(sourcePath, destinationPath);
    }
  }
}

moveFiles(sourceFolder, destinationFolder);
