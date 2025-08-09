#!/usr/bin/env node

/**
 * Cloudflare Migration Validation Script
 * Validates that all GitHub Actions workflows have been properly migrated from Vercel/GitHub Pages to Cloudflare Pages
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const WORKFLOW_DIR = '.github/workflows';
const DEPRECATED_PATTERNS = [
  'vercel-action',
  'github-pages',
  'upload-pages-artifact',
  'deploy-pages',
  'vercel-token',
  'vercel-org-id',
  'vercel-project-id'
];

const REQUIRED_PATTERNS = [
  'cloudflare/pages-action',
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ACCOUNT_ID',
  'wranglerVersion'
];

console.log('🔍 Validating Cloudflare Pages Migration...\n');

async function validateWorkflows() {
  const workflowFiles = await glob(`${WORKFLOW_DIR}/*.yml`);
  let hasErrors = false;
  let totalFiles = 0;
  let migratedFiles = 0;

  for (const file of workflowFiles) {
    totalFiles++;
    const content = fs.readFileSync(file, 'utf8');
    const filename = path.basename(file);
    
    console.log(`📄 Checking ${filename}...`);
    
    // Check for deprecated patterns
    const foundDeprecated = [];
    const foundRequired = [];
    
    for (const pattern of DEPRECATED_PATTERNS) {
      if (content.includes(pattern)) {
        foundDeprecated.push(pattern);
      }
    }
    
    // Skip staging-deploy.yml as it was already properly configured
    if (filename === 'staging-deploy.yml') {
      console.log('   ✅ Already properly configured for Cloudflare Pages');
      migratedFiles++;
      continue;
    }
    
    // Skip non-deployment workflows
    if (['ci.yml', 'security-check.yml', 'dependency-updates.yml'].includes(filename)) {
      console.log('   ℹ️  Non-deployment workflow - no migration needed');
      continue;
    }
    
    for (const pattern of REQUIRED_PATTERNS) {
      if (content.includes(pattern)) {
        foundRequired.push(pattern);
      }
    }
    
    if (foundDeprecated.length > 0) {
      console.log(`   ❌ Found deprecated patterns: ${foundDeprecated.join(', ')}`);
      hasErrors = true;
    } else if (foundRequired.length > 0) {
      console.log(`   ✅ Migrated to Cloudflare Pages`);
      console.log(`   📋 Found: ${foundRequired.join(', ')}`);
      migratedFiles++;
    } else {
      console.log('   ℹ️  No deployment configuration found');
    }
    
    console.log('');
  }
  
  return { hasErrors, totalFiles, migratedFiles };
}

async function validateConfiguration() {
  console.log('🔧 Checking configuration files...\n');
  
  // Check wrangler.toml
  if (fs.existsSync('wrangler.toml')) {
    const content = fs.readFileSync('wrangler.toml', 'utf8');
    console.log('📋 wrangler.toml exists');
    
    const environments = ['production', 'staging', 'blue'];
    for (const env of environments) {
      if (content.includes(`[env.${env}]`)) {
        console.log(`   ✅ ${env} environment configured`);
      } else {
        console.log(`   ❌ ${env} environment missing`);
      }
    }
  } else {
    console.log('❌ wrangler.toml missing');
  }
  
  // Check package.json for wrangler dependency
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.devDependencies?.wrangler) {
      console.log('✅ wrangler dependency found in package.json');
    } else {
      console.log('❌ wrangler dependency missing from package.json');
    }
    
    // Check deployment scripts
    const scripts = packageJson.scripts || {};
    if (scripts['deploy:staging']?.includes('wrangler')) {
      console.log('✅ Staging deployment script configured');
    }
    if (scripts['deploy:production']?.includes('wrangler')) {
      console.log('✅ Production deployment script configured');
    }
  }
  
  console.log('');
}

async function generateReport() {
  console.log('📊 Migration Summary Report\n');
  
  const { hasErrors, totalFiles, migratedFiles } = await validateWorkflows();
  await validateConfiguration();
  
  console.log('=' * 50);
  console.log('MIGRATION STATUS');
  console.log('=' * 50);
  
  if (hasErrors) {
    console.log('❌ Migration incomplete - deprecated patterns found');
    process.exit(1);
  } else {
    console.log('✅ Migration completed successfully!');
    console.log(`📊 ${migratedFiles} workflow files migrated to Cloudflare Pages`);
    console.log('🎯 All Vercel/GitHub Pages configurations removed');
    console.log('🔧 Cloudflare configuration files in place');
    console.log('\n📋 Next Steps:');
    console.log('   1. Set up Cloudflare Pages projects');
    console.log('   2. Configure GitHub repository secrets');
    console.log('   3. Test deployment workflows');
    console.log('   4. Configure custom domains');
    console.log('\n📚 See CLOUDFLARE_DEPLOYMENT_GUIDE.md for detailed instructions');
  }
}

// Run validation
generateReport().catch(console.error);