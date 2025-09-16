'use strict';

const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'public', 'data', 'narratives_chain.v1.json');
const db = JSON.parse(fs.readFileSync(file, 'utf8'));

const empty = Object.entries(db).filter(([k,v]) => !v.chain_long || v.chain_long === '');
console.log('Empty entries:', empty.length);
console.log('Total entries:', Object.keys(db).length);

if (empty.length > 0) {
  console.log('\nFirst 10 empty entries:');
  empty.slice(0, 10).forEach(([key]) => {
    console.log(' -', key);
  });
}