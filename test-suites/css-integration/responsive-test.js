/**
 * HAQEI レスポンシブデザイン専用テストシステム
 * デバイス互換性とタッチインターフェース検証
 */

const puppeteer = require('puppeteer');

class ResponsiveDesignTester {
    constructor(options = {}) {
        this.config = {
            baseUrl: 'http://localhost:8080',
            pages: ['/os_analyzer.html', '/index.html', '/results.html'],
            devices: [
                { name: 'iPhone SE', width: 375, height: 667, mobile: true },
                { name: 'iPhone 12', width: 390, height: 844, mobile: true },
                { name: 'iPad', width: 1024, height: 768, tablet: true },
                { name: 'iPad Pro', width: 1366, height: 1024, tablet: true },
                { name: 'Desktop Small', width: 1280, height: 720, desktop: true },
                { name: 'Desktop Large', width: 1920, height: 1080, desktop: true }
            ],
            touchTargetMinSize: 44, // Apple推奨サイズ
            ...options
        };
        
        this.results = {
            before: {},
            after: {},
            issues: []
        };
    }

    /**
     * 統合前レスポンシブテスト
     */
    async testBefore() {
        console.log('📱 統合前レスポンシブデザインテスト開始...');
        
        for (const page of this.config.pages) {
            this.results.before[page] = await this.testPageResponsiveness(page, 'before');
        }
        
        console.log('✅ 統合前レスポンシブテスト完了');
        return this.results.before;
    }

    /**
     * 統合後レスポンシブテスト
     */
    async testAfter() {
        console.log('📱 統合後レスポンシブデザインテスト開始...');
        
        for (const page of this.config.pages) {
            this.results.after[page] = await this.testPageResponsiveness(page, 'after');
        }
        
        console.log('✅ 統合後レスポンシブテスト完了');
        return this.results.after;
    }

    /**
     * ページレスポンシブネステスト
     */
    async testPageResponsiveness(pagePath, phase) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const url = `${this.config.baseUrl}${pagePath}`;
        
        const pageResults = {
            url: url,
            phase: phase,
            devices: {},
            issues: []
        };
        
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
            
