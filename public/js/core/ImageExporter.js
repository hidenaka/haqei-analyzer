// ImageExporter.js - 画像保存機能
// HaQei Analyzer - Image Export System

class ImageExporter {
    constructor(options = {}) {
        this.options = {
            format: 'png',
            quality: 0.9,
            backgroundColor: '#ffffff',
            scale: 2,
            includeWatermark: true,
            watermarkText: 'HaQei Analyzer',
            watermarkOpacity: 0.1,
            maxWidth: 1200,
            maxHeight: 1600,
            socialMediaFormats: {
                twitter: { width: 1200, height: 630 },
                instagram: { width: 1080, height: 1080 },
                facebook: { width: 1200, height: 630 },
                linkedin: { width: 1200, height: 627 }
            },
            ...options
        };
        
        this.isHtml2CanvasLoaded = false;
        this.initializeHtml2Canvas();
    }

    /**
     * html2canvasライブラリを初期化
     */
    async initializeHtml2Canvas() {
        try {
            // html2canvasが既に読み込まれているかチェック
            if (typeof window.html2canvas !== 'undefined') {
                this.isHtml2CanvasLoaded = true;
                return;
            }

            // CDNからhtml2canvasを動的に読み込み
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            
            this.isHtml2CanvasLoaded = true;
            console.log("✅ html2canvas loaded successfully");
            
        } catch (error) {
            console.error("❌ Failed to load html2canvas:", error);
            this.isHtml2CanvasLoaded = false;
        }
    }

    /**
     * スクリプトを動的に読み込み
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * 結果画面を画像として保存
     * @param {string|HTMLElement} element - キャプチャする要素
     * @param {Object} options - エクスポートオプション
     * @returns {Promise<Object>} 結果オブジェクト
     */
    async exportToImage(element, options = {}) {
        if (!this.isHtml2CanvasLoaded) {
            throw new Error('html2canvas not loaded');
        }

        const config = { ...this.options, ...options };
        
        try {
            // 要素を取得
            const targetElement = typeof element === 'string' ? 
                document.querySelector(element) : element;
                
            if (!targetElement) {
                throw new Error('Target element not found');
            }

            // 元の表示状態を保存
            const originalStyle = this.prepareElementForCapture(targetElement);
            
            // キャプチャを実行
            const canvas = await html2canvas(targetElement, {
                backgroundColor: config.backgroundColor,
                scale: config.scale,
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: config.maxWidth,
                height: config.maxHeight,
                scrollX: 0,
                scrollY: 0
            });

            // 元のスタイルを復元
            this.restoreElementStyle(targetElement, originalStyle);

            // 透かしを追加
            if (config.includeWatermark) {
                this.addWatermark(canvas, config);
            }

            // 画像データを生成
            const imageData = canvas.toDataURL(`image/${config.format}`, config.quality);
            
            console.log("✅ Image captured successfully");
            return {
                success: true,
                canvas: canvas,
                dataURL: imageData,
                blob: await this.dataURLToBlob(imageData),
                width: canvas.width,
                height: canvas.height
            };
            
        } catch (error) {
            console.error("❌ Failed to export image:", error);
            throw error;
        }
    }

    /**
     * 要素をキャプチャ用に準備
     */
    prepareElementForCapture(element) {
        const originalStyle = {
            position: element.style.position,
            left: element.style.left,
            top: element.style.top,
            zIndex: element.style.zIndex,
            transform: element.style.transform
        };

        // キャプチャしやすいようにスタイルを調整
        element.style.position = 'relative';
        element.style.left = '0';
        element.style.top = '0';
        element.style.zIndex = '9999';
        element.style.transform = 'none';

        return originalStyle;
    }

    /**
     * 要素のスタイルを復元
     */
    restoreElementStyle(element, originalStyle) {
        Object.keys(originalStyle).forEach(key => {
            element.style[key] = originalStyle[key] || '';
        });
    }

