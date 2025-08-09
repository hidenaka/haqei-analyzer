const fs = require('fs');

// H384_DATABASE.jsの内容を読み込む
const content = fs.readFileSync('./public/js/core/H384_DATABASE.js', 'utf8');

// H384_DATABASEオブジェクトを探す
const databaseMatch = content.match(/const H384_DATABASE = \{([\s\S]*?)\};/);

if (!databaseMatch) {
  console.error('❌ H384_DATABASE not found');
  process.exit(1);
}

// データベースを評価
eval('const H384_DATABASE = {' + databaseMatch[1] + '};');

// yao_textsをチャンクに分割
const yaoTexts = H384_DATABASE.yao_texts;
const yaoKeys = Object.keys(yaoTexts);
const chunkSize = Math.ceil(yaoKeys.length / 10);

console.log('📊 Total yao texts:', yaoKeys.length);
console.log('📦 Chunk size:', chunkSize);

// yao_textsをチャンクに分割
for (let i = 0; i < yaoKeys.length; i += chunkSize) {
  const chunkKeys = yaoKeys.slice(i, i + chunkSize);
  const chunkData = {};
  
  chunkKeys.forEach(key => {
    chunkData[key] = yaoTexts[key];
  });
  
  const chunkIndex = Math.floor(i / chunkSize);
  const chunkContent = 'window.H384_YAO_CHUNK_' + chunkIndex + ' = ' + JSON.stringify(chunkData, null, 2) + ';';
  
  fs.writeFileSync(
    'public/js/data/chunks/h384_yao_chunk_' + chunkIndex + '.js',
    chunkContent
  );
  
  console.log('✅ Created yao chunk', chunkIndex, 'with', chunkKeys.length, 'texts');
}

// hexagram_structureも分割
const hexagramStructure = H384_DATABASE.hexagram_structure;
const hexKeys = Object.keys(hexagramStructure);
const hexChunkSize = Math.ceil(hexKeys.length / 5);

for (let i = 0; i < hexKeys.length; i += hexChunkSize) {
  const chunkKeys = hexKeys.slice(i, i + hexChunkSize);
  const chunkData = {};
  
  chunkKeys.forEach(key => {
    chunkData[key] = hexagramStructure[key];
  });
  
  const chunkIndex = Math.floor(i / hexChunkSize);
  const chunkContent = 'window.H384_STRUCTURE_CHUNK_' + chunkIndex + ' = ' + JSON.stringify(chunkData, null, 2) + ';';
  
  fs.writeFileSync(
    'public/js/data/chunks/h384_structure_chunk_' + chunkIndex + '.js',
    chunkContent
  );
  
  console.log('✅ Created structure chunk', chunkIndex, 'with', chunkKeys.length, 'hexagrams');
}

console.log('✅ H384_DATABASE.js split into chunks successfully');