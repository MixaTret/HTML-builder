const fs = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true })
  .then(files => {
    console.log('\nFiles in secret-folder:');
    return Promise.all(files.map(file => {
      if (file.isFile()) {
        let filePath = path.join(folderPath, file.name);
        return fs.stat(filePath)
          .then(fileStat => {
            let fileName = path.parse(filePath).name;
            let fileExtension = path.parse(filePath).ext.slice(1);
            let fileSize = Math.floor(fileStat.size / 1024 * 1000) / 1000 + 'kb';
            console.log(`${fileName} - ${fileExtension} - ${fileSize}`);
          });
      }
    }));
  });