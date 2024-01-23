const fs = require('fs/promises');
const path = require('path');
const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fs.mkdir(destDir, { recursive: true });
  const srcFiles = await fs.readdir(srcDir);
  const destFiles = await fs.readdir(destDir);
  const filesToRemove = destFiles.filter(file => !srcFiles.includes(file));
  await Promise.all(filesToRemove.map(file => fs.unlink(path.join(destDir, file))));
  await Promise.all(srcFiles.map(async file => {
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