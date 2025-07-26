// PDFExporter.js - PDF出力機能
// HaQei Analyzer - PDF Export System

class PDFExporter {
    constructor(options = {}) {
        this.options = {
            pageFormat: 'A4',
            orientation: 'portrait',
            margins: { top: 20, right: 20, bottom: 20, left: 20 },
            fontSize: 12,
            fontFamily: 'Helvetica',
            includeCharts: true,
            includeAnalysis: true,
            includeRecommendations: true,
            watermark: '',
            ...options
        };
        
        this.isJsPDFLoaded = false;
        this.initializeJsPDF();
    }

    /**
     * jsPDFライブラリを初期化
     */
    async initializeJsPDF() {
        try {
            // jsPDFが既に読み込まれているかチェック
            if (typeof window.jsPDF !== 'undefined') {
                this.isJsPDFLoaded = true;
                return;
            }

            // CDNからjsPDFを動的に読み込み
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            
            // html2canvasも読み込む（チャート画像化用）
            if (this.options.includeCharts) {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            }
            
            this.isJsPDFLoaded = true;
            console.log("✅ PDF libraries loaded successfully");
            
        } catch (error) {
            console.error("❌ Failed to load PDF libraries:", error);
            this.isJsPDFLoaded = false;
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
     * 診断結果をPDFとして出力
     * @param {Object} analysisResult - 分析結果データ
     * @param {Object} additionalData - 追加データ（高度分析結果など）
     * @returns {Promise<Blob>} PDF Blob
     */
    async exportToPDF(analysisResult, additionalData = {}) {
        if (!this.isJsPDFLoaded) {
            throw new Error('PDF libraries not loaded');
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: this.options.orientation,
                unit: 'mm',
                format: this.options.pageFormat
            });

            // フォント設定
            doc.setFont(this.options.fontFamily);
            doc.setFontSize(this.options.fontSize);

            let currentY = this.options.margins.top;

            // ヘッダー
            currentY = this.addHeader(doc, currentY);
            
            // 基本情報
            currentY = this.addBasicInfo(doc, analysisResult, currentY);
            
            // OS詳細情報
            currentY = this.addOSDetails(doc, analysisResult, currentY);
            
            // 8次元分析
            if (this.options.includeAnalysis && analysisResult.eightDimensionAnalysis) {
                currentY = this.addEightDimensionAnalysis(doc, analysisResult, currentY);
            }
            
            // 高度相性分析
            if (additionalData.advancedCompatibility) {
                currentY = this.addAdvancedCompatibilityAnalysis(doc, additionalData.advancedCompatibility, currentY);
            }
            
            // 推奨事項
            if (this.options.includeRecommendations) {
                currentY = this.addRecommendations(doc, analysisResult, currentY);
            }
            
            // フッター
            this.addFooter(doc);
            
            // PDFを生成して返す
            const pdfBlob = doc.output('blob');
            return pdfBlob;
            
        } catch (error) {
            console.error("❌ Failed to generate PDF:", error);
            throw error;
        }
    }

    /**
     * ヘッダーを追加
     */
    addHeader(doc, y) {
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // タイトル
        doc.setFontSize(20);
        doc.setFont(this.options.fontFamily, 'bold');
        doc.text('HaQei Analyzer - 3層人格OS診断結果', pageWidth / 2, y, { align: 'center' });
        
        y += 15;
        
        // 生成日時
        doc.setFontSize(10);
        doc.setFont(this.options.fontFamily, 'normal');
        const now = new Date().toLocaleString('ja-JP');
        doc.text(`生成日時: ${now}`, pageWidth / 2, y, { align: 'center' });
        
        y += 15;
        
        // 区切り線
        doc.setLineWidth(0.5);
        doc.line(this.options.margins.left, y, pageWidth - this.options.margins.right, y);
        
        return y + 10;
    }

    /**
     * 基本情報を追加
     */
    addBasicInfo(doc, analysisResult, y) {
        doc.setFontSize(16);
        doc.setFont(this.options.fontFamily, 'bold');
        doc.text('診断概要', this.options.margins.left, y);
        
        y += 10;
        doc.setFontSize(12);
        doc.setFont(this.options.fontFamily, 'normal');
        
        // 一貫性スコア
        const overallScore = Math.round((analysisResult.consistencyScore?.overall || 0) * 100);
        doc.text(`人格一貫性スコア: ${overallScore}%`, this.options.margins.left, y);
        
        y += 8;
        
        // 一貫性の説明
        const consistencyDescription = this.getConsistencyDescription(overallScore);
        const consistencyLines = doc.splitTextToSize(consistencyDescription, 160);
        doc.text(consistencyLines, this.options.margins.left, y);
        
        return y + (consistencyLines.length * 6) + 10;
    }

