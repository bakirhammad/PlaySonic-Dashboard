import { fileURLToPath } from "url";
import { dirname } from "path";
import fse from "fs-extra";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const topDir = __dirname;

fse.emptyDirSync(path.join(topDir, "public", "tinymce"));
fse.copySync(
  path.join(topDir, "node_modules", "tinymce"),
  path.join(topDir, "public", "tinymce"),
  { overwrite: true }
);
