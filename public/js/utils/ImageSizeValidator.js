/**
 * 画像サイズバリデーター
 * Claude APIの制限（8000px）に対応するためのユーティリティ
 */
class ImageSizeValidator {
    static MAX_DIMENSION = 7500; // APIの制限より少し小さく設定
    static SAFE_DIMENSION = 4000; // 安全なデフォルトサイズ

    /**
     * 画像またはCanvasのサイズを検証し、必要に応じてリサイズ
     * @param {HTMLImageElement|HTMLCanvasElement} source - 画像またはCanvas要素
     * @param {Object} options - オプション
     * @returns {HTMLCanvasElement} - リサイズされたCanvas
     */
    static validateAndResize(source, options = {}) {
        const maxDimension = options.maxDimension || this.MAX_DIMENSION;
        const quality = options.quality || 0.9;

        // 現在のサイズを取得
        const width = source.width || source.naturalWidth;
        const height = source.height || source.naturalHeight;

        // サイズチェック
        if (width <= maxDimension && height <= maxDimension) {
            // リサイズ不要な場合
            if (source instanceof HTMLCanvasElement) {
                return source;
            }
            // 画像の場合はCanvasに変換
            return this.imageToCanvas(source);
        }

        // リサイズが必要な場合
        const scale = Math.min(maxDimension / width, maxDimension / height);
        const newWidth = Math.floor(width * scale);
        const newHeight = Math.floor(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(source, 0, 0, newWidth, newHeight);

        return canvas;
    }

    /**
     * Canvas作成時のサイズを制限
     * @param {number} requestedWidth - 要求された幅
     * @param {number} requestedHeight - 要求された高さ
     * @param {number} dpr - デバイスピクセル比
     * @returns {Object} - 制限されたサイズ
     */
    static limitCanvasSize(requestedWidth, requestedHeight, dpr = 1) {
        const maxDimension = this.SAFE_DIMENSION;
        
        // DPRを考慮した実際のピクセルサイズ
        const actualWidth = requestedWidth * dpr;
        const actualHeight = requestedHeight * dpr;

        // サイズチェック
        if (actualWidth <= maxDimension && actualHeight <= maxDimension) {
            return {
                width: actualWidth,
                height: actualHeight,
                scale: dpr
            };
        }

        // スケール調整
        const scale = Math.min(
            maxDimension / actualWidth,
            maxDimension / actualHeight
        );

        return {
            width: Math.floor(actualWidth * scale),
            height: Math.floor(actualHeight * scale),
            scale: dpr * scale
        };
    }

    /**
     * Base64画像のサイズをチェック
     * @param {string} base64String - Base64エンコードされた画像
     * @returns {Promise<Object>} - サイズ情報
     */
    static async checkBase64ImageSize(base64String) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    isValid: img.naturalWidth <= this.MAX_DIMENSION && 
                            img.naturalHeight <= this.MAX_DIMENSION
                });
            };
            img.onerror = reject;
            img.src = base64String;
        });
    }

    /**
     * 画像をCanvasに変換
     * @param {HTMLImageElement} img - 画像要素
     * @returns {HTMLCanvasElement} - Canvas要素
     */
    static imageToCanvas(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        return canvas;
    }

    /**
     * CanvasをBase64に変換（サイズ制限付き）
     * @param {HTMLCanvasElement} canvas - Canvas要素
     * @param {Object} options - オプション
     * @returns {string} - Base64文字列
     */
    static canvasToBase64(canvas, options = {}) {
        const format = options.format || 'image/jpeg';
        const quality = options.quality || 0.9;

        // サイズチェックとリサイズ
        const validatedCanvas = this.validateAndResize(canvas, options);
        
        return validatedCanvas.toDataURL(format, quality);
    }
}

// グローバルに公開
if (typeof window !== 'undefined') {
    window.ImageSizeValidator = ImageSizeValidator;
}