    /**
     * OS詳細情報を追加
     */
    addOSDetails(doc, analysisResult, y) {
        const osTypes = [
            { data: analysisResult.engineOS, title: 'エンジンOS（核となる価値観・動機）', icon: '🔧' },
            { data: analysisResult.interfaceOS, title: 'インターフェースOS（外面的な行動パターン）', icon: '🖥️' },
            { data: analysisResult.safeModeOS, title: 'セーフモードOS（内面的な防御機制）', icon: '🛡️' }
        ];

        for (const osType of osTypes) {
            // ページ区切りチェック
            if (y > 250) {
                doc.addPage();
                y = this.options.margins.top;
            }

            doc.setFontSize(14);
            doc.setFont(this.options.fontFamily, 'bold');
            doc.text(`${osType.icon} ${osType.title}`, this.options.margins.left, y);
            
            y += 10;
            
            doc.setFontSize(12);
            doc.setFont(this.options.fontFamily, 'normal');
            
            // 64卦名
            const hexagramName = osType.data.hexagramInfo?.name || '不明';
            doc.text(`64卦: ${hexagramName}`, this.options.margins.left + 5, y);
            
            y += 8;
            
            // キャッチフレーズ
            const catchphrase = osType.data.hexagramInfo?.catchphrase || 'キャッチフレーズなし';
            doc.text(`特徴: ${catchphrase}`, this.options.margins.left + 5, y);
            
            y += 8;
            
            // 説明
            const description = osType.data.hexagramInfo?.description || '説明なし';
            const descriptionLines = doc.splitTextToSize(description, 150);
            doc.text(descriptionLines, this.options.margins.left + 5, y);
            
            y += (descriptionLines.length * 6) + 10;
        }

        return y;
    }

    /**
     * 8次元分析を追加
     */
    addEightDimensionAnalysis(doc, analysisResult, y) {
        // ページ区切りチェック
        if (y > 200) {
            doc.addPage();
            y = this.options.margins.top;
        }

        doc.setFontSize(16);
        doc.setFont(this.options.fontFamily, 'bold');
        doc.text('8次元プロファイル分析', this.options.margins.left, y);
        
        y += 15;
        
        doc.setFontSize(12);
        doc.setFont(this.options.fontFamily, 'normal');
        
        // 8次元の値を表示（エンジンOSのuserVectorから）
        if (analysisResult.engineOS?.userVector) {
            const dimensions = Object.entries(analysisResult.engineOS.userVector);
            
            dimensions.forEach(([key, value]) => {
                const dimensionName = key.replace('dimension_', '次元');
                const percentage = Math.round(value * 100);
                
                doc.text(`${dimensionName}: ${percentage}%`, this.options.margins.left + 5, y);
                
                // 簡易バー表示
                const barWidth = (percentage / 100) * 80;
                doc.setFillColor(70, 130, 180);
                doc.rect(this.options.margins.left + 60, y - 3, barWidth, 4, 'F');
                
                y += 8;
            });
        }

        return y + 10;
    }

    /**
     * 高度相性分析を追加
     */
    addAdvancedCompatibilityAnalysis(doc, advancedAnalysis, y) {
        // ページ区切りチェック
        if (y > 180) {
            doc.addPage();
            y = this.options.margins.top;
        }

        doc.setFontSize(16);
        doc.setFont(this.options.fontFamily, 'bold');
        doc.text('高度相性分析', this.options.margins.left, y);
        
        y += 15;
        
        // チーム効果性スコア
        const effectiveness = Math.round(advancedAnalysis.overallAssessment.teamEffectiveness * 100);
        doc.setFontSize(14);
        doc.text(`内的チーム効果性: ${effectiveness}%`, this.options.margins.left, y);
        
        y += 12;
        
        // 強みエリア
        doc.setFontSize(12);
        doc.setFont(this.options.fontFamily, 'bold');
        doc.text('強みエリア:', this.options.margins.left, y);
        
        y += 8;
        doc.setFont(this.options.fontFamily, 'normal');
        
        advancedAnalysis.overallAssessment.strengthAreas.forEach(strength => {
            doc.text(`• ${strength}`, this.options.margins.left + 5, y);
            y += 6;
        });
        
        y += 5;
        
        // 成長エリア
        doc.setFont(this.options.fontFamily, 'bold');
        doc.text('成長エリア:', this.options.margins.left, y);
        
        y += 8;
        doc.setFont(this.options.fontFamily, 'normal');
        
        advancedAnalysis.overallAssessment.growthAreas.forEach(growth => {
            doc.text(`• ${growth}`, this.options.margins.left + 5, y);
            y += 6;
        });

        // 特殊パターンがあれば表示
        if (advancedAnalysis.specialPattern) {
            y += 10;
            doc.setFont(this.options.fontFamily, 'bold');
            doc.text('特殊パターン:', this.options.margins.left, y);
            
            y += 8;
            doc.setFont(this.options.fontFamily, 'normal');
            doc.text(`${advancedAnalysis.specialPattern.name}`, this.options.margins.left + 5, y);
            
            y += 6;
            const patternDesc = doc.splitTextToSize(advancedAnalysis.specialPattern.description, 150);
            doc.text(patternDesc, this.options.margins.left + 5, y);
            y += (patternDesc.length * 6);
        }

        return y + 10;
    }

