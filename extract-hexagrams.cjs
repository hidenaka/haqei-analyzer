const fs = require('fs');

// Read H384 database
const content = fs.readFileSync('/Users/hideakimacbookair/Desktop/haqei-analyzer/public/assets/H384H64database.js', 'utf8');

// Extract hexagram data  
const dataMatch = content.match(/let H384_DATA = (\[.*?\]);/s);
if (!dataMatch) {
  console.error('Could not find H384_DATA');
  process.exit(1);
}

const hexagrams = {};

// Parse H384 data and extract unique hexagrams
const h384Data = JSON.parse(dataMatch[1]);
h384Data.forEach(entry => {
  const hexNum = entry['卦番号'];
  const hexName = entry['卦名'];
  
  if (!hexagrams[hexNum]) {
    hexagrams[hexNum] = {
      number: hexNum,
      name: hexName
    };
  }
});

// Sort by number and print
const sortedHexagrams = Object.values(hexagrams).sort((a, b) => a.number - b.number);
console.log('Total hexagrams found:', sortedHexagrams.length);

// Print all hexagram data for mapping generation
console.log('\n=== All 64 Hexagrams ===');
sortedHexagrams.forEach(h => {
  console.log(`${h.number}: ${h.name}`);
});

// Generate basic mapping template
const basicMapping = {};
sortedHexagrams.forEach(h => {
  basicMapping[h.number] = {
    name: h.name,
    lines: [0, 0, 0, 0, 0, 0], // Will be filled later
    trigrams: ["unknown", "unknown"] // Will be filled later
  };
});

console.log('\n=== Generated Basic Mapping Template ===');
console.log(JSON.stringify(basicMapping, null, 2));