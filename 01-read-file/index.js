const fs = require('fs');
const path = require('path');
let fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
readStream.on('data', (chunk) => {
  console.log(chunk);
});