    /**
     * 推奨事項を追加
     */
    addRecommendations(doc, analysisResult, y) {
        // ページ区切りチェック
        if (y > 200) {
            doc.addPage();
            y = this.options.margins.top;
        }

        doc.setFontSize(16);
        doc.setFont(this.options.fontFamily, 'bold');
        doc.text('推奨事項', this.options.margins.left, y);
        
        y += 15;
        
        doc.setFontSize(12);
        doc.setFont(this.options.fontFamily, 'normal');
        
        // 統合洞察から推奨事項を取得
        if (analysisResult.integration?.recommendations) {
            analysisResult.integration.recommendations.forEach((rec, index) => {
                if (y > 270) {
                    doc.addPage();
                    y = this.options.margins.top;
                }
                
                doc.text(`${index + 1}. ${rec}`, this.options.margins.left, y);
                y += 8;
            });
        }

        return y + 10;
    }

    /**
     * フッターを追加
     */
    addFooter(doc) {
        const pageCount = doc.internal.getNumberOfPages();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont(this.options.fontFamily, 'normal');
            
            // ページ番号
            doc.text(`${i} / ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            
            // 透かし
            if (this.options.watermark) {
                doc.setTextColor(200, 200, 200);
                doc.text(this.options.watermark, pageWidth / 2, pageHeight / 2, { 
                    align: 'center',
                    angle: 45
                });
                doc.setTextColor(0, 0, 0);
            }
            
            // システム名
            doc.text('HaQei Analyzer', pageWidth - this.options.margins.right, pageHeight - 10, { align: 'right' });
        }
    }

    /**
     * 一貫性スコアの説明を取得
     */
    getConsistencyDescription(score) {
        if (score >= 80) {
            return '非常に高い一貫性を示しており、内面と外面が調和した安定した人格構造です。';
        } else if (score >= 60) {
            return '良い一貫性を示しており、概ね安定した人格構造を持っています。';
        } else if (score >= 40) {
            return '中程度の一貫性を示しており、状況に応じて柔軟性を発揮する人格構造です。';
        } else {
            return '多様性に富んだ人格構造を示しており、複雑で多面的な特徴があります。';
        }
    }

    /**
     * PDF保存を実行
     */
    async savePDF(analysisResult, additionalData = {}, filename = null) {
        try {
            const pdfBlob = await this.exportToPDF(analysisResult, additionalData);
            
            // ファイル名を生成
            if (!filename) {
                const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
                filename = `HaQei_診断結果_${timestamp}.pdf`;
            }
            
            // ダウンロードを実行
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log("✅ PDF saved successfully:", filename);
            return { success: true, filename };
            
        } catch (error) {
            console.error("❌ Failed to save PDF:", error);
            return { success: false, error: error.message };
        }
    }

    /**
     * チャートを画像として取得
     */
    async captureChart(chartElement) {
        if (!this.options.includeCharts || typeof html2canvas === 'undefined') {
            return null;
        }

        try {
            const canvas = await html2canvas(chartElement, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false
            });
            
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error("❌ Failed to capture chart:", error);
            return null;
        }
    }

    /**
     * エラー時のフォールバック保存
     */
    async fallbackSave(analysisResult) {
        try {
            // テキスト形式で保存
            const textContent = this.generateTextReport(analysisResult);
            const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
            
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            const filename = `HaQei_診断結果_${timestamp}.txt`;
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return { success: true, filename, format: 'text' };
            
        } catch (error) {
            console.error("❌ Fallback save failed:", error);
            return { success: false, error: error.message };
        }
    }

    /**
     * テキストレポートを生成
     */
    generateTextReport(analysisResult) {
        const timestamp = new Date().toLocaleString('ja-JP');
        
        return `
HaQei Analyzer - 3層人格OS診断結果
生成日時: ${timestamp}

===== 診断概要 =====
人格一貫性スコア: ${Math.round((analysisResult.consistencyScore?.overall || 0) * 100)}%

===== エンジンOS =====
64卦: ${analysisResult.engineOS?.hexagramInfo?.name || '不明'}
特徴: ${analysisResult.engineOS?.hexagramInfo?.catchphrase || 'キャッチフレーズなし'}
説明: ${analysisResult.engineOS?.hexagramInfo?.description || '説明なし'}

===== インターフェースOS =====
64卦: ${analysisResult.interfaceOS?.hexagramInfo?.name || '不明'}
特徴: ${analysisResult.interfaceOS?.hexagramInfo?.catchphrase || 'キャッチフレーズなし'}
説明: ${analysisResult.interfaceOS?.hexagramInfo?.description || '説明なし'}

===== セーフモードOS =====
64卦: ${analysisResult.safeModeOS?.hexagramInfo?.name || '不明'}
特徴: ${analysisResult.safeModeOS?.hexagramInfo?.catchphrase || 'キャッチフレーズなし'}
説明: ${analysisResult.safeModeOS?.hexagramInfo?.description || '説明なし'}

===== 推奨事項 =====
${(analysisResult.integration?.recommendations || []).map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

---
このレポートは HaQei Analyzer によって生成されました。
        `.trim();
    }

    /**
     * システム破棄
     */
    destroy() {
        this.isJsPDFLoaded = false;
        console.log("📄 PDFExporter destroyed");
    }
}

export default PDFExporter;