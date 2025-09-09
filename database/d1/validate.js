// D1 Database Validation Script
// Validates schema and data integrity for HaQei Analyzer D1 database

async function validateD1Database() {
  try {
    console.log('🔍 D1 Database Validation Starting...');
    console.log('=' .repeat(50));
    
    // Get D1 database binding
    const db = process.env.DB || DB;
    
    // Test 1: Check if tables exist
    console.log('\n📋 Test 1: Table Existence Check');
    const tables = await db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all();
    const expectedTables = ['trigrams', 'hexagrams', 'lines', 'special_yao', 'hexagram_relationships'];
    
    expectedTables.forEach(table => {
      const exists = tables.results.find(t => t.name === table);
      console.log(`  ${exists ? '✅' : '❌'} Table '${table}': ${exists ? 'EXISTS' : 'MISSING'}`);
    });
    
    // Test 2: Check data counts
    console.log('\n📊 Test 2: Data Count Verification');
    const trigramCount = await db.prepare('SELECT COUNT(*) as count FROM trigrams').first();
    const hexagramCount = await db.prepare('SELECT COUNT(*) as count FROM hexagrams').first();
    const lineCount = await db.prepare('SELECT COUNT(*) as count FROM lines').first();
    const specialYaoCount = await db.prepare('SELECT COUNT(*) as count FROM special_yao').first();
    
    console.log(`  📈 Trigrams: ${trigramCount.count}/8 ${trigramCount.count === 8 ? '✅' : '⚠️'}`);
    console.log(`  📈 Hexagrams: ${hexagramCount.count}/64 ${hexagramCount.count >= 5 ? '✅' : '⚠️'} (sample data)`);
    console.log(`  📈 Lines: ${lineCount.count}/384 ${lineCount.count >= 6 ? '✅' : '⚠️'} (sample data)`);
    console.log(`  📈 Special Yao: ${specialYaoCount.count} ${specialYaoCount.count >= 1 ? '✅' : '⚠️'}`);
    
    // Test 3: Check for orphaned lines
    console.log('\n🔗 Test 3: Data Integrity Check');
    const orphanedLines = await db.prepare(
      'SELECT COUNT(*) as count FROM lines WHERE hexagram_id NOT IN (SELECT id FROM hexagrams)'
    ).first();
    
    console.log(`  🔍 Orphaned lines: ${orphanedLines.count} ${orphanedLines.count === 0 ? '✅' : '❌'}`);
    
    // Test 4: Check trigram relationships
    console.log('\n🔗 Test 4: Trigram Relationship Check');
    const invalidTrigrams = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM hexagrams h 
      LEFT JOIN trigrams t1 ON h.upper_trigram_id = t1.id 
      LEFT JOIN trigrams t2 ON h.lower_trigram_id = t2.id 
      WHERE t1.id IS NULL OR t2.id IS NULL
    `).first();
    
    console.log(`  🔍 Invalid trigram refs: ${invalidTrigrams.count} ${invalidTrigrams.count === 0 ? '✅' : '❌'}`);
    
    // Test 5: Performance test
    console.log('\n⚡ Test 5: Query Performance Test');
    const start = performance.now();
    const sampleQuery = await db.prepare(`
      SELECT h.name, h.catchphrase, l.name as line_name, l.text, l.shin_guidance 
      FROM hexagrams h 
      JOIN lines l ON h.id = l.hexagram_id 
      WHERE h.id = 1
      ORDER BY l.position
    `).all();
    const end = performance.now();
    const duration = end - start;
    
    console.log(`  ⏱️  Query time: ${duration.toFixed(2)}ms ${duration < 100 ? '✅' : '⚠️'}`);
    console.log(`  📝 Sample results: ${sampleQuery.results.length} lines`);
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎉 D1 Database Validation Complete!');
    return true;
  } catch (error) {
    console.error('❌ D1 database validation failed:', error);
    return false;
  }
}

// Export for use in Cloudflare Workers
export { validateD1Database };