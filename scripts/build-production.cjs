#!/usr/bin/env node

/**
 * Simple Production Build Script for HAQEI Analyzer
 * Optimizes files for Cloudflare Pages deployment
 * Focus: Maintainability and Error Prevention
 */

const fs = require('fs').promises;
const path = require('path');
const { minify: minifyJS } = require('terser');
const CleanCSS = require('clean-css');
const htmlMinifier = require('html-minifier-terser');

// Build configuration
const config = {
  srcDir: path.join(__dirname, '..', 'public'),
  distDir: path.join(__dirname, '..', 'dist'),
  
  // Files to process
  htmlFiles: ['os_analyzer.html', 'future_simulator.html', 'index.html'],
  
  // Minification options (conservative for stability)
  jsMinifyOptions: {
    compress: {
      drop_console: false, // Keep console.log for debugging
      drop_debugger: true,
      pure_funcs: ['console.debug'],
      passes: 1
    },
    mangle: {
      safari10: true,
      keep_classnames: true,
      keep_fnames: true // Keep function names for error tracking
    },
    format: {
      comments: false
    }
  },
  
  cssMinifyOptions: {
    level: 1, // Safe optimizations only
    compatibility: 'ie11'
  },
  
  htmlMinifyOptions: {
    collapseWhitespace: true,
    conservativeCollapse: true, // Safer whitespace handling
    removeComments: true,
    minifyCSS: false, // We'll handle CSS separately
    minifyJS: false, // We'll handle JS separately
    removeAttributeQuotes: false, // Keep quotes for safety
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
  }
};

/**
 * Create dist directory
 */
async function createDistDir() {
  try {
    await fs.rm(config.distDir, { recursive: true, force: true });
    await fs.mkdir(config.distDir, { recursive: true });
    await fs.mkdir(path.join(config.distDir, 'js'), { recursive: true });
    await fs.mkdir(path.join(config.distDir, 'css'), { recursive: true });
    await fs.mkdir(path.join(config.distDir, 'assets'), { recursive: true });
    console.log('✓ Created dist directory structure');
  } catch (error) {
    console.error('✗ Error creating dist directory:', error);
    throw error;
  }
}

/**
 * Copy static assets
 */
async function copyAssets() {
  const assetDirs = ['images', 'fonts', 'data'];
  
  for (const dir of assetDirs) {
    const srcPath = path.join(config.srcDir, dir);
    const distPath = path.join(config.distDir, dir);
    
    try {
      await fs.access(srcPath);
      await copyDir(srcPath, distPath);
      console.log(`✓ Copied ${dir} directory`);
    } catch (error) {
      // Directory doesn't exist, skip
    }
  }
  
  // Copy other static files
  const staticFiles = ['favicon.ico', 'robots.txt', 'manifest.json'];
  for (const file of staticFiles) {
    try {
      const srcPath = path.join(config.srcDir, file);
      const distPath = path.join(config.distDir, file);
      await fs.copyFile(srcPath, distPath);
      console.log(`✓ Copied ${file}`);
    } catch (error) {
      // File doesn't exist, skip
    }
  }
}

/**
 * Copy directory recursively
 */
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Minify JavaScript files
 */
async function minifyJavaScript() {
  const jsDir = path.join(config.srcDir, 'js');
  
  try {
    await processJSDirectory(jsDir, path.join(config.distDir, 'js'));
    console.log('✓ Minified JavaScript files');
  } catch (error) {
    console.error('✗ Error minifying JavaScript:', error);
    throw error;
  }
}

/**
 * Process JavaScript directory recursively
 */
