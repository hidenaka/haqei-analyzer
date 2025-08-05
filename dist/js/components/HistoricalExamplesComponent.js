// HistoricalExamplesComponent.js - 歴史上の人物例表示コンポーネント

class HistoricalExamplesComponent {
    constructor(container) {
        this.container = container;
        this.database = window.HistoricalFiguresDatabase;
        this.isVisible = false;
        
        this.init();
    }

    init() {
        this.createToggleButton();
        this.createContentContainer();
        this.bindEvents();
    }

    createToggleButton() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'historical-examples-toggle';
        this.toggleButton.innerHTML = '📚 歴史上の人物例を見る';
        this.toggleButton.style.cssText = `
            background: linear-gradient(135deg, #8B4513 0%, #D2B48C 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            margin: 10px 0;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        this.container.appendChild(this.toggleButton);
    }

    createContentContainer() {
        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'historical-examples-content';
        this.contentContainer.style.cssText = `
            display: none;
            background: #fdfdf5;
            border: 2px solid #D2B48C;
            border-radius: 12px;
            padding: 20px;
            margin: 15px 0;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
        `;
        
        this.container.appendChild(this.contentContainer);
    }

    bindEvents() {
        this.toggleButton.addEventListener('click', () => {
            this.toggleVisibility();
        });

        // ホバーエフェクト
        this.toggleButton.addEventListener('mouseenter', () => {
            this.toggleButton.style.transform = 'translateY(-2px)';
            this.toggleButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });

        this.toggleButton.addEventListener('mouseleave', () => {
            this.toggleButton.style.transform = 'translateY(0)';
            this.toggleButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
    }

    toggleVisibility() {
        this.isVisible = !this.isVisible;
        
        if (this.isVisible) {
            this.contentContainer.style.display = 'block';
            this.toggleButton.innerHTML = '📚 歴史上の人物例を隠す';
            this.contentContainer.style.animation = 'fadeIn 0.3s ease';
        } else {
            this.contentContainer.style.display = 'none';
            this.toggleButton.innerHTML = '📚 歴史上の人物例を見る';
        }
    }

    displayExamplesForHexagram(hexagramId, hexagramName) {
        if (!this.database) {
            this.displayError('歴史上の人物例データベースが利用できません');
            return;
        }

        const educational = this.database.generateEducationalContent(hexagramId);
        
        let content = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #8B4513; margin: 0; font-size: 1.2em;">
                    🏛️ ${hexagramName} の歴史上の人物例
                </h3>
            </div>
        `;