    /**
     * 透かしを追加
     */
    addWatermark(canvas, config) {
        const ctx = canvas.getContext('2d');
        
        // 透かし設定
        ctx.save();
        ctx.globalAlpha = config.watermarkOpacity;
        ctx.fillStyle = '#666666';
        ctx.font = `${Math.floor(canvas.width * 0.02)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 透かしテキストを描画
        ctx.fillText(
            config.watermarkText,
            canvas.width / 2,
            canvas.height - 30
        );
        
        ctx.restore();
    }

    /**
     * dataURLをBlobに変換
     */
    async dataURLToBlob(dataURL) {
        return new Promise((resolve) => {
            const arr = dataURL.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            resolve(new Blob([u8arr], { type: mime }));
        });
    }

    /**
     * 画像をダウンロード
     */
    async downloadImage(element, filename = null, options = {}) {
        try {
            const result = await this.exportToImage(element, options);
            
            if (!filename) {
                const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
                filename = `HaQei_診断結果_${timestamp}.${this.options.format}`;
            }
            
            // ダウンロードを実行
            const url = URL.createObjectURL(result.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log("✅ Image downloaded successfully:", filename);
            return { success: true, filename, ...result };
            
        } catch (error) {
            console.error("❌ Failed to download image:", error);
            return { success: false, error: error.message };
        }
    }

    /**
     * SNS用画像を生成
     */
    async generateSocialMediaImage(element, platform, options = {}) {
        const socialConfig = this.options.socialMediaFormats[platform];
        if (!socialConfig) {
            throw new Error(`Unsupported platform: ${platform}`);
        }

        try {
            // プラットフォーム用の特別な処理
            const optimizedElement = await this.optimizeForSocialMedia(element, platform);
            
            const config = {
                ...options,
                maxWidth: socialConfig.width,
                maxHeight: socialConfig.height,
                scale: 1,
                backgroundColor: platform === 'twitter' ? '#1da1f2' : this.options.backgroundColor
            };

            const result = await this.exportToImage(optimizedElement, config);
            
            // リサイズ処理
            const resizedCanvas = this.resizeCanvas(result.canvas, socialConfig.width, socialConfig.height);
            const resizedDataURL = resizedCanvas.toDataURL(`image/${this.options.format}`, this.options.quality);
            const resizedBlob = await this.dataURLToBlob(resizedDataURL);
            
            return {
                success: true,
                canvas: resizedCanvas,
                dataURL: resizedDataURL,
                blob: resizedBlob,
                width: socialConfig.width,
                height: socialConfig.height,
                platform: platform
            };
            
        } catch (error) {
            console.error(`❌ Failed to generate ${platform} image:`, error);
            throw error;
        }
    }

    /**
     * SNS用に要素を最適化
     */
    async optimizeForSocialMedia(element, platform) {
        // プラットフォーム別の最適化処理
        const clonedElement = element.cloneNode(true);
        
        switch (platform) {
            case 'twitter':
                // Twitterカード用の最適化
                this.addSocialMediaHeader(clonedElement, 'Twitter共有用');
                break;
            case 'instagram':
                // Instagram用の最適化
                this.addSocialMediaHeader(clonedElement, 'Instagram共有用');
                break;
            case 'facebook':
                // Facebook用の最適化
                this.addSocialMediaHeader(clonedElement, 'Facebook共有用');
                break;
            case 'linkedin':
                // LinkedIn用の最適化
                this.addSocialMediaHeader(clonedElement, 'LinkedIn共有用');
                break;
        }
        
        return clonedElement;
    }

    /**
     * SNS用ヘッダーを追加
     */
    addSocialMediaHeader(element, text) {
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
        `;
        header.textContent = text;
        
        element.insertBefore(header, element.firstChild);
    }

    /**
     * キャンバスをリサイズ
     */
    resizeCanvas(sourceCanvas, targetWidth, targetHeight) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // 背景色を設定
        ctx.fillStyle = this.options.backgroundColor;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        
        // アスペクト比を維持してリサイズ
        const sourceRatio = sourceCanvas.width / sourceCanvas.height;
        const targetRatio = targetWidth / targetHeight;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (sourceRatio > targetRatio) {
            // 幅に合わせる
            drawWidth = targetWidth;
            drawHeight = targetWidth / sourceRatio;
            drawX = 0;
            drawY = (targetHeight - drawHeight) / 2;
        } else {
            // 高さに合わせる
            drawHeight = targetHeight;
            drawWidth = targetHeight * sourceRatio;
            drawX = (targetWidth - drawWidth) / 2;
            drawY = 0;
        }
        
        ctx.drawImage(sourceCanvas, drawX, drawY, drawWidth, drawHeight);
        
        return canvas;
    }

    /**
     * 複数形式で一括エクスポート
     */
    async exportMultipleFormats(element, baseFilename = null) {
        const formats = ['png', 'jpeg'];
        const results = [];
        
        if (!baseFilename) {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            baseFilename = `HaQei_診断結果_${timestamp}`;
        }

        for (const format of formats) {
            try {
                const options = { ...this.options, format };
                const result = await this.downloadImage(element, `${baseFilename}.${format}`, options);
                results.push({ format, ...result });
            } catch (error) {
                results.push({ format, success: false, error: error.message });
            }
        }

        return results;
    }

    /**
     * チャート専用エクスポート
     */
    async exportChart(chartElement, title = '', options = {}) {
        const config = {
            backgroundColor: 'transparent',
            scale: 3,
            ...options
        };

        try {
            // チャートコンテナを作成
            const container = this.createChartContainer(chartElement, title);
            document.body.appendChild(container);
            
            const result = await this.exportToImage(container, config);
            
            // コンテナを削除
            document.body.removeChild(container);
            
            return result;
            
        } catch (error) {
            console.error("❌ Failed to export chart:", error);
            throw error;
        }
    }

    /**
     * チャート用コンテナを作成
     */
    createChartContainer(chartElement, title) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 9999;
        `;
        
        if (title) {
            const titleElement = document.createElement('h3');
            titleElement.textContent = title;
            titleElement.style.cssText = `
                margin: 0 0 20px 0;
                text-align: center;
                color: #333;
                font-family: Arial, sans-serif;
            `;
            container.appendChild(titleElement);
        }
        
        const clonedChart = chartElement.cloneNode(true);
        container.appendChild(clonedChart);
        
        return container;
    }

    /**
     * バッチ処理でSNS用画像を生成
     */
    async generateAllSocialMediaImages(element, baseFilename = null) {
        const platforms = Object.keys(this.options.socialMediaFormats);
        const results = [];
        
        if (!baseFilename) {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            baseFilename = `HaQei_SNS_${timestamp}`;
        }

        for (const platform of platforms) {
            try {
                const result = await this.generateSocialMediaImage(element, platform);
                
                // ダウンロード
                const filename = `${baseFilename}_${platform}.${this.options.format}`;
                const url = URL.createObjectURL(result.blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                results.push({ platform, success: true, filename, ...result });
                
            } catch (error) {
                results.push({ platform, success: false, error: error.message });
            }
        }

        return results;
    }

    /**
     * システム破棄
     */
    destroy() {
        this.isHtml2CanvasLoaded = false;
        console.log("🖼️ ImageExporter destroyed");
    }
}

export default ImageExporter;