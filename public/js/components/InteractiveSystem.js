// InteractiveSystem.js - インタラクティブ操作システム
// HaQei Analyzer - Interactive Operation System

class InteractiveSystem extends BaseComponent {
    constructor(containerId, options = {}) {
        super(containerId, options);
        this.expandedCards = new Set();
        this.activeTooltips = new Map();
        this.termsDatabase = null;
        this.tabStates = new Map();
        this.init();
    }

    get defaultOptions() {
        return {
            ...super.defaultOptions,
            enableCardExpansion: true,
            enableTooltips: true,
            enableTabs: true,
            animationDuration: 300,
            tooltipDelay: 500,
            maxExpandedCards: 3,
        };
    }

    /**
     * インタラクティブシステムを初期化
     */
    init() {
        this.initializeTermsDatabase();
        this.setupEventListeners();
        this.initializeTooltipSystem();
    }

    /**
     * 用語説明データベースを初期化（タスク10.2）
     */
    initializeTermsDatabase() {
        this.termsDatabase = {
            // 64卦関連用語
            "乾為天": {
                reading: "けんいてん",
                category: "hexagram",
                description: "創造力と指導力を表す64卦の第1番。天の象徴で、積極的で創造的なエネルギーを意味します。",
                context: "エンジンOSとして現れると、強い意志力と革新性を持つ特徴があります。"
            },
            "火風鼎": {
                reading: "かふうてい",
                category: "hexagram", 
                description: "変革と安定化を表す64卦の第50番。古い秩序を改革し、新しい安定を築く力を意味します。",
                context: "調和を重視しながら必要な変革を行う、バランス感覚に優れた特徴があります。"
            },
            "エンジンOS": {
                category: "system",
                description: "個人の根源的な価値観や動機を表すシステム。内面的な駆動力や創造性の源泉となります。",
                context: "診断では主に質問1-20の回答から分析され、その人の核となる志向性を示します。"
            },
            "インターフェースOS": {
                category: "system",
                description: "外面的な行動パターンや他者との関わり方を表すシステム。社会的な顔や表現方法を示します。",
                context: "質問21-40の回答から分析され、職場や社会での振る舞い方の特徴を表します。"
            },
            "セーフモードOS": {
                category: "system",
                description: "ストレスや困難な状況での防御機制を表すシステム。心の安全装置として機能します。",
                context: "質問41-60の回答から分析され、危機的状況での対処パターンを示します。"
            },
            "八卦": {
                reading: "はっけ",
                category: "concept",
                description: "易経の基本要素で、8つの基本的なエネルギーパターンを表します。乾・兌・離・震・巽・坎・艮・坤の8種類があります。",
                context: "64卦は2つの八卦の組み合わせで構成され、上卦と下卦という形で表現されます。"
            },
            "一貫性スコア": {
                category: "metric",
                description: "3つのOS間の調和度を0-100%で表したスコア。高いほど内面と外面が一致していることを意味します。",
                context: "70%以上は高い一貫性、50-69%は中程度、50%未満は多様性に富む複雑な人格を示します。"
            },
            "相性タイプ": {
                category: "compatibility",
                description: "OS間の関係性を5つのタイプで分類したもの。SYNERGY（相乗効果）、HARMONY（調和）、TENSION（緊張）、CONFLICT（葛藤）、CHAOS（混沌）があります。",
                context: "各タイプには特有の特徴と成長のヒントがあり、内的統合の指針となります。"
            },
            "SYNERGY": {
                category: "compatibility_type",
                description: "相乗効果型。2つのOSが互いを高め合い、1+1が3以上になる関係性。",
                context: "この関係を活かすことで、個人の可能性を最大限に発揮できます。"
            },
            "HARMONY": {
                category: "compatibility_type", 
                description: "調和型。2つのOSが自然に溶け合い、安定した統合を示す関係性。",
                context: "ストレスが少なく、持続可能な成長パターンを築きやすい特徴があります。"
            },
            "TENSION": {
                category: "compatibility_type",
                description: "緊張型。2つのOSに適度な緊張関係があり、創造的エネルギーを生み出す関係性。",
                context: "この緊張を建設的に活用することで、新しい発見や成長につながります。"
            },
            "CONFLICT": {
                category: "compatibility_type",
                description: "葛藤型。2つのOSが対立的な関係にあり、内的な葛藤を生じさせる関係性。",
                context: "適切に統合することで、多様性に富んだ豊かな人格の形成が可能です。"
            },
            "CHAOS": {
                category: "compatibility_type",
                description: "混沌型。2つのOSの関係性が予測困難で、変化に富んだダイナミックな関係性。",
                context: "柔軟性と適応力に優れ、変化の多い環境で力を発揮しやすい特徴があります。"
            }
        };
    }

