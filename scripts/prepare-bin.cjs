const fs = require('node:fs');
const path = require('node:path');

const binPath = path.join(__dirname, '..', 'dist', 'main.js');
const shebang = '#!/usr/bin/env node\n';

const content = fs.readFileSync(binPath, 'utf8');
if (!content.startsWith(shebang)) {
  fs.writeFileSync(binPath, `${shebang}${content}`);
}

fs.chmodSync(binPath, 0o755);
