/**
 * HAQEI Element Enhancer - 既存要素へのヘルプ機能追加
 * 
 * 既存のHAQEIシステムの要素に自動的にヘルプ機能を追加します
 * - ツールチップの自動追加
 * - ヘルプリンクの埋め込み
 * - コンテキストに応じた支援情報
 */

class HAQEIElementEnhancer {
    constructor() {
        this.enhancementRules = this.loadEnhancementRules();
        this.isEnabled = true;
        
        this.init();
    }
    
    init() {
        // ページ読み込み完了後に要素を強化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.enhanceAllElements();
            });
        } else {
            this.enhanceAllElements();
        }
        
        // 動的に追加された要素の監視
        this.observeNewElements();
    }
    
    loadEnhancementRules() {
        return {
            // 質問関連要素
            questions: {
                selector: '.question-container, .haqei-question, [data-question-id]',
                tooltip: {
                    title: '質問について',
                    description: 'この質問はあなたの性格を分析するために設計されています。',
                    type: 'feature'
                },
                helpLink: 'question-answering'
            },
            
            // 進捗表示
            progress: {
                selector: '.progress-container, .progress-bar, [class*="progress"]',
                tooltip: {
                    title: '進捗状況',
                    description: '現在の分析進捗を表示しています。',
                    type: 'feature'
                },
                helpLink: 'progress-tracking'
            },
            
            // 結果表示
            results: {
                selector: '.results-container, .personality-chart, .analysis-result',
                tooltip: {
                    title: '分析結果',
                    description: 'あなたの性格分析の結果です。',
                    type: 'feature'
                },
                helpLink: 'results-analysis'
            },
            
            // ナビゲーション
            navigation: {
                selector: '.navigation, .nav-button, .step-nav',
                tooltip: {
                    title: 'ナビゲーション',
                    description: 'システム内を移動するためのボタンです。',
                    type: 'feature'
                },
                helpLink: 'navigation'
            },
            
            // bunenjin関連
            bunenjin: {
                selector: '[class*="bunenjin"], [data-concept="bunenjin"]',
                tooltip: {
                    title: '分人哲学',
                    description: '複数の側面を持つ人間観に基づく分析アプローチです。',
                    type: 'concept'
                },
                helpLink: 'bunenjin'
            },
            
            // Triple OS関連
            tripleOS: {
                selector: '[class*="triple-os"], [class*="engine"], [class*="interface"], [class*="safe"]',
                tooltip: {
                    title: 'Triple OS',
                    description: 'HAQEIシステムの三層アーキテクチャです。',
                    type: 'concept'
                },
                helpLink: 'triple-os'
            },
            
            // 易経関連
            iching: {
                selector: '[class*="iching"], [class*="hexagram"], [data-hexagram]',
                tooltip: {
                    title: '易経',
                    description: '古代中国の叡智に基づく分析手法です。',
                    type: 'concept'
                },
                helpLink: '易経'
            }
        };
    }
    
    enhanceAllElements() {
        if (!this.isEnabled) return;
        
        Object.entries(this.enhancementRules).forEach(([key, rule]) => {
            this.enhanceElementsByRule(rule);
        });
        
        console.log('🎯 HAQEI elements enhanced with help functionality');
    }
    
    enhanceElementsByRule(rule) {
        const elements = document.querySelectorAll(rule.selector);
        
        elements.forEach(element => {
            // 既に強化済みの場合はスキップ
            if (element.hasAttribute('data-help-enhanced')) {
                return;
            }
            
            // ツールチップ属性を追加
            if (rule.tooltip) {
                element.setAttribute('data-tooltip', rule.helpLink || rule.tooltip.title);
                element.setAttribute('data-tooltip-title', rule.tooltip.title);
                element.setAttribute('data-tooltip-desc', rule.tooltip.description);
                element.setAttribute('data-tooltip-type', rule.tooltip.type);
                element.setAttribute('tabindex', '0');
            }
            
            // ヘルプリンク属性を追加
            if (rule.helpLink) {
                element.setAttribute('data-help-link', rule.helpLink);
                element.setAttribute('data-help-type', rule.tooltip.type);
            }
            
            // 強化済みマーク
            element.setAttribute('data-help-enhanced', 'true');
            
            // アクセシビリティ向上
            if (!element.hasAttribute('aria-describedby')) {
                element.setAttribute('aria-describedby', 'haqei-tooltip');
            }
        });
    }
    
    observeNewElements() {
        // MutationObserverで動的要素を監視
        const observer = new MutationObserver((mutations) => {
            let shouldEnhance = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 新しい要素が追加されたかチェック
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            shouldEnhance = true;
                        }
                    });
                }
            });
            
            if (shouldEnhance) {
                // 少し遅延させて要素の準備を待つ
                setTimeout(() => {
                    this.enhanceAllElements();
                }, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 特定の要素を手動で強化
    enhanceElement(element, rule) {
        if (!element || element.hasAttribute('data-help-enhanced')) {
            return;
        }
        
        if (rule.tooltip) {
            element.setAttribute('data-tooltip', rule.helpLink || rule.tooltip.title);
            element.setAttribute('data-tooltip-title', rule.tooltip.title);
            element.setAttribute('data-tooltip-desc', rule.tooltip.description);
            element.setAttribute('data-tooltip-type', rule.tooltip.type);
            element.setAttribute('tabindex', '0');
        }
        
        if (rule.helpLink) {
            element.setAttribute('data-help-link', rule.helpLink);
            element.setAttribute('data-help-type', rule.tooltip.type);
        }
        
        element.setAttribute('data-help-enhanced', 'true');
        
        if (!element.hasAttribute('aria-describedby')) {
            element.setAttribute('aria-describedby', 'haqei-tooltip');
        }
    }
    
    // カスタムルールの追加
    addEnhancementRule(name, rule) {
        this.enhancementRules[name] = rule;
        this.enhanceElementsByRule(rule);
    }
    
    // 強化機能の有効/無効切り替え
    enable() {
        this.isEnabled = true;
        this.enhanceAllElements();
    }
    
    disable() {
        this.isEnabled = false;
        // 既存の強化属性を削除
        const enhancedElements = document.querySelectorAll('[data-help-enhanced]');
        enhancedElements.forEach(element => {
            element.removeAttribute('data-tooltip');
            element.removeAttribute('data-tooltip-title');
            element.removeAttribute('data-tooltip-desc');
            element.removeAttribute('data-tooltip-type');
            element.removeAttribute('data-help-link');
            element.removeAttribute('data-help-type');
            element.removeAttribute('data-help-enhanced');
            element.removeAttribute('aria-describedby');
            // tabindexは他の機能でも使用されている可能性があるため削除しない
        });
    }
    
    // 統計情報の取得
    getStats() {
        const enhancedElements = document.querySelectorAll('[data-help-enhanced]');
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        const helpLinkElements = document.querySelectorAll('[data-help-link]');
        
        return {
            totalEnhanced: enhancedElements.length,
            withTooltips: tooltipElements.length,
            withHelpLinks: helpLinkElements.length,
            rules: Object.keys(this.enhancementRules).length,
            enabled: this.isEnabled
        };
    }
}

// グローバルインスタンス作成
if (typeof window !== 'undefined') {
    window.HAQEIElementEnhancer = HAQEIElementEnhancer;
    
    // 自動初期化
    if (!window.haqeiElementEnhancer) {
        window.haqeiElementEnhancer = new HAQEIElementEnhancer();
    }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HAQEIElementEnhancer;
}