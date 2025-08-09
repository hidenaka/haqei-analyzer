#!/usr/bin/env node

/**
 * HAQEI Analyzer Comprehensive Security Audit Script
 * QA Tester Agent Implementation
 */

class HAQEISecurityAudit {
    constructor() {
        this.baseUrl = 'http://localhost:8000/public';
        this.targetUrl = `${this.baseUrl}/os_analyzer.html`;
        this.vulnerabilities = [];
        this.testResults = {
            total: 0,
            passed: 0,
            failed: 0,
            warnings: 0,
            critical: 0
        };
        
        this.testCategories = {
            XSS: 'Cross-Site Scripting',
            CSRF: 'Cross-Site Request Forgery',
            HEADERS: 'Security Headers',
            DOM: 'DOM Security',
            INPUT: 'Input Validation',
            NETWORK: 'Network Security',
            CONSOLE: 'Console Errors'
        };
    }
    
    async runCompleteAudit() {
        console.log('🔒 HAQEI Security Audit Starting...\n');
        
        try {
            await this.testSecurityHeaders();
            await this.testXSSVulnerabilities();
            await this.testCSRFProtection();
            await this.testDOMSecurity();
            await this.testInputValidation();
            await this.testNetworkSecurity();
            await this.testConsoleErrors();
            
            this.generateSecurityReport();
            
        } catch (error) {
            console.error('❌ Audit failed:', error);
        }
    }
    
    logResult(category, test, status, message, severity = 'info') {
        const result = {
            category,
            test,
            status,
            message,
            severity,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.total++;
        
        switch (status) {
            case 'PASS':
                this.testResults.passed++;
                console.log(`✅ [${category}] ${test}: ${message}`);
                break;
            case 'FAIL':
                this.testResults.failed++;
                if (severity === 'critical') this.testResults.critical++;
                console.log(`❌ [${category}] ${test}: ${message}`);
                this.vulnerabilities.push(result);
                break;
            case 'WARN':
                this.testResults.warnings++;
                console.log(`⚠️ [${category}] ${test}: ${message}`);
                break;
            default:
                console.log(`ℹ️ [${category}] ${test}: ${message}`);
        }
    }
    
    async testSecurityHeaders() {
        console.log('\n📋 Testing Security Headers...');
        
        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch(this.targetUrl, { method: 'HEAD' });
            
            // Content Security Policy
            const csp = response.headers.get('content-security-policy');
            if (csp) {
                this.logResult('HEADERS', 'CSP', 'PASS', 'Content-Security-Policy header present');
                
                // Check CSP directives
                if (csp.includes("script-src 'unsafe-inline'")) {
                    this.logResult('HEADERS', 'CSP-Unsafe-Inline', 'FAIL', 
                        'CSP allows unsafe-inline scripts', 'critical');
                }
                if (csp.includes("script-src 'unsafe-eval'")) {
                    this.logResult('HEADERS', 'CSP-Unsafe-Eval', 'FAIL', 
                        'CSP allows unsafe-eval', 'critical');
                }
            } else {
                this.logResult('HEADERS', 'CSP', 'FAIL', 
                    'Content-Security-Policy header missing', 'high');
            }
            
            // X-Frame-Options
            const xfo = response.headers.get('x-frame-options');
            if (xfo) {
                this.logResult('HEADERS', 'X-Frame-Options', 'PASS', 
                    `X-Frame-Options: ${xfo}`);
            } else {
                this.logResult('HEADERS', 'X-Frame-Options', 'WARN', 
                    'X-Frame-Options header missing - Clickjacking risk');
            }
            
        } catch (error) {
            this.logResult('HEADERS', 'Connection', 'FAIL', 
                `Failed to connect: ${error.message}`, 'critical');
        }
    }
    
