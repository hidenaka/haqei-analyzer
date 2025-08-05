const fs = require('fs');
const path = require('path');

console.log('🔒 HAQEI Security Audit - Static Code Analysis\n');

// Define test results
const results = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    critical: 0,
    vulnerabilities: []
};

function logResult(category, test, status, message, severity = 'info') {
    const result = { category, test, status, message, severity };
    results.total++;
    
    switch (status) {
        case 'PASS':
            results.passed++;
            console.log(`✅ [${category}] ${test}: ${message}`);
            break;
        case 'FAIL':
            results.failed++;
            if (severity === 'critical') results.critical++;
            console.log(`❌ [${category}] ${test}: ${message}`);
            results.vulnerabilities.push(result);
            break;
        case 'WARN':
            results.warnings++;
            console.log(`⚠️ [${category}] ${test}: ${message}`);
            break;
        default:
            console.log(`ℹ️ [${category}] ${test}: ${message}`);
    }
}

// Read main HTML file
const htmlPath = path.join(__dirname, 'public', 'os_analyzer.html');
const jsPath = path.join(__dirname, 'public', 'js');

let htmlContent = '';
try {
    htmlContent = fs.readFileSync(htmlPath, 'utf8');
    console.log('📄 Analyzing os_analyzer.html...\n');
} catch (error) {
    console.error('❌ Cannot read os_analyzer.html:', error.message);
    process.exit(1);
}

console.log('🕷️ XSS Vulnerability Analysis...');

// Test 1: DOMPurify Detection
if (htmlContent.includes('dompurify') || htmlContent.includes('DOMPurify')) {
    logResult('XSS', 'DOMPurify-Library', 'PASS', 'DOMPurify sanitization library detected');
    
    // Check for SRI on DOMPurify script
    const domPurifyMatch = htmlContent.match(/<script[^>]*dompurify[^>]*>/i);
    if (domPurifyMatch && domPurifyMatch[0].includes('integrity=')) {
        logResult('XSS', 'DOMPurify-SRI', 'PASS', 'DOMPurify loaded with SRI');
    } else {
        logResult('XSS', 'DOMPurify-SRI', 'WARN', 'DOMPurify loaded without SRI');
    }
} else {
    logResult('XSS', 'DOMPurify-Library', 'FAIL', 'DOMPurify sanitization library not detected', 'high');
}

