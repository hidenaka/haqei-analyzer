#!/usr/bin/env node

/**
 * HAQEI Analyzer - SRI Implementation Verification Script
 * Comprehensive security testing for Subresource Integrity implementation
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
    htmlFile: 'public/os_analyzer.html',
    testOutput: 'sri-verification-report.json',
    expectedResources: [
        {
            name: 'Google Fonts CSS',
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Shippori+Mincho:wght@400;500;600;700&display=swap',
            type: 'link',
            algorithm: 'sha384',
            expectedHash: '2LfpDLvAHm4a9RYruJICmRn+ef67nc2WnlOOMbE2SzvQWkbVx2MysR9fXUVlojfI'
        },
        {
            name: 'Chart.js',
            url: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js',
            type: 'script',
            algorithm: 'sha512',
            expectedHash: 'ElRFoEQdI5Ht6kZvyzXhYG9NqjtkmlkfYk0wr6wHxU9JEHakS7UJZNeml5ALk+8IKlU6jDgMabC3vkumRokgJA=='
        },
        {
            name: 'DOMPurify',
            url: 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js',
            type: 'script',
            algorithm: 'sha512',
            expectedHash: 'H+rglffZ6f5gF7UJgvH4Naa+fGCgjrHKMgoFOGmcPTRwR6oILo5R+gtzNrpDp7iMV3udbymBVjkeZGNz1Em4rQ=='
        }
    ]
};

class SRIVerifier {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            overall: { status: 'unknown', score: 0 },
            resources: [],
            security: {
                csp: false,
                xContentTypeOptions: false,
                xFrameOptions: false,
                httpsEnforcement: false
            },
            recommendations: []
        };
    }

    async verify() {
        console.log('🔒 Starting SRI Implementation Verification...');
        console.log('===============================================');

        try {
            // 1. Read and parse HTML file
            await this.parseHTMLFile();
            
            // 2. Verify each external resource
            await this.verifyExternalResources();
            
            // 3. Check security headers
            await this.checkSecurityHeaders();
            
            // 4. Generate final report
            this.generateReport();
            
            // 5. Save results
            await this.saveResults();

        } catch (error) {
            console.error('❌ Verification failed:', error);
            this.results.overall.status = 'error';
            this.results.error = error.message;
        }
    }

    async parseHTMLFile() {
        console.log('📄 Reading HTML file...');
        const htmlPath = path.join(process.cwd(), CONFIG.htmlFile);
        
        if (!fs.existsSync(htmlPath)) {
            throw new Error(`HTML file not found: ${htmlPath}`);
        }

        this.htmlContent = fs.readFileSync(htmlPath, 'utf8');
        console.log('✅ HTML file loaded successfully');
    }

    async verifyExternalResources() {
        console.log('🔍 Verifying external resources...');
        
        for (const resource of CONFIG.expectedResources) {
            console.log(`\n📦 Checking ${resource.name}...`);
            
            const result = {
                name: resource.name,
                url: resource.url,
                type: resource.type,
                found: false,
                hasIntegrity: false,
                hasCrossorigin: false,
                hasReferrerPolicy: false,
                integrityMatch: false,
                downloadSuccess: false,
                hashVerification: false,
                actualHash: null,
                expectedHash: resource.expectedHash,
                algorithm: resource.algorithm,
                issues: []
            };

            try {
                // Check if resource is present in HTML
                const resourceRegex = resource.type === 'script' 
                    ? new RegExp(`<script[^>]*src=["']${this.escapeRegex(resource.url)}["'][^>]*>`, 'i')
                    : new RegExp(`<link[^>]*href=["']${this.escapeRegex(resource.url)}["'][^>]*>`, 'i');

                const match = this.htmlContent.match(resourceRegex);
                
                if (match) {
                    result.found = true;
                    const tag = match[0];
                    
                    // Check for integrity attribute
                    const integrityMatch = tag.match(/integrity=["']([^"']+)["']/i);
                    if (integrityMatch) {
                        result.hasIntegrity = true;
                        const actualIntegrity = integrityMatch[1];
                        const expectedIntegrity = `${resource.algorithm}-${resource.expectedHash}`;
                        result.integrityMatch = actualIntegrity === expectedIntegrity;
                        
                        if (!result.integrityMatch) {
                            result.issues.push(`Integrity mismatch: expected ${expectedIntegrity}, got ${actualIntegrity}`);
                        }
                    } else {
                        result.issues.push('Missing integrity attribute');
                    }
                    
                    // Check for crossorigin attribute
                    result.hasCrossorigin = /crossorigin=["']anonymous["']/i.test(tag);
                    if (!result.hasCrossorigin) {
                        result.issues.push('Missing or incorrect crossorigin attribute');
                    }
                    
                    // Check for referrerpolicy (for scripts)
                    if (resource.type === 'script') {
                        result.hasReferrerPolicy = /referrerpolicy=["']no-referrer["']/i.test(tag);
                        if (!result.hasReferrerPolicy) {
                            result.issues.push('Missing referrerpolicy attribute');
                        }
                    }
                    
                    // Download and verify hash
                    try {
                        const content = await this.downloadResource(resource.url);
                        result.downloadSuccess = true;
                        
                        const hash = crypto.createHash(resource.algorithm.replace('sha', 'sha')).update(content).digest('base64');
                        result.actualHash = hash;
                        result.hashVerification = hash === resource.expectedHash;
                        
                        if (!result.hashVerification) {
                            result.issues.push(`Hash verification failed: computed ${hash}, expected ${resource.expectedHash}`);
                        }
                        
                    } catch (downloadError) {
                        result.issues.push(`Download failed: ${downloadError.message}`);
                    }
                    
                } else {
                    result.issues.push('Resource not found in HTML');
                }
                
            } catch (error) {
                result.issues.push(`Verification error: ${error.message}`);
            }
            
            this.results.resources.push(result);
            
            // Report status
            if (result.found && result.hasIntegrity && result.integrityMatch && result.hashVerification) {
                console.log(`✅ ${resource.name}: All checks passed`);
            } else {
                console.log(`❌ ${resource.name}: Issues found`);
                result.issues.forEach(issue => console.log(`   - ${issue}`));
            }
        }
    }

    async checkSecurityHeaders() {
        console.log('\n🛡️ Checking security headers...');
        
        // Check Content Security Policy
        const cspRegex = /<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/i;
        this.results.security.csp = cspRegex.test(this.htmlContent);
        
        // Check X-Content-Type-Options
        const xContentTypeRegex = /<meta[^>]*http-equiv=["']X-Content-Type-Options["'][^>]*>/i;
        this.results.security.xContentTypeOptions = xContentTypeRegex.test(this.htmlContent);
        
        // Check X-Frame-Options
        const xFrameRegex = /<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/i;
        this.results.security.xFrameOptions = xFrameRegex.test(this.htmlContent);
        
        // Check HTTPS enforcement in CSP
        const httpsRegex = /connect-src[^;]*https:/i;
        this.results.security.httpsEnforcement = httpsRegex.test(this.htmlContent);
        
        console.log(`CSP: ${this.results.security.csp ? '✅' : '❌'}`);
        console.log(`X-Content-Type-Options: ${this.results.security.xContentTypeOptions ? '✅' : '❌'}`);
        console.log(`X-Frame-Options: ${this.results.security.xFrameOptions ? '✅' : '❌'}`);
        console.log(`HTTPS Enforcement: ${this.results.security.httpsEnforcement ? '✅' : '❌'}`);
    }

    generateReport() {
        console.log('\n📊 Generating verification report...');
        
        // Calculate overall score
        let totalChecks = 0;
        let passedChecks = 0;
        
        this.results.resources.forEach(resource => {
            totalChecks += 4; // found, integrity, crossorigin, hash verification
            if (resource.found) passedChecks++;
            if (resource.hasIntegrity && resource.integrityMatch) passedChecks++;
            if (resource.hasCrossorigin) passedChecks++;
            if (resource.hashVerification) passedChecks++;
        });
        
        // Add security checks
        totalChecks += 4;
        if (this.results.security.csp) passedChecks++;
        if (this.results.security.xContentTypeOptions) passedChecks++;
        if (this.results.security.xFrameOptions) passedChecks++;
        if (this.results.security.httpsEnforcement) passedChecks++;
        
        this.results.overall.score = Math.round((passedChecks / totalChecks) * 100);
        
        if (this.results.overall.score >= 90) {
            this.results.overall.status = 'excellent';
        } else if (this.results.overall.score >= 70) {
            this.results.overall.status = 'good';
        } else if (this.results.overall.score >= 50) {
            this.results.overall.status = 'fair';
        } else {
            this.results.overall.status = 'poor';
        }
        
        // Generate recommendations
        this.generateRecommendations();
        
        console.log(`Overall Score: ${this.results.overall.score}% (${this.results.overall.status.toUpperCase()})`);
    }

    generateRecommendations() {
        const recommendations = [];
        
        this.results.resources.forEach(resource => {
            if (resource.issues.length > 0) {
                recommendations.push(`${resource.name}: ${resource.issues.join(', ')}`);
            }
        });
        
        if (!this.results.security.csp) {
            recommendations.push('Add Content-Security-Policy meta tag');
        }
        if (!this.results.security.xContentTypeOptions) {
            recommendations.push('Add X-Content-Type-Options: nosniff header');
        }
        if (!this.results.security.xFrameOptions) {
            recommendations.push('Add X-Frame-Options: SAMEORIGIN header');
        }
        if (!this.results.security.httpsEnforcement) {
            recommendations.push('Enforce HTTPS in Content Security Policy');
        }
        
        this.results.recommendations = recommendations;
        
        if (recommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            recommendations.forEach(rec => console.log(`   - ${rec}`));
        }
    }

    async saveResults() {
        const outputPath = path.join(process.cwd(), CONFIG.testOutput);
        fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2));
        console.log(`\n💾 Results saved to: ${outputPath}`);
    }

    downloadResource(url) {
        return new Promise((resolve, reject) => {
            const client = url.startsWith('https:') ? https : http;
            
            client.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}`));
                    return;
                }
                
                let data = '';
                response.on('data', chunk => data += chunk);
                response.on('end', () => resolve(data));
            }).on('error', reject);
        });
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const verifier = new SRIVerifier();
    verifier.verify().then(() => {
        console.log('\n🎉 SRI verification completed successfully!');
        process.exit(0);
    }).catch(error => {
        console.error('\n💥 SRI verification failed:', error);
        process.exit(1);
    });
}

export default SRIVerifier;