async function processJSDirectory(srcDir, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    
    if (entry.isDirectory()) {
      await processJSDirectory(srcPath, destPath);
    } else if (entry.name.endsWith('.js')) {
      try {
        const code = await fs.readFile(srcPath, 'utf8');
        const result = await minifyJS(code, config.jsMinifyOptions);
        
        if (result.error) {
          console.warn(`⚠ Warning: Could not minify ${entry.name}, copying original`);
          await fs.copyFile(srcPath, destPath);
        } else {
          await fs.writeFile(destPath, result.code);
        }
      } catch (error) {
        console.warn(`⚠ Warning: Error processing ${entry.name}, copying original`);
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
}

/**
 * Minify CSS files
 */
async function minifyCSS() {
  const cssDir = path.join(config.srcDir, 'css');
  const destDir = path.join(config.distDir, 'css');
  
  try {
    await fs.mkdir(destDir, { recursive: true });
    const files = await fs.readdir(cssDir);
    
    for (const file of files) {
      if (file.endsWith('.css')) {
        const srcPath = path.join(cssDir, file);
        const destPath = path.join(destDir, file);
        const css = await fs.readFile(srcPath, 'utf8');
        
        const minified = new CleanCSS(config.cssMinifyOptions).minify(css);
        
        if (minified.errors.length > 0) {
          console.warn(`⚠ Warning: Could not minify ${file}, copying original`);
          await fs.copyFile(srcPath, destPath);
        } else {
          await fs.writeFile(destPath, minified.styles);
        }
      }
    }
    
    console.log('✓ Minified CSS files');
  } catch (error) {
    console.error('✗ Error minifying CSS:', error);
    throw error;
  }
}

/**
 * Process HTML files
 */
async function processHTML() {
  for (const file of config.htmlFiles) {
    try {
      const srcPath = path.join(config.srcDir, file);
      const destPath = path.join(config.distDir, file);
      
      let html = await fs.readFile(srcPath, 'utf8');
      
      // Update paths for production
      html = html.replace(/\/public\//g, '/');
      html = html.replace(/\.\.\/public\//g, '/');
      
      // Update script and link paths
      html = html.replace(/src="js\//g, 'src="/js/');
      html = html.replace(/href="css\//g, 'href="/css/');
      
      // Minify HTML
      const minified = await htmlMinifier.minify(html, config.htmlMinifyOptions);
      
      await fs.writeFile(destPath, minified);
      console.log(`✓ Processed ${file}`);
    } catch (error) {
      console.warn(`⚠ Warning: Could not process ${file}`);
    }
  }
}

/**
 * Create _headers file for Cloudflare Pages
 */
async function createHeadersFile() {
  const headers = `/*
  Cache-Control: public, max-age=3600
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin

/js/*
  Cache-Control: public, max-age=31536000, immutable

/css/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=3600, must-revalidate`;
  
  await fs.writeFile(path.join(config.distDir, '_headers'), headers);
  console.log('✓ Created _headers file for Cloudflare Pages');
}

/**
 * Create _redirects file for Cloudflare Pages
 */
async function createRedirectsFile() {
  const redirects = `# Redirects for HAQEI Analyzer
/ /os_analyzer.html 200
/index.html /os_analyzer.html 301`;
  
  await fs.writeFile(path.join(config.distDir, '_redirects'), redirects);
  console.log('✓ Created _redirects file for Cloudflare Pages');
}

/**
 * Main build function
 */
async function build() {
  console.log('🚀 Starting production build for Cloudflare Pages...\n');
  
  try {
    // Check for required dependencies
    try {
      require('terser');
      require('clean-css');
      require('html-minifier-terser');
    } catch (error) {
      console.error('Missing dependencies. Please run: npm install terser clean-css html-minifier-terser');
      process.exit(1);
    }
    
    // Execute build steps
    await createDistDir();
    await copyAssets();
    await minifyJavaScript();
    await minifyCSS();
    await processHTML();
    await createHeadersFile();
    await createRedirectsFile();
    
    // Calculate build size
    const getDirSize = async (dir) => {
      let size = 0;
      const files = await fs.readdir(dir, { withFileTypes: true });
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
          size += await getDirSize(filePath);
        } else {
          const stats = await fs.stat(filePath);
          size += stats.size;
        }
      }
      return size;
    };
    
    const totalSize = await getDirSize(config.distDir);
    const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
    
    console.log('\n✅ Build completed successfully!');
    console.log(`📦 Total build size: ${sizeMB} MB`);
    console.log(`📁 Output directory: ${config.distDir}`);
    console.log('\n🚀 Ready for Cloudflare Pages deployment!');
    console.log('Deploy with: npx wrangler pages publish dist');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build
build();