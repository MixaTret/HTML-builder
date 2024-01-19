const fs = require('fs/promises');
const path = require('path');
const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fs.mkdir(destDir, { recursive: true });
  const files = await fs.readdir(srcDir);
  await Promise.all(files.map(async file => {
    let srcPath = path.join(srcDir, file);
    let destPath = path.join(destDir, file);
    let stat = await fs.stat(srcPath);

    if (stat.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.writeFile(destPath, await fs.readFile(srcPath));
    }
  }));
  console.log(`Successfully copied the contents from \n${srcDir} \nto \n${destDir}`);
}

copyDir();