const fs = require('fs').promises;
const path = require('path');

async function recursiveCopy(source, target) {
  const entries = await fs.readdir(source);
  for (const entry of entries) {
    const sourcePath = path.join(source, entry);
    const targetPath = path.join(target, entry);
    const stats = await fs.lstat(sourcePath);

    if (stats.isDirectory()) {
      await fs.mkdir(targetPath, { recursive: true });
      await recursiveCopy(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

async function buildWebPage() {
  const distFolder = path.join(__dirname, 'project-dist');
  const templatePath = path.join(__dirname, 'template.html');
  const stylesFolder = path.join(__dirname, 'styles');
  const assetsFolder = path.join(__dirname, 'assets');
  const distAssetsFolder = path.join(distFolder, 'assets');
  const indexPath = path.join(distFolder, 'index.html');
  const stylesPath = path.join(distFolder, 'style.css');

  try {
    await fs.mkdir(distFolder);
    let templateContent = await fs.readFile(templatePath, 'utf-8');
    const tagRegex = /\{\{(\w+)\}\}/g;
    const tagMatches = templateContent.match(tagRegex);

    if (tagMatches) {
      for (const tag of tagMatches) {
        const componentName = tag.substring(2, tag.length - 2);
        const componentPath = path.join(__dirname, 'components', `${componentName}.html`);
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        templateContent = templateContent.replace(tag, componentContent);
      }
    }
    await fs.writeFile(indexPath, templateContent);

    const styles = await Promise.all(
      (await fs.readdir(stylesFolder))
        .filter(file => file.endsWith('.css'))
        .map(file => fs.readFile(path.join(stylesFolder, file), 'utf-8'))
    );
    await fs.writeFile(stylesPath, styles.join('\n'));
    await recursiveCopy(assetsFolder, distAssetsFolder);
    console.log('Build completed successfully! The generated web page can be found in the "project-dist" folder.');
  } catch (error) {
    console.error('Error during build:', error.message);
  }
}

buildWebPage();