            for (const device of this.config.devices) {
                console.log(`  📊 テスト中: ${pagePath} - ${device.name}`);
                
                const deviceResult = await this.testDevice(page, device);
                pageResults.devices[device.name] = deviceResult;
                
                // デバイス固有の問題を収集
                if (deviceResult.issues.length > 0) {
                    pageResults.issues.push(...deviceResult.issues.map(issue => ({
                        ...issue,
                        device: device.name,
                        page: pagePath
                    })));
                }
            }
            
        } catch (error) {
            console.error(`❌ ページテスト失敗 (${pagePath}):`, error.message);
            pageResults.error = error.message;
        } finally {
            await browser.close();
        }
        
        return pageResults;
    }

    /**
     * デバイス固有テスト
     */
    async testDevice(page, device) {
        await page.setViewport({
            width: device.width,
            height: device.height,
            isMobile: device.mobile || false
        });
        
        await page.waitForTimeout(1000); // レイアウト安定化
        
        const deviceResult = {
            device: device.name,
            viewport: `${device.width}x${device.height}`,
            issues: [],
            metrics: {},
            elements: {}
        };
        
        // 基本レイアウトテスト
        const layoutTest = await this.testLayout(page, device);
        deviceResult.metrics.layout = layoutTest;
        if (layoutTest.issues.length > 0) {
            deviceResult.issues.push(...layoutTest.issues);
        }
        
        // タッチターゲットテスト（モバイル・タブレットのみ）
        if (device.mobile || device.tablet) {
            const touchTest = await this.testTouchTargets(page, device);
            deviceResult.metrics.touchTargets = touchTest;
            if (touchTest.issues.length > 0) {
                deviceResult.issues.push(...touchTest.issues);
            }
        }
        
        // フォントサイズテスト
        const fontTest = await this.testFontSizes(page, device);
        deviceResult.metrics.fonts = fontTest;
        if (fontTest.issues.length > 0) {
            deviceResult.issues.push(...fontTest.issues);
        }
        
        // ナビゲーションテスト
        const navTest = await this.testNavigation(page, device);
        deviceResult.metrics.navigation = navTest;
        if (navTest.issues.length > 0) {
            deviceResult.issues.push(...navTest.issues);
        }
        
        return deviceResult;
    }

    /**
     * レイアウトテスト
     */
    async testLayout(page, device) {
        return await page.evaluate((deviceInfo) => {
            const issues = [];
            const metrics = {
                hasHorizontalScroll: false,
                overflowElements: [],
                hiddenElements: [],
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight,
                documentWidth: document.documentElement.scrollWidth,
                documentHeight: document.documentElement.scrollHeight
            };
            
            // 横スクロール検出
            if (document.documentElement.scrollWidth > window.innerWidth) {
                metrics.hasHorizontalScroll = true;
                issues.push({
                    type: 'horizontal_scroll',
                    severity: 'medium',
                    message: '横スクロールが発生しています'
                });
            }
            
            // オーバーフロー要素検出
            const allElements = document.querySelectorAll('*');
            allElements.forEach((el, index) => {
                const rect = el.getBoundingClientRect();
                const styles = window.getComputedStyle(el);
                
                // 画面外要素
                if (rect.right > window.innerWidth && styles.overflow \!== 'hidden') {
                    metrics.overflowElements.push({
                        tagName: el.tagName,
                        className: el.className,
                        right: rect.right,
                        viewportWidth: window.innerWidth
                    });
                }
                
                // 非表示要素（意図的でない可能性）
                if (styles.display === 'none' && el.textContent.trim()) {
                    metrics.hiddenElements.push({
                        tagName: el.tagName,
                        className: el.className,
                        textContent: el.textContent.substring(0, 50)
                    });
                }
            });
            
            if (metrics.overflowElements.length > 0) {
                issues.push({
                    type: 'element_overflow',
                    severity: 'medium',
                    message: `${metrics.overflowElements.length}個の要素が画面外にはみ出しています`,
                    details: metrics.overflowElements.slice(0, 5)
                });
            }
            
            return { issues, metrics };
        }, device);
    }

    /**
     * タッチターゲットテスト
     */
    async testTouchTargets(page, device) {
        return await page.evaluate((minSize) => {
            const issues = [];
            const metrics = {
                totalTargets: 0,
                smallTargets: [],
                averageSize: 0,
                minSize: minSize
            };
            
            // タッチ可能要素を検出
            const touchTargets = document.querySelectorAll('button, a, input[type="button"], input[type="submit"], [onclick], [role="button"]');
            metrics.totalTargets = touchTargets.length;
            
            const sizes = [];
            touchTargets.forEach((target, index) => {
                const rect = target.getBoundingClientRect();
                const size = Math.min(rect.width, rect.height);
                sizes.push(size);
                
                if (size < minSize) {
                    metrics.smallTargets.push({
                        element: target.tagName,
                        className: target.className,
                        size: size,
                        text: target.textContent?.substring(0, 30) || '',
                        rect: {
                            width: rect.width,
                            height: rect.height
                        }
                    });
                }
            });
            
            if (sizes.length > 0) {
                metrics.averageSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
            }
            
            if (metrics.smallTargets.length > 0) {
                issues.push({
                    type: 'small_touch_targets',
                    severity: device.mobile ? 'high' : 'medium',
                    message: `${metrics.smallTargets.length}個のタッチターゲットが小さすぎます（${minSize}px未満）`,
                    details: metrics.smallTargets.slice(0, 5)
                });
            }
            
            return { issues, metrics };
        }, this.config.touchTargetMinSize);
    }

    /**
     * フォントサイズテスト
     */
    async testFontSizes(page, device) {
        return await page.evaluate((deviceInfo) => {
            const issues = [];
            const metrics = {
                averageFontSize: 0,
                smallTextElements: [],
                fontSizes: []
            };
            
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label');
            const minFontSize = deviceInfo.mobile ? 16 : 14; // モバイルは16px以上推奨
            
            textElements.forEach(el => {
                if (el.textContent.trim()) {
                    const styles = window.getComputedStyle(el);
                    const fontSize = parseFloat(styles.fontSize);
                    
                    if (fontSize) {
                        metrics.fontSizes.push(fontSize);
                        
                        if (fontSize < minFontSize) {
                            metrics.smallTextElements.push({
                                tagName: el.tagName,
                                fontSize: fontSize,
                                text: el.textContent.substring(0, 30)
                            });
                        }
                    }
                }
            });
            
            if (metrics.fontSizes.length > 0) {
                metrics.averageFontSize = metrics.fontSizes.reduce((a, b) => a + b, 0) / metrics.fontSizes.length;
            }
            
            if (metrics.smallTextElements.length > 0) {
                issues.push({
                    type: 'small_font_size',
                    severity: deviceInfo.mobile ? 'medium' : 'low',
                    message: `${metrics.smallTextElements.length}個の要素のフォントサイズが小さすぎます（${minFontSize}px未満）`
                });
            }
            
            return { issues, metrics };
        }, device);
    }

    /**
     * ナビゲーションテスト
     */
    async testNavigation(page, device) {
        return await page.evaluate((deviceInfo) => {
            const issues = [];
            const metrics = {
                hasHamburgerMenu: false,
                navigationVisible: true,
                navigationHeight: 0,
                menuItems: 0
            };
            
            // ハンバーガーメニューの検出
            const hamburgerElements = document.querySelectorAll('[class*="hamburger"], [class*="menu-toggle"], [class*="nav-toggle"]');
            metrics.hasHamburgerMenu = hamburgerElements.length > 0;
            
            // メインナビゲーションの検出
            const navElements = document.querySelectorAll('nav, [role="navigation"]');
            if (navElements.length > 0) {
                const mainNav = navElements[0];
                const navRect = mainNav.getBoundingClientRect();
                const navStyles = window.getComputedStyle(mainNav);
                
                metrics.navigationHeight = navRect.height;
                metrics.navigationVisible = navStyles.display \!== 'none' && navStyles.visibility \!== 'hidden';
                
                // メニューアイテム数
                const menuItems = mainNav.querySelectorAll('a, button');
                metrics.menuItems = menuItems.length;
                
                // モバイルでナビゲーションが適切に隠されているかチェック
                if (deviceInfo.mobile && metrics.menuItems > 4 && \!metrics.hasHamburgerMenu) {
                    issues.push({
                        type: 'navigation_not_collapsed',
                        severity: 'medium',
                        message: 'モバイルでナビゲーションが適切に折りたたまれていません'
                    });
                }
            }
            
            return { issues, metrics };
        }, device);
    }

    /**
     * 比較分析
     */
    compareResults() {
        console.log('🔍 レスポンシブデザイン比較分析開始...');
        
        const comparison = {
            pages: {},
            summary: {
                issuesResolved: 0,
                newIssues: 0,
                unchangedIssues: 0
            }
        };
        
        for (const page of this.config.pages) {
            const before = this.results.before[page];
            const after = this.results.after[page];
            
            if (\!before || \!after) {
                console.warn(`⚠️ 比較データ不足: ${page}`);
                continue;
            }
            
            const pageComparison = {
                devices: {},
                issueChanges: {
                    resolved: [],
                    new: [],
                    unchanged: []
                }
            };
            
            // デバイス別比較
            for (const deviceName of Object.keys(before.devices)) {
                const beforeDevice = before.devices[deviceName];
                const afterDevice = after.devices[deviceName];
                
                if (beforeDevice && afterDevice) {
                    pageComparison.devices[deviceName] = {
                        issuesBefore: beforeDevice.issues.length,
                        issuesAfter: afterDevice.issues.length,
                        improvement: beforeDevice.issues.length - afterDevice.issues.length
                    };
                }
            }
            
            // 問題の変化を分析
            const beforeIssues = before.issues || [];
            const afterIssues = after.issues || [];
            
            // 解決された問題
            const resolvedIssues = beforeIssues.filter(beforeIssue => 
                \!afterIssues.some(afterIssue => 
                    afterIssue.type === beforeIssue.type && 
                    afterIssue.device === beforeIssue.device
                )
            );
            
            // 新しい問題
            const newIssues = afterIssues.filter(afterIssue => 
                \!beforeIssues.some(beforeIssue => 
                    beforeIssue.type === afterIssue.type && 
                    beforeIssue.device === afterIssue.device
                )
            );
            
            pageComparison.issueChanges.resolved = resolvedIssues;
            pageComparison.issueChanges.new = newIssues;
            
            comparison.pages[page] = pageComparison;
            comparison.summary.issuesResolved += resolvedIssues.length;
            comparison.summary.newIssues += newIssues.length;
        }
        
        console.log(`✅ 比較分析完了: ${comparison.summary.issuesResolved}件解決, ${comparison.summary.newIssues}件新規`);
        return comparison;
    }

    /**
     * 完全テスト実行
     */
    async runFullTest() {
        try {
            await this.testBefore();
            
            return {
                status: 'baseline_completed',
                message: 'レスポンシブデザインベースライン測定完了。CSS統合後にcontinueAfterIntegration()を実行してください。',
                baseline: this.results.before
            };
            
        } catch (error) {
            console.error('❌ レスポンシブテストエラー:', error);
            throw error;
        }
    }

    /**
     * 統合後継続テスト
     */
    async continueAfterIntegration() {
        try {
            await this.testAfter();
            const comparison = this.compareResults();
            
            return {
                status: 'completed',
                results: {
                    before: this.results.before,
                    after: this.results.after,
                    comparison: comparison
                }
            };
            
        } catch (error) {
            console.error('❌ 統合後レスポンシブテストエラー:', error);
            throw error;
        }
    }
}

if (typeof module \!== 'undefined' && module.exports) {
    module.exports = ResponsiveDesignTester;
}
EOF < /dev/null