    async testXSSVulnerabilities() {
        console.log('\n🕷️ Testing XSS Vulnerabilities...');
        
        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch(this.targetUrl);
            const html = await response.text();
            
            // Test 1: Check for DOMPurify
            if (html.includes('dompurify') || html.includes('DOMPurify')) {
                this.logResult('XSS', 'DOMPurify', 'PASS', 
                    'DOMPurify sanitization library detected');
            } else {
                this.logResult('XSS', 'DOMPurify', 'WARN', 
                    'DOMPurify library not detected');
            }
            
            // Test 2: Check for dangerous innerHTML usage
            const inlineHTMLMatches = html.match(/innerHTML\s*=\s*[^;]+;/g) || [];
            if (inlineHTMLMatches.length > 0) {
                const unsafeUsage = inlineHTMLMatches.some(match => 
                    !match.includes('DOMPurify') && 
                    !match.includes('sanitize') &&
                    !match.includes('escapeHtml')
                );
                
                if (unsafeUsage) {
                    this.logResult('XSS', 'Unsafe-innerHTML', 'FAIL', 
                        'Unsafe innerHTML usage detected', 'high');
                } else {
                    this.logResult('XSS', 'Safe-innerHTML', 'PASS', 
                        'innerHTML usage appears to be sanitized');
                }
            }
            
            // Test 3: Check for eval() usage
            if (html.includes('eval(')) {
                this.logResult('XSS', 'Eval-Usage', 'FAIL', 
                    'eval() function usage detected', 'critical');
            } else {
                this.logResult('XSS', 'No-Eval', 'PASS', 
                    'No eval() usage detected');
            }
            
        } catch (error) {
            this.logResult('XSS', 'Analysis', 'FAIL', 
                `XSS analysis failed: ${error.message}`);
        }
    }
    
    generateSecurityReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🔒 HAQEI SECURITY AUDIT REPORT');
        console.log('='.repeat(60));
        
        const totalTests = this.testResults.total;
        const passRate = totalTests > 0 ? ((this.testResults.passed / totalTests) * 100).toFixed(1) : 0;
        
        console.log(`\n📊 SUMMARY STATISTICS:`);
        console.log(`   Total Tests: ${totalTests}`);
        console.log(`   ✅ Passed: ${this.testResults.passed} (${passRate}%)`);
        console.log(`   ❌ Failed: ${this.testResults.failed}`);
        console.log(`   ⚠️ Warnings: ${this.testResults.warnings}`);
        console.log(`   🚨 Critical: ${this.testResults.critical}`);
        
        // Security Score Calculation
        const securityScore = this.calculateSecurityScore();
        console.log(`\n🛡️ SECURITY SCORE: ${securityScore}/100`);
        
        // Risk Assessment
        const riskLevel = this.assessRiskLevel(securityScore);
        console.log(`🎯 RISK LEVEL: ${riskLevel}`);
        
        console.log('\n='.repeat(60));
    }
    
    calculateSecurityScore() {
        const totalTests = this.testResults.total;
        if (totalTests === 0) return 0;
        
        const passWeight = 10;
        const warnWeight = -2;
        const failWeight = -5;
        const criticalWeight = -10;
        
        const score = (
            (this.testResults.passed * passWeight) +
            (this.testResults.warnings * warnWeight) +
            (this.testResults.failed * failWeight) +
            (this.testResults.critical * criticalWeight)
        );
        
        const maxScore = totalTests * passWeight;
        const normalizedScore = Math.max(0, Math.min(100, (score / maxScore) * 100));
        
        return Math.round(normalizedScore);
    }
    
    assessRiskLevel(score) {
        if (score >= 85) return 'LOW ✅';
        if (score >= 70) return 'MEDIUM ⚠️';
        if (score >= 50) return 'HIGH 🔶';
        return 'CRITICAL 🚨';
    }
}

// Self-executing audit
if (require.main === module) {
    const audit = new HAQEISecurityAudit();
    audit.runCompleteAudit().catch(console.error);
}

module.exports = HAQEISecurityAudit;