    /**
     * OSカード展開機能を実装（タスク10.1）
     */
    initializeCardExpansion() {
        const cards = this.container.querySelectorAll('.os-detail-card, .os-card');
        
        cards.forEach(card => {
            const cardId = card.dataset.cardId || card.className.split(' ').find(c => c.includes('card'));
            
            // 展開ボタンを追加
            if (!card.querySelector('.expand-button')) {
                const expandButton = document.createElement('button');
                expandButton.className = 'expand-button';
                expandButton.innerHTML = '<span class="expand-icon">⬇</span> 詳細を表示';
                expandButton.setAttribute('aria-label', 'カードの詳細情報を展開');
                
                card.appendChild(expandButton);
                
                expandButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleCardExpansion(card, cardId);
                });
            }
        });
    }

    /**
     * カードの展開/収納を切り替え
     */
    toggleCardExpansion(card, cardId) {
        const isExpanded = this.expandedCards.has(cardId);
        
        if (isExpanded) {
            this.collapseCard(card, cardId);
        } else {
            // 最大展開数チェック
            if (this.expandedCards.size >= this.options.maxExpandedCards) {
                this.showMessage('一度に展開できるカードは' + this.options.maxExpandedCards + '枚までです。', 'warning');
                return;
            }
            this.expandCard(card, cardId);
        }
    }

    /**
     * カードを展開
     */
    expandCard(card, cardId) {
        this.expandedCards.add(cardId);
        
        // 展開アニメーション
        card.style.transition = `all ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        card.classList.add('expanded');
        
        // 詳細コンテンツを表示
        this.showExpandedContent(card, cardId);
        
        // ボタンテキスト更新
        const expandButton = card.querySelector('.expand-button');
        if (expandButton) {
            expandButton.innerHTML = '<span class="expand-icon">⬆</span> 詳細を閉じる';
        }

        // アクセシビリティ
        card.setAttribute('aria-expanded', 'true');
        
        // アナリティクス
        this.trackEvent('card_expanded', { cardId });
    }

    /**
     * カードを収納
     */
    collapseCard(card, cardId) {
        this.expandedCards.delete(cardId);
        
        // 収納アニメーション
        card.style.transition = `all ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        card.classList.remove('expanded');
        
        // 詳細コンテンツを隠す
        this.hideExpandedContent(card, cardId);
        
        // ボタンテキスト更新
        const expandButton = card.querySelector('.expand-button');
        if (expandButton) {
            expandButton.innerHTML = '<span class="expand-icon">⬇</span> 詳細を表示';
        }

        // アクセシビリティ
        card.setAttribute('aria-expanded', 'false');
        
        // アナリティクス
        this.trackEvent('card_collapsed', { cardId });
    }

    /**
     * 展開コンテンツを表示
     */
    showExpandedContent(card, cardId) {
        let expandedContent = card.querySelector('.expanded-content');
        
        if (!expandedContent) {
            expandedContent = document.createElement('div');
            expandedContent.className = 'expanded-content';
            card.appendChild(expandedContent);
        }

        // コンテンツタイプに応じた詳細情報を生成
        const contentType = this.getCardContentType(card);
        expandedContent.innerHTML = this.generateExpandedContent(cardId, contentType);
        
        // フェードインアニメーション
        setTimeout(() => {
            expandedContent.style.opacity = '1';
            expandedContent.style.transform = 'translateY(0)';
        }, 50);
    }

    /**
     * 展開コンテンツを隠す
     */
    hideExpandedContent(card, cardId) {
        const expandedContent = card.querySelector('.expanded-content');
        if (expandedContent) {
            expandedContent.style.opacity = '0';
            expandedContent.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                if (expandedContent.parentNode) {
                    expandedContent.remove();
                }
            }, this.options.animationDuration);
        }
    }

    /**
     * カードの種類を判定
     */
    getCardContentType(card) {
        if (card.classList.contains('os-detail-card-engine')) return 'engine';
        if (card.classList.contains('os-detail-card-interface')) return 'interface';
        if (card.classList.contains('os-detail-card-safemode')) return 'safemode';
        return 'general';
    }

    /**
     * 展開コンテンツを生成
     */
    generateExpandedContent(cardId, contentType) {
        const baseContent = `
            <div class="expanded-tabs">
                <div class="tab-headers">
                    <button class="tab-header active" data-tab="overview">概要</button>
                    <button class="tab-header" data-tab="details">詳細</button>
                    <button class="tab-header" data-tab="advice">アドバイス</button>
                </div>
                <div class="tab-contents">
                    <div class="tab-content active" data-tab="overview">
                        ${this.generateOverviewContent(contentType)}
                    </div>
                    <div class="tab-content" data-tab="details">
                        ${this.generateDetailsContent(contentType)}
                    </div>
                    <div class="tab-content" data-tab="advice">
                        ${this.generateAdviceContent(contentType)}
                    </div>
                </div>
            </div>
            <div class="expanded-actions">
                <button class="btn btn-primary more-info-btn">
                    📚 もっと詳しく
                </button>
                <button class="btn btn-secondary share-btn">
                    📤 この情報を共有
                </button>
            </div>
        `;

        // タブ切り替えイベントを設定
        setTimeout(() => this.initializeTabSystem(cardId), 100);
        
        return baseContent;
    }

    /**
     * 概要コンテンツを生成
     */
    generateOverviewContent(contentType) {
        const contentMap = {
            engine: `
                <h4>🔧 エンジンOSの特徴</h4>
                <p>あなたの根源的な価値観と動機を表すシステムです。創造性、情熱、そして内なる目標がここに現れます。</p>
                <ul>
                    <li>個人の核となる価値観</li>
                    <li>創造的なエネルギーの源泉</li>
                    <li>長期的な人生の方向性</li>
                </ul>
            `,
            interface: `
                <h4>🖥️ インターフェースOSの特徴</h4>
                <p>外部世界との関わり方を表すシステムです。コミュニケーション、行動パターン、社会的な顔がここに現れます。</p>
                <ul>
                    <li>他者との関わり方</li>
                    <li>職場でのコミュニケーションスタイル</li>
                    <li>社会的な表現方法</li>
                </ul>
            `,
            safemode: `
                <h4>🛡️ セーフモードOSの特徴</h4>
                <p>困難な状況での対処方法を表すシステムです。ストレス対応、防御機制、内面の安全装置がここに現れます。</p>
                <ul>
                    <li>ストレス状況での行動パターン</li>
                    <li>心理的な防御メカニズム</li>
                    <li>危機管理とリスク対応</li>
                </ul>
            `
        };

        return contentMap[contentType] || contentMap.engine;
    }

    /**
     * 詳細コンテンツを生成
     */
    generateDetailsContent(contentType) {
        return `
            <h4>📊 詳細分析データ</h4>
            <div class="detail-metrics">
                <div class="metric-item">
                    <span class="metric-label">主要特徴:</span>
                    <span class="metric-value">創造性重視型</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">エネルギー傾向:</span>
                    <span class="metric-value">外向性 85%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">安定性:</span>
                    <span class="metric-value">中程度</span>
                </div>
            </div>
            <p>このOSは特に創造的な場面で力を発揮し、新しいアイデアや解決策を生み出すことに長けています。</p>
        `;
    }

    /**
     * アドバイスコンテンツを生成
     */
    generateAdviceContent(contentType) {
        return `
            <h4>💡 実践的アドバイス</h4>
            <div class="advice-sections">
                <div class="advice-section">
                    <h5>🎯 強みを活かすために</h5>
                    <ul>
                        <li>創造的なプロジェクトに積極的に参加する</li>
                        <li>新しいアイデアを形にする機会を求める</li>
                        <li>チームの発想力を向上させる役割を担う</li>
                    </ul>
                </div>
                <div class="advice-section">
                    <h5>⚠️ 注意すべきポイント</h5>
                    <ul>
                        <li>細かい作業への集中力不足に注意</li>
                        <li>完璧主義に陥らないよう意識する</li>
                        <li>他者の意見にも耳を傾ける</li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * ツールチップシステムを初期化（タスク10.2）
     */
    initializeTooltipSystem() {
        // すべての専門用語を検索してツールチップを設定
        this.addTooltipsToTerms();
        
        // 動的に追加される要素にも対応
        this.setupDynamicTooltips();
    }

    /**
     * 専門用語にツールチップを追加
     */
    addTooltipsToTerms() {
        const textNodes = this.getAllTextNodes();
        
        Object.keys(this.termsDatabase).forEach(term => {
            textNodes.forEach(node => {
                if (node.textContent.includes(term)) {
                    this.wrapTermWithTooltip(node, term);
                }
            });
        });
    }

    /**
     * 用語をツールチップでラップ
     */
    wrapTermWithTooltip(textNode, term) {
        const parent = textNode.parentNode;
        if (parent.classList.contains('tooltip-term')) return; // 既に処理済み

        const content = textNode.textContent;
        const index = content.indexOf(term);
        
        if (index !== -1) {
            const beforeText = content.substring(0, index);
            const afterText = content.substring(index + term.length);
            
            const wrapper = document.createElement('span');
            wrapper.className = 'tooltip-term';
            wrapper.setAttribute('data-term', term);
            wrapper.textContent = term;
            
            if (beforeText) {
                parent.insertBefore(document.createTextNode(beforeText), textNode);
            }
            
            parent.insertBefore(wrapper, textNode);
            
            if (afterText) {
                parent.insertBefore(document.createTextNode(afterText), textNode);
            }
            
            parent.removeChild(textNode);
            
            this.attachTooltipEvents(wrapper, term);
        }
    }

    /**
     * ツールチップイベントを設定
     */
    attachTooltipEvents(element, term) {
        let showTimeout;
        let hideTimeout;

        element.addEventListener('mouseenter', (e) => {
            clearTimeout(hideTimeout);
            showTimeout = setTimeout(() => {
                this.showTooltip(element, term, e);
            }, this.options.tooltipDelay);
        });

        element.addEventListener('mouseleave', () => {
            clearTimeout(showTimeout);
            hideTimeout = setTimeout(() => {
                this.hideTooltip(term);
            }, 100);
        });

        // キーボードアクセシビリティ
        element.addEventListener('focus', (e) => {
            this.showTooltip(element, term, e);
        });

        element.addEventListener('blur', () => {
            this.hideTooltip(term);
        });

        // タッチデバイス対応
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.showTooltip(element, term, e);
        });
    }

    /**
     * ツールチップを表示
     */
    showTooltip(element, term, event) {
        if (this.activeTooltips.has(term)) return;

        const termData = this.termsDatabase[term];
        if (!termData) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-popup';
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <h4>${term}</h4>
                ${termData.reading ? `<span class="tooltip-reading">(${termData.reading})</span>` : ''}
                <span class="tooltip-category">${this.getCategoryLabel(termData.category)}</span>
            </div>
            <div class="tooltip-content">
                <p class="tooltip-description">${termData.description}</p>
                ${termData.context ? `<p class="tooltip-context"><strong>コンテキスト:</strong> ${termData.context}</p>` : ''}
            </div>
        `;

        document.body.appendChild(tooltip);
        this.positionTooltip(tooltip, element, event);
        
        // フェードインアニメーション
        setTimeout(() => {
            tooltip.classList.add('visible');
        }, 10);

        this.activeTooltips.set(term, tooltip);
        
        // アナリティクス
        this.trackEvent('tooltip_shown', { term });
    }

    /**
     * ツールチップを隠す
     */
    hideTooltip(term) {
        const tooltip = this.activeTooltips.get(term);
        if (!tooltip) return;

        tooltip.classList.remove('visible');
        
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
            this.activeTooltips.delete(term);
        }, 200);
    }

    /**
     * ツールチップの位置を調整
     */
    positionTooltip(tooltip, element, event) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // 画面外に出る場合の調整
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        
        if (top < 10) {
            top = rect.bottom + 10;
            tooltip.classList.add('bottom');
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    /**
     * カテゴリラベルを取得
     */
    getCategoryLabel(category) {
        const labels = {
            hexagram: '64卦',
            system: 'システム',
            concept: '概念',
            metric: '指標',
            compatibility: '相性',
            compatibility_type: '相性タイプ'
        };
        return labels[category] || '用語';
    }

    /**
     * タブシステムを初期化（タスク10.3）
     */
    initializeTabSystem(cardId) {
        const tabHeaders = this.container.querySelectorAll(`[data-card-id="${cardId}"] .tab-header`);
        const tabContents = this.container.querySelectorAll(`[data-card-id="${cardId}"] .tab-content`);

        tabHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(cardId, targetTab, tabHeaders, tabContents);
            });
        });

        // 初期タブ状態を保存
        this.tabStates.set(cardId, 'overview');
    }

    /**
     * タブを切り替え
     */
    switchTab(cardId, targetTab, tabHeaders, tabContents) {
        // アクティブなタブを更新
        tabHeaders.forEach(header => {
            header.classList.remove('active');
            if (header.dataset.tab === targetTab) {
                header.classList.add('active');
            }
        });

        // アクティブなコンテンツを更新
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.dataset.tab === targetTab) {
                content.classList.add('active');
            }
        });

        // 状態を保存
        this.tabStates.set(cardId, targetTab);
        
        // アナリティクス
        this.trackEvent('tab_switched', { cardId, targetTab });
    }

    /**
     * 動的ツールチップを設定
     */
    setupDynamicTooltips() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.addTooltipsToElement(node);
                    }
                });
            });
        });

        observer.observe(this.container, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 要素にツールチップを追加
     */
    addTooltipsToElement(element) {
        const textNodes = this.getAllTextNodes(element);
        Object.keys(this.termsDatabase).forEach(term => {
            textNodes.forEach(node => {
                if (node.textContent.includes(term)) {
                    this.wrapTermWithTooltip(node, term);
                }
            });
        });
    }

    /**
     * すべてのテキストノードを取得
     */
    getAllTextNodes(root = this.container) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }

        return textNodes;
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // ESCキーでカードを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.collapseAllCards();
            }
        });

        // ウィンドウリサイズ時のツールチップ調整
        window.addEventListener('resize', () => {
            this.activeTooltips.forEach((tooltip, term) => {
                this.hideTooltip(term);
            });
        });
    }

    /**
     * すべてのカードを閉じる
     */
    collapseAllCards() {
        const expandedCardIds = Array.from(this.expandedCards);
        expandedCardIds.forEach(cardId => {
            const card = this.container.querySelector(`[data-card-id="${cardId}"]`);
            if (card) {
                this.collapseCard(card, cardId);
            }
        });
    }

    /**
     * メッセージを表示
     */
    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `interactive-message ${type}`;
        messageElement.textContent = message;
        
        this.container.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.classList.add('visible');
        }, 10);

        setTimeout(() => {
            messageElement.classList.remove('visible');
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 3000);
    }

    /**
     * イベントトラッキング
     */
    trackEvent(eventName, properties = {}) {
        console.log(`📊 Event tracked: ${eventName}`, properties);
        // 実際のアナリティクスサービスとの連携はここで実装
    }

    /**
     * インタラクティブシステムを有効化
     */
    activate() {
        if (this.options.enableCardExpansion) {
            this.initializeCardExpansion();
        }
        
        if (this.options.enableTooltips) {
            this.initializeTooltipSystem();
        }
        
        console.log("✅ Interactive System activated");
    }

    /**
     * システムを破棄
     */
    destroy() {
        // すべてのツールチップを削除
        this.activeTooltips.forEach((tooltip, term) => {
            this.hideTooltip(term);
        });
        
        // すべてのカードを閉じる
        this.collapseAllCards();
        
        super.destroy();
    }
}

export default InteractiveSystem;