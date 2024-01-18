const fs = require('fs');
const path = require('path');
const readline = require('readline');
const filePath = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
console.log('Welcome! Enter text. Type "exit" or "ctrl + c" to terminate.');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    rl.close();
  }
  fileStream.write(input + '\n');
  console.log('The text has been written to the file. Enter more text:');
});

rl.on('SIGINT', () => {
  console.log('Goodbye!');
  rl.close();
  process.exit();
});

rl.on('close', () => {
  console.log('The work is done!');
  process.exit();
});