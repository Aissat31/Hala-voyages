import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const filesToCopy = [
  'index.html',
  'style.css',
  'script.js',
  'logo-hala-travel.jpg',
  '_headers',
  '_redirects'
];

for (const file of filesToCopy) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(distDir, file));
    console.log(`Copied ${file} -> dist/${file}`);
  }
}

console.log('Build completed successfully.');
