const fs = require('fs');

// data_box.jsの内容を読み込む
const content = fs.readFileSync('./public/js/data/data_box.js', 'utf8');
const hexagramsMatch = content.match(/var hexagrams_master = \[([\s\S]*?)\];/);

if (!hexagramsMatch) {
  console.error('❌ hexagrams_master not found');
  process.exit(1);
}

// hexagrams配列を評価
eval('var hexagrams_master = [' + hexagramsMatch[1] + '];');

const chunkSize = Math.ceil(hexagrams_master.length / 10);
console.log('📊 Total hexagrams:', hexagrams_master.length);
console.log('📦 Chunk size:', chunkSize);

// チャンクに分割
for (let i = 0; i < hexagrams_master.length; i += chunkSize) {
  const chunkData = hexagrams_master.slice(i, i + chunkSize);
  const chunkIndex = Math.floor(i / chunkSize);
  
  const chunkContent = 'window.HEXAGRAMS_CHUNK_' + chunkIndex + ' = ' + JSON.stringify(chunkData, null, 2) + ';';
  
  fs.writeFileSync(
    'public/js/data/chunks/hexagrams_chunk_' + chunkIndex + '.js',
    chunkContent
  );
  
  console.log('✅ Created chunk', chunkIndex, 'with', chunkData.length, 'hexagrams');
}

console.log('✅ data_box.js split into chunks successfully');