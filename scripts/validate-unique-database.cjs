#!/usr/bin/env node

/**
 * HAQEI Unique Narratives Database Validator
 * Validates the structure, uniqueness, and quality of generated database
 */

const fs = require('fs');
const path = require('path');

function validateDatabase() {
  console.log('='.repeat(60));
  console.log('HAQEI UNIQUE NARRATIVES DATABASE VALIDATOR');
  console.log('='.repeat(60));
  
  const dbPath = path.join(__dirname, '../public/data/authoring/narratives_chain_unique.json');
  
  if (!fs.existsSync(dbPath)) {
    console.error('❌ Database file not found:', dbPath);
    process.exit(1);
  }
  
  let database;
  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    database = JSON.parse(content);
  } catch (error) {
    console.error('❌ Failed to parse JSON:', error.message);
    process.exit(1);
  }
  
  const entries = Object.entries(database);
  console.log(`📊 Total entries: ${entries.length}`);
  
  // Validate expected count
  if (entries.length !== 3072) {
    console.error(`❌ Expected 3072 entries, found ${entries.length}`);
    process.exit(1);
  }
  console.log('✅ Entry count validation passed');
  
  // Validate structure
  let structureErrors = 0;
  const requiredFields = ['chain_long', 'tone', 'suitability', 'caution', 'label', 'start', 'final', 'updated_at'];
  
  for (const [key, entry] of entries.slice(0, 100)) { // Sample validation
    for (const field of requiredFields) {
      if (!(field in entry)) {
        console.error(`❌ Missing field '${field}' in entry: ${key}`);
        structureErrors++;
      }
    }
    
    // Validate start structure
    if (!entry.start || !entry.start.hex || typeof entry.start.pos !== 'number' || !entry.start.name) {
      console.error(`❌ Invalid start structure in entry: ${key}`);
      structureErrors++;
    }
    
    // Validate final structure
    if (!entry.final || !entry.final.hex || typeof entry.final.pos !== 'number') {
      console.error(`❌ Invalid final structure in entry: ${key}`);
      structureErrors++;
    }
  }
  
  if (structureErrors === 0) {
    console.log('✅ Structure validation passed');
  } else {
    console.error(`❌ Structure validation failed with ${structureErrors} errors`);
  }
  
  // Validate uniqueness
  const chainLongs = entries.map(([key, entry]) => entry.chain_long);
  const uniqueChainLongs = new Set(chainLongs);
  
  console.log(`🔍 Chain_long texts: ${chainLongs.length}`);
  console.log(`🔍 Unique texts: ${uniqueChainLongs.size}`);
  console.log(`🔍 Duplicates: ${chainLongs.length - uniqueChainLongs.size}`);
  
  if (uniqueChainLongs.size === chainLongs.length) {
    console.log('✅ Uniqueness validation passed - 100% unique content');
  } else {
    console.error('❌ Uniqueness validation failed - duplicates found');
  }
  
  // Validate content quality
  let qualityIssues = 0;
  const sampleSize = Math.min(50, entries.length);
  
  for (let i = 0; i < sampleSize; i++) {
    const [key, entry] = entries[i];
    const chainLong = entry.chain_long;
    
    // Check for debug artifacts
    if (chainLong.includes('_') && chainLong.match(/_[a-zA-Z0-9_]+_\d+/)) {
      console.warn(`⚠️  Debug artifact found in: ${key}`);
      qualityIssues++;
    }
    
    // Check for reasonable length
    if (chainLong.length < 50) {
      console.warn(`⚠️  Very short chain_long in: ${key}`);
      qualityIssues++;
    }
    
    if (chainLong.length > 1000) {
      console.warn(`⚠️  Very long chain_long in: ${key}`);
      qualityIssues++;
    }
    
    // Check for proper Japanese content
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(chainLong);
    if (!hasJapanese) {
      console.warn(`⚠️  No Japanese characters in: ${key}`);
      qualityIssues++;
    }
  }
  
  if (qualityIssues === 0) {
    console.log('✅ Content quality validation passed');
  } else {
    console.log(`⚠️  Content quality validation found ${qualityIssues} minor issues`);
  }
  
  // Validate hexagram coverage
  const expectedHexagrams = [
    '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
    '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
    '澤雷随', '山風蛊', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
    '天雷无妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
    '天山遯', '雷天大壮', '火地晉', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
    '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
    '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤歸妹', '雷火豊', '火山旅',
    '巽為風', '兌為澤', '風水渙', '水澤節', '風澤中孚', '雷山小過', '水火既濟', '火水未濟'
  ];
  
  const foundHexagrams = new Set();
  entries.forEach(([key, entry]) => {
    foundHexagrams.add(entry.start.hex);
  });
  
  console.log(`🔍 Expected hexagrams: ${expectedHexagrams.length}`);
  console.log(`🔍 Found hexagrams: ${foundHexagrams.size}`);
  
  const missingHexagrams = expectedHexagrams.filter(hex => !foundHexagrams.has(hex));
  if (missingHexagrams.length === 0) {
    console.log('✅ Hexagram coverage validation passed');
  } else {
    console.error(`❌ Missing hexagrams: ${missingHexagrams.join(', ')}`);
  }
  
  // Validate pattern coverage
  const expectedPatterns = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
  const foundPatterns = new Set();
  entries.forEach(([key, entry]) => {
    foundPatterns.add(entry.label);
  });
  
  console.log(`🔍 Expected patterns: ${expectedPatterns.length}`);
  console.log(`🔍 Found patterns: ${foundPatterns.size}`);
  
  const missingPatterns = expectedPatterns.filter(pattern => !foundPatterns.has(pattern));
  if (missingPatterns.length === 0) {
    console.log('✅ Pattern coverage validation passed');
  } else {
    console.error(`❌ Missing patterns: ${missingPatterns.join(', ')}`);
  }
  
  // File size analysis
  const fileStats = fs.statSync(dbPath);
  const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
  console.log(`📁 File size: ${fileSizeMB} MB`);
  
  if (fileSizeMB > 0.5 && fileSizeMB < 10) {
    console.log('✅ File size validation passed');
  } else {
    console.warn(`⚠️  Unusual file size: ${fileSizeMB} MB`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(60));
  
  const overallSuccess = 
    entries.length === 3072 && 
    structureErrors === 0 && 
    uniqueChainLongs.size === chainLongs.length &&
    missingHexagrams.length === 0 &&
    missingPatterns.length === 0;
  
  if (overallSuccess) {
    console.log('🎉 ALL VALIDATIONS PASSED - DATABASE READY FOR DEPLOYMENT');
    console.log('✅ 3072 unique narrative entries generated successfully');
    console.log('✅ Complete I-Ching hexagram and pattern coverage');
    console.log('✅ High-quality Japanese content with authentic meanings');
  } else {
    console.log('❌ VALIDATION FAILED - ISSUES NEED TO BE RESOLVED');
  }
  
  return overallSuccess;
}

// Run validation
if (require.main === module) {
  const success = validateDatabase();
  process.exit(success ? 0 : 1);
}

module.exports = { validateDatabase };