        if (educational.title) {
            content += `
                <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #8B4513;">
                    <h4 style="color: #8B4513; margin-top: 0;">${educational.title}</h4>
                    <p style="color: #5D4037; line-height: 1.6; margin: 10px 0;">${educational.description}</p>
                    
                    <div style="margin: 15px 0;">
                        <strong style="color: #8B4513;">特徴的な資質：</strong>
                        <ul style="margin: 5px 0; padding-left: 20px;">
                            ${educational.traits.map(trait => `<li style="color: #5D4037; margin: 5px 0;">${trait}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="background: #f5f5f0; padding: 10px; border-radius: 6px; margin: 15px 0;">
                        <strong style="color: #8B4513;">学習ポイント：</strong>
                        <ul style="margin: 5px 0; padding-left: 20px;">
                            ${educational.learningPoints.map(point => `<li style="color: #5D4037; margin: 5px 0; font-size: 0.9em;">${point}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        } else {
            content += `
                <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
                    <p style="color: #8B4513; font-style: italic;">${educational.message}</p>
                    <p style="color: #5D4037; font-size: 0.9em; margin-top: 10px;">${educational.suggestion}</p>
                </div>
            `;
        }

        // プライバシー配慮の注意書き
        const guidelines = this.database.getPrivacyGuidelines();
        content += `
            <div style="background: #fff3e0; border: 1px solid #ffcc80; padding: 12px; border-radius: 6px; margin-top: 15px;">
                <p style="color: #ef6c00; font-size: 0.85em; margin: 0; line-height: 1.4;">
                    <strong>⚠️ ご注意：</strong> ${guidelines.disclaimer}
                </p>
            </div>
        `;

        this.contentContainer.innerHTML = content;
    }

    displayCompatibilityExamples(compatibilityType) {
        if (!this.database) {
            this.displayError('歴史上の人物例データベースが利用できません');
            return;
        }

        const examples = this.database.getCompatibilityExamples(compatibilityType);
        
        let content = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #8B4513; margin: 0; font-size: 1.2em;">
                    🤝 ${compatibilityType}タイプの歴史的関係例
                </h3>
            </div>
        `;

        if (examples.length > 0) {
            examples.forEach(example => {
                content += `
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #8B4513;">
                        <h4 style="color: #8B4513; margin-top: 0;">${example.pair}</h4>
                        <p style="color: #5D4037; margin: 8px 0;"><strong>パターン：</strong> ${example.pattern}</p>
                        <p style="color: #5D4037; line-height: 1.6; margin: 10px 0;">${example.description}</p>
                        <div style="background: #f5f5f0; padding: 8px; border-radius: 4px; margin-top: 10px;">
                            <span style="color: #8B4513; font-size: 0.85em; font-weight: bold;">相性タイプ: ${example.compatibility_type}</span>
                        </div>
                    </div>
                `;
            });
        } else {
            content += `
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                    <p style="color: #8B4513; font-style: italic;">この相性タイプの歴史的事例は現在準備中です</p>
                    <p style="color: #5D4037; font-size: 0.9em; margin-top: 10px;">あなた自身の経験から、似たような関係性について考えてみましょう</p>
                </div>
            `;
        }

        // プライバシー配慮の注意書き
        const guidelines = this.database.getPrivacyGuidelines();
        content += `
            <div style="background: #fff3e0; border: 1px solid #ffcc80; padding: 12px; border-radius: 6px; margin-top: 15px;">
                <p style="color: #ef6c00; font-size: 0.85em; margin: 0; line-height: 1.4;">
                    <strong>⚠️ ご注意：</strong> ${guidelines.disclaimer}
                </p>
            </div>
        `;

        this.contentContainer.innerHTML = content;
    }

    displayRandomExample() {
        if (!this.database) {
            this.displayError('歴史上の人物例データベースが利用できません');
            return;
        }

        const example = this.database.getRandomExample();
        
        let content = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #8B4513; margin: 0; font-size: 1.2em;">
                    🎲 ランダムな歴史上の人物例
                </h3>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #8B4513;">
                <h4 style="color: #8B4513; margin-top: 0;">${example.name}（${example.era}）</h4>
                <p style="color: #5D4037; line-height: 1.6; margin: 10px 0;">${example.description}</p>
                
                <div style="margin: 15px 0;">
                    <strong style="color: #8B4513;">特徴的な資質：</strong>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        ${example.traits.map(trait => `<li style="color: #5D4037; margin: 5px 0;">${trait}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="background: #f5f5f0; padding: 10px; border-radius: 6px; margin: 15px 0;">
                    <p style="color: #8B4513; font-size: 0.9em; margin: 0;"><strong>OSパターン：</strong> ${example.osPattern}</p>
                </div>
            </div>
        `;

        // プライバシー配慮の注意書き
        const guidelines = this.database.getPrivacyGuidelines();
        content += `
            <div style="background: #fff3e0; border: 1px solid #ffcc80; padding: 12px; border-radius: 6px; margin-top: 15px;">
                <p style="color: #ef6c00; font-size: 0.85em; margin: 0; line-height: 1.4;">
                    <strong>⚠️ ご注意：</strong> ${guidelines.disclaimer}
                </p>
            </div>
        `;

        this.contentContainer.innerHTML = content;
    }

    displayError(message) {
        this.contentContainer.innerHTML = `
            <div style="background: #ffebee; border: 1px solid #f44336; padding: 15px; border-radius: 8px; text-align: center;">
                <p style="color: #c62828; margin: 0;">❌ ${message}</p>
            </div>
        `;
    }

    hide() {
        if (this.isVisible) {
            this.toggleVisibility();
        }
    }

    show() {
        if (!this.isVisible) {
            this.toggleVisibility();
        }
    }
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoricalExamplesComponent;
} else if (typeof window !== 'undefined') {
    window.HistoricalExamplesComponent = HistoricalExamplesComponent;
}