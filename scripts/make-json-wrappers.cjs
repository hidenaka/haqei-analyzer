'use strict';

const fs = require('fs');
const path = require('path');

function safeReadJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (_) { return null; }
}

function writeWrapper(outPath, varName, obj) {
  const header = `// Auto-generated wrapper. Do not edit manually.\n`;
  const code = `${header}window.${varName} = ${JSON.stringify(obj || {}, null, 2)};\n`;
  fs.writeFileSync(outPath, code, 'utf8');
}

function main() {
  const base = path.resolve(__dirname, '..', 'public', 'data');
  const n1 = safeReadJSON(path.join(base, 'narratives.v1.json')) || {};
  const n2 = safeReadJSON(path.join(base, 'narratives_chain.v1.json')) || {};
  writeWrapper(path.join(base, 'narratives.v1.js'), '__NARRATIVES__', n1);
  writeWrapper(path.join(base, 'narratives_chain.v1.js'), '__CHAIN_NARRATIVES__', n2);
  console.log('Wrote wrappers:', 'narratives.v1.js', 'narratives_chain.v1.js');
}

if (require.main === module) main();