// Test 2: Dangerous innerHTML usage
const inlineHTMLMatches = htmlContent.match(/innerHTML\s*[=+]/g) || [];
const unsafeInnerHTML = htmlContent.match(/innerHTML\s*=\s*[^"']*[\$\{]/g) || [];

if (unsafeInnerHTML.length > 0) {
    logResult('XSS', 'Unsafe-innerHTML', 'FAIL', 
        `${unsafeInnerHTML.length} potentially unsafe innerHTML assignments found`, 'high');
} else if (inlineHTMLMatches.length > 0) {
    logResult('XSS', 'innerHTML-Usage', 'WARN', 
        `${inlineHTMLMatches.length} innerHTML usages found - verify sanitization`);
} else {
    logResult('XSS', 'innerHTML-Safe', 'PASS', 'No unsafe innerHTML usage detected');
}

// Test 3: eval() usage
if (htmlContent.includes('eval(')) {
    logResult('XSS', 'Eval-Usage', 'FAIL', 'eval() function usage detected', 'critical');
} else {
    logResult('XSS', 'No-Eval', 'PASS', 'No eval() usage detected');
}

// Test 4: document.write usage
if (htmlContent.includes('document.write')) {
    logResult('XSS', 'Document-Write', 'FAIL', 'document.write() usage detected', 'medium');
} else {
    logResult('XSS', 'No-Document-Write', 'PASS', 'No document.write() usage detected');
}

console.log('\n🛡️ CSRF Protection Analysis...');

// Test 5: CSRF token patterns
const csrfTokenPatterns = [
    /csrf[_-]?token/i,
    /_token/i,
    /authenticity[_-]?token/i
];

let csrfFound = false;
csrfTokenPatterns.forEach(pattern => {
    if (pattern.test(htmlContent)) {
        csrfFound = true;
    }
});

const forms = htmlContent.match(/<form[^>]*>/gi) || [];
if (forms.length > 0) {
    if (csrfFound) {
        logResult('CSRF', 'Token-Protection', 'PASS', 'CSRF protection patterns detected');
    } else {
        logResult('CSRF', 'Missing-Tokens', 'WARN', 
            `${forms.length} forms found without visible CSRF protection`);
    }
} else {
    logResult('CSRF', 'No-Forms', 'PASS', 'No forms detected in main HTML');
}

// Test 6: CSRFProtection.js usage
if (htmlContent.includes('CSRFProtection.js')) {
    logResult('CSRF', 'CSRF-Script', 'PASS', 'CSRF protection script included');
} else {
    logResult('CSRF', 'No-CSRF-Script', 'WARN', 'CSRF protection script not detected');
}

console.log('\n📋 Security Headers Analysis...');

// Test 7: Meta security headers
const metaTags = htmlContent.match(/<meta[^>]*>/gi) || [];
let cspMeta = false;
let xfoMeta = false;

metaTags.forEach(tag => {
    if (tag.includes('Content-Security-Policy')) cspMeta = true;
    if (tag.includes('X-Frame-Options')) xfoMeta = true;
});

if (cspMeta) {
    logResult('HEADERS', 'CSP-Meta', 'PASS', 'CSP meta tag found');
} else {
    logResult('HEADERS', 'No-CSP-Meta', 'WARN', 'No CSP meta tag detected');
}

console.log('\n🏗️ DOM Security Analysis...');

// Test 8: Shadow DOM usage
if (htmlContent.includes('attachShadow') || htmlContent.includes('shadowRoot')) {
    logResult('DOM', 'Shadow-DOM', 'PASS', 'Shadow DOM usage detected for isolation');
} else {
    logResult('DOM', 'No-Shadow-DOM', 'WARN', 'Shadow DOM not detected - consider for better isolation');
}

// Test 9: Event listener vs inline handlers
const inlineHandlers = htmlContent.match(/on\w+\s*=\s*["'][^"']*["']/g) || [];
if (inlineHandlers.length > 0) {
    logResult('DOM', 'Inline-Handlers', 'WARN', 
        `${inlineHandlers.length} inline event handlers found`);
} else {
    logResult('DOM', 'No-Inline-Handlers', 'PASS', 'No inline event handlers detected');
}

console.log('\n🌐 Network Security Analysis...');

// Test 10: Mixed content
const httpResources = htmlContent.match(/src\s*=\s*["']http:\/\/[^"']+["']/gi) || [];
if (httpResources.length > 0) {
    logResult('NETWORK', 'Mixed-Content', 'FAIL', 
        `${httpResources.length} HTTP resources found - mixed content risk`, 'medium');
} else {
    logResult('NETWORK', 'No-Mixed-Content', 'PASS', 'No HTTP resources detected');
}

// Test 11: Subresource Integrity
const scriptsWithSrc = htmlContent.match(/<script[^>]*src[^>]*>/gi) || [];
let sriCount = 0;

scriptsWithSrc.forEach(script => {
    if (script.includes('integrity=')) {
        sriCount++;
    }
});

if (sriCount > 0) {
    logResult('NETWORK', 'SRI', 'PASS', 
        `${sriCount}/${scriptsWithSrc.length} external scripts use SRI`);
} else if (scriptsWithSrc.length > 0) {
    logResult('NETWORK', 'No-SRI', 'WARN', 
        'External scripts detected without Subresource Integrity');
} else {
    logResult('NETWORK', 'No-External-Scripts', 'PASS', 'No external scripts detected');
}

console.log('\n✅ Input Validation Analysis...');

// Test 12: HTML5 validation attributes
const validationAttrs = ['required', 'pattern=', 'minlength', 'maxlength', 'min=', 'max='];
let validationFound = false;

validationAttrs.forEach(attr => {
    if (htmlContent.includes(attr)) {
        validationFound = true;
    }
});

if (validationFound) {
    logResult('INPUT', 'HTML5-Validation', 'PASS', 'HTML5 validation attributes detected');
} else {
    logResult('INPUT', 'No-HTML5-Validation', 'WARN', 'No HTML5 validation attributes detected');
}

// Generate final report
console.log('\n' + '='.repeat(60));
console.log('🔒 HAQEI SECURITY AUDIT REPORT');
console.log('='.repeat(60));

const totalTests = results.total;
const passRate = totalTests > 0 ? ((results.passed / totalTests) * 100).toFixed(1) : 0;

console.log(`\n📊 SUMMARY STATISTICS:`);
console.log(`   Total Tests: ${totalTests}`);
console.log(`   ✅ Passed: ${results.passed} (${passRate}%)`);
console.log(`   ❌ Failed: ${results.failed}`);
console.log(`   ⚠️ Warnings: ${results.warnings}`);
console.log(`   🚨 Critical: ${results.critical}`);

// Security Score Calculation
const passWeight = 10;
const warnWeight = -2;
const failWeight = -5;
const criticalWeight = -10;

const score = (
    (results.passed * passWeight) +
    (results.warnings * warnWeight) +
    (results.failed * failWeight) +
    (results.critical * criticalWeight)
);

const maxScore = totalTests * passWeight;
const securityScore = Math.max(0, Math.min(100, (score / maxScore) * 100));

console.log(`\n🛡️ SECURITY SCORE: ${Math.round(securityScore)}/100`);

// Risk Assessment
let riskLevel;
if (securityScore >= 85) riskLevel = 'LOW ✅';
else if (securityScore >= 70) riskLevel = 'MEDIUM ⚠️';
else if (securityScore >= 50) riskLevel = 'HIGH 🔶';
else riskLevel = 'CRITICAL 🚨';

console.log(`🎯 RISK LEVEL: ${riskLevel}`);

// Vulnerabilities
if (results.vulnerabilities.length > 0) {
    console.log(`\n🚨 VULNERABILITIES FOUND:`);
    results.vulnerabilities.forEach((vuln, index) => {
        console.log(`   ${index + 1}. [${vuln.severity.toUpperCase()}] ${vuln.category}/${vuln.test}: ${vuln.message}`);
    });
}

// Recommendations
console.log(`\n💡 SECURITY RECOMMENDATIONS:`);

if (results.critical > 0) {
    console.log('   • 🚨 Address critical vulnerabilities immediately');
}

if (results.vulnerabilities.some(v => v.category === 'XSS')) {
    console.log('   • 🕷️ Strengthen XSS protection with proper sanitization');
}

if (results.vulnerabilities.some(v => v.category === 'CSRF')) {
    console.log('   • 🛡️ Implement CSRF tokens for all forms');
}

if (results.vulnerabilities.some(v => v.category === 'NETWORK')) {
    console.log('   • 🌐 Use HTTPS and implement SRI for external resources');
}

if (results.vulnerabilities.some(v => v.category === 'HEADERS')) {
    console.log('   • 📋 Configure proper security headers');
}

if (!results.vulnerabilities.length) {
    console.log('   • ✅ Continue regular security monitoring');
    console.log('   • 📝 Consider penetration testing');
}

console.log('\n' + '='.repeat(60));
console.log(`Audit completed: ${new Date().toISOString()}`);
console.log('='.repeat(60));
EOF < /dev/null