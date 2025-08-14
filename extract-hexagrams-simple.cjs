const fs = require('fs');

// Read H384 database
const content = fs.readFileSync('/Users/hideakimacbookair/Desktop/haqei-analyzer/public/assets/H384H64database.js', 'utf8');

// Extract all hexagram numbers and names using regex
const hexagramMatches = content.matchAll(/卦番号': (\d+), '卦名': '([^']+)'/g);

const hexagrams = {};
for (const match of hexagramMatches) {
  const number = parseInt(match[1]);
  const name = match[2];
  
  if (!hexagrams[number]) {
    hexagrams[number] = {
      number,
      name
    };
  }
}

// Sort by number
const sortedHexagrams = Object.values(hexagrams).sort((a, b) => a.number - b.number);

console.log('Total hexagrams found:', sortedHexagrams.length);
console.log('\n=== All 64 Hexagrams ===');
sortedHexagrams.forEach(h => {
  console.log(`${h.number}: ${h.name}`);
});

// Check if we have all 64
if (sortedHexagrams.length === 64) {
  console.log('\n✅ All 64 hexagrams found!');
} else {
  console.log(`\n⚠️ Only ${sortedHexagrams.length} hexagrams found, expected 64`);
}

// Generate data for expansion
console.log('\n=== Hexagrams that need to be added to kingwen-mapping.json ===');
const currentHexagrams = [1, 2, 11, 12, 63, 64]; // Currently in mapping
const needToAdd = sortedHexagrams.filter(h => !currentHexagrams.includes(h.number));

console.log(`Need to add ${needToAdd.length} hexagrams:`);
needToAdd.slice(0, 10).forEach(h => {
  console.log(`  ${h.number}: ${h.name}`);
});

if (needToAdd.length > 10) {
  console.log(`  ... and ${needToAdd.length - 10} more`);
}