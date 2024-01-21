const fs = require('fs/promises');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
let bundlePath = path.join(__dirname, 'project-dist');
let bundleFile = path.join(bundlePath, 'bundle.css');

async function copyFiles(directoryPath, fileExtension) {
  const files = await fs.readdir(directoryPath);
  return files.filter(file => file.endsWith(fileExtension));
}

async function readFileContent(filePath) {
  return await fs.readFile(filePath, 'utf-8');
}

async function writeToFile(filePath, content) {
  await fs.writeFile(filePath, content, 'utf-8');
}

async function mergeStyles() {
  try {
    const cssFiles = await copyFiles(stylesFolderPath, '.css');
    let arrayOfStyles = [];
    for (const cssFile of cssFiles) {
      const filePath = path.join(stylesFolderPath, cssFile);
      arrayOfStyles.push(await readFileContent(filePath));
    }
    let combinedStyles = arrayOfStyles.join('\n');
    await writeToFile(bundleFile, combinedStyles);
    console.log('Styles successfully bundled and written to:', bundleFile);
  } catch (error) {
    console.error('Error merging styles:', error.message);
  }
}
mergeStyles();