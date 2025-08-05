/**
 * PDFExportManager.js - HAQEI PDF Export System
 * 
 * Beautiful PDF reports with hexagram visualizations and bunenjin philosophy
 * Uses jsPDF with custom styling and HAQEI branding
 * 
 * @version 1.0.0
 * @date 2025-08-04
 * @author extended-features-developer
 */

class PDFExportManager {
    constructor(options = {}) {
        this.options = {
            format: 'a4',
            orientation: 'portrait',
            unit: 'mm',
            margin: 20,
            fontSize: {
                title: 24,
                heading: 18,
                subheading: 14,
                body: 11,
                small: 9
            },
            colors: {
                primary: '#6366F1',
                secondary: '#8B5CF6',
                accent: '#F59E0B',
                text: '#1F2937',
                light: '#F8FAFC',
                muted: '#6B7280'
            },
            ...options
        };
        
        this.pdf = null;
        this.currentY = 0;
        this.pageHeight = 297; // A4 height in mm
        this.pageWidth = 210; // A4 width in mm
        
        console.log('📄 PDFExportManager initialized with HAQEI branding');
    }
    
    /**
     * Initialize jsPDF library
     */
    async init() {
        try {
            // Load jsPDF if not already loaded
            if (typeof window.jsPDF === 'undefined') {
                await this.loadJsPDF();
            }
            
            this.pdf = new window.jsPDF({
                orientation: this.options.orientation,
                unit: this.options.unit,
                format: this.options.format
            });
            
            console.log('✅ PDFExportManager initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize PDFExportManager:', error);
            throw error;
        }
    }
    
    /**
     * Load jsPDF library dynamically
     */
    async loadJsPDF() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                console.log('✅ jsPDF library loaded');
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Failed to load jsPDF library'));
            };
            document.head.appendChild(script);
        });
    }
    
    /**
     * Generate complete HAQEI analysis report
     */
    async generateAnalysisReport(analysisResult, insights = null, options = {}) {
        try {
            await this.init();
            
            this.currentY = this.options.margin;
            
            // Cover page
            this.createCoverPage(analysisResult);
            
            // Table of contents
            this.addNewPage();
            this.createTableOfContents();
            
            // Executive summary
            this.addNewPage();
            this.createExecutiveSummary(analysisResult);
            
            // Triple OS analysis
            this.addNewPage();
            this.createTripleOSAnalysis(analysisResult);
            
            // Hexagram visualizations
            this.addNewPage();
            this.createHexagramVisualizations(analysisResult);
            
            // Bunenjin philosophy insights
            this.addNewPage();
            this.createPhilosophyInsights(analysisResult, insights);
            
            // Practical guidance
            this.addNewPage();
            this.createPracticalGuidance(analysisResult);
            
            // Appendices
            this.addNewPage();
            this.createAppendices(analysisResult);
            
            // Footer on all pages
            this.addFootersToAllPages();
            
            console.log('✅ PDF report generated successfully');
            return this.pdf;
            
        } catch (error) {
            console.error('❌ Failed to generate PDF report:', error);
            throw error;
        }
    }
    
    /**
     * Create beautiful cover page
     */
    createCoverPage(analysisResult) {
        const { pdf } = this;
        
        // Background gradient effect
        this.drawGradientBackground();
        
        // HAQEI Logo/Title
        pdf.setFontSize(this.options.fontSize.title + 8);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        this.centerText('HAQEI', 60);
        
        pdf.setFontSize(this.options.fontSize.heading);
        pdf.setFont('helvetica', 'normal');
        this.centerText('仮想人格対話型自己理解システム', 75);
        
        // Subtitle
        pdf.setFontSize(this.options.fontSize.subheading);
        pdf.setTextColor(200, 200, 200);
        this.centerText('Triple OS Analysis Report', 90);
        
        // Generated persona name
        const personaName = this.generatePersonaName(analysisResult);
        pdf.setFontSize(this.options.fontSize.heading);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        this.centerText(`仮想人格: "${personaName}"`, 120);
        
        // Date and time
        const now = new Date();
        pdf.setFontSize(this.options.fontSize.body);
        pdf.setTextColor(180, 180, 180);
        pdf.setFont('helvetica', 'normal');
        this.centerText(`Generated: ${now.toLocaleDateString('ja-JP')} ${now.toLocaleTimeString('ja-JP')}`, 140);
        
        // I Ching symbols decoration
        this.drawIChingSymbols(160);
        
        // Bunenjin philosophy quote
        pdf.setFontSize(this.options.fontSize.body);
        pdf.setTextColor(220, 220, 220);
        pdf.setFont('helvetica', 'italic');
        this.centerText('"複数の自己を統合し、真の調和を見出す"', 200);
        this.centerText('- bunenjin 哲学 -', 210);
        
        // Footer
        pdf.setFontSize(this.options.fontSize.small);
        pdf.setTextColor(160, 160, 160);
        this.centerText('Confidential - Personal Analysis Report', 270);
    }
    
    /**
     * Create table of contents
     */
    createTableOfContents() {
        this.addSectionTitle('目次', true);
        
        const contents = [
            { title: '1. エグゼクティブサマリー', page: 3 },
            { title: '2. Triple OS 分析', page: 4 },
            { title: '3. 易経卦の視覚化', page: 5 },
            { title: '4. bunenjin哲学による洞察', page: 6 },
            { title: '5. 実践的ガイダンス', page: 7 },
            { title: '6. 付録', page: 8 }
        ];
        
        this.currentY += 10;
        
        contents.forEach(item => {
            this.pdf.setFontSize(this.options.fontSize.body);
            this.pdf.setTextColor(...this.hexToRgb(this.options.colors.text));
            
            this.pdf.text(item.title, this.options.margin, this.currentY);
            
            // Dotted line
            const titleWidth = this.pdf.getTextWidth(item.title);
            const pageNumWidth = this.pdf.getTextWidth(item.page.toString());
            const dotCount = Math.floor((this.pageWidth - this.options.margin * 2 - titleWidth - pageNumWidth - 10) / 2);
            const dots = '.'.repeat(dotCount);
            
            this.pdf.text(dots, this.options.margin + titleWidth + 5, this.currentY);
            this.pdf.text(item.page.toString(), this.pageWidth - this.options.margin - pageNumWidth, this.currentY);
            
            this.currentY += 8;
        });
    }
    
    /**
     * Create executive summary
     */
    createExecutiveSummary(analysisResult) {
        this.addSectionTitle('1. エグゼクティブサマリー');
        
        // Summary overview
        const summaryText = this.generateExecutiveSummary(analysisResult);
        this.addParagraph(summaryText);
        
        // Key metrics table
        this.currentY += 10;
        this.addSubtitle('主要指標');
        this.createMetricsTable(analysisResult);
        
        // Integration level visualization
        this.currentY += 15;
        this.addSubtitle('統合レベル');
        this.drawIntegrationChart(analysisResult);
    }
    
    /**
     * Create Triple OS analysis section
     */
    createTripleOSAnalysis(analysisResult) {
        this.addSectionTitle('2. Triple OS 分析');
        
        const { engineOS, interfaceOS, safeModeOS } = analysisResult;
        
        // Engine OS
        this.addSubtitle('🔥 Engine OS - 核となる価値観');
        this.addOSAnalysis(engineOS, 'engine');
        
        this.currentY += 10;
        
        // Interface OS
        this.addSubtitle('🌟 Interface OS - 社会的表現');
        this.addOSAnalysis(interfaceOS, 'interface');
        
        this.currentY += 10;
        
        // Safe Mode OS
        this.addSubtitle('🛡️ Safe Mode OS - 防御機制');
        this.addOSAnalysis(safeModeOS, 'safemode');
    }
    
    /**
     * Create hexagram visualizations
     */
    createHexagramVisualizations(analysisResult) {
        this.addSectionTitle('3. 易経卦の視覚化');
        
        this.addParagraph('あなたの三つのOSは、以下の易経卦として表現されます。各卦は古代中国の智慧を現代の心理学と融合させた深い洞察を提供します。');
        
        const { engineOS, interfaceOS, safeModeOS } = analysisResult;
        
        // Draw hexagrams side by side
        this.drawHexagramSet([
            { os: engineOS, type: 'Engine OS', color: '#EF4444' },
            { os: interfaceOS, type: 'Interface OS', color: '#3B82F6' },
            { os: safeModeOS, type: 'Safe Mode OS', color: '#10B981' }
        ]);
    }
    
    /**
     * Create philosophy insights section
     */
    createPhilosophyInsights(analysisResult, insights) {
        this.addSectionTitle('4. bunenjin哲学による洞察');
        
        this.addParagraph('bunenjin哲学は、「文人」（教養ある知識人）の理想的な在り方を現代的に解釈した思想体系です。複数の自己を認識し、それらを統合することで、より豊かな人間性を実現することを目指します。');
        
        this.currentY += 10;
        this.addSubtitle('哲学的考察');
        
        const philosophicalInsights = this.generatePhilosophicalInsights(analysisResult);
        this.addParagraph(philosophicalInsights);
        
        this.currentY += 10;
        this.addSubtitle('統合への道筋');
        
        const integrationPath = this.generateIntegrationPath(analysisResult);
        this.addParagraph(integrationPath);
    }
    
    /**
     * Create practical guidance section
     */
    createPracticalGuidance(analysisResult) {
        this.addSectionTitle('5. 実践的ガイダンス');
        
        // Daily practices
        this.addSubtitle('日常的な実践');
        const dailyPractices = this.generateDailyPractices(analysisResult);
        this.addBulletList(dailyPractices);
        
        this.currentY += 10;
        
        // Situation-specific advice
        this.addSubtitle('状況別アドバイス');
        const situationalAdvice = this.generateSituationalAdvice(analysisResult);
        this.addParagraph(situationalAdvice);
        
        this.currentY += 10;
        
        // Long-term development
        this.addSubtitle('長期的な発達計画');
        const developmentPlan = this.generateDevelopmentPlan(analysisResult);
        this.addParagraph(developmentPlan);
    }
    
    /**
     * Create appendices
     */
    createAppendices(analysisResult) {
        this.addSectionTitle('6. 付録');
        
        // Methodology
        this.addSubtitle('A. 分析手法について');
        this.addParagraph('本分析は、易経の64卦と現代心理学の理論を組み合わせた独自の手法を使用しています。回答データを多次元ベクトル空間で解析し、最適な卦との対応関係を算出しています。');
        
        this.currentY += 10;
        
        // Raw data summary
        this.addSubtitle('B. データサマリー');
        this.createDataSummaryTable(analysisResult);
        
        this.currentY += 10;
        
        // References
        this.addSubtitle('C. 参考文献');
        const references = [
            '『易経』- 中国古典',
            'Carl Jung: "Memories, Dreams, Reflections"',
            'bunenjin哲学体系（独自開発）',
            'Triple OS理論（独自開発）'
        ];
        this.addBulletList(references);
    }
    
    /**
     * Helper methods for drawing and formatting
     */
    
    drawGradientBackground() {
        // Simulate gradient with overlapping rectangles
        this.pdf.setFillColor(99, 102, 241); // Primary color
        this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
        
        this.pdf.setFillColor(139, 92, 246, 0.3); // Secondary overlay
        this.pdf.rect(0, 0, this.pageWidth, this.pageHeight / 2, 'F');
    }
    
    drawIChingSymbols(y) {
        const symbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
        const symbolWidth = this.pageWidth / symbols.length;
        
        this.pdf.setFontSize(20);
        this.pdf.setTextColor(255, 255, 255, 0.3);
        
        symbols.forEach((symbol, index) => {
            const x = (index * symbolWidth) + (symbolWidth / 2) - 5;
            this.pdf.text(symbol, x, y);
        });
    }
    
    addSectionTitle(title, isFirstSection = false) {
        if (!isFirstSection && this.currentY > this.pageHeight - 50) {
            this.addNewPage();
        }
        
        this.pdf.setFontSize(this.options.fontSize.heading);
        this.pdf.setTextColor(...this.hexToRgb(this.options.colors.primary));
        this.pdf.setFont('helvetica', 'bold');
        
        this.pdf.text(title, this.options.margin, this.currentY);
        this.currentY += 15;
        
        // Underline
        this.pdf.setDrawColor(...this.hexToRgb(this.options.colors.primary));
        this.pdf.setLineWidth(0.5);
        this.pdf.line(this.options.margin, this.currentY - 5, this.pageWidth - this.options.margin, this.currentY - 5);
        this.currentY += 5;
    }
    
    addSubtitle(title) {
        this.pdf.setFontSize(this.options.fontSize.subheading);
        this.pdf.setTextColor(...this.hexToRgb(this.options.colors.secondary));
        this.pdf.setFont('helvetica', 'bold');
        
        this.pdf.text(title, this.options.margin, this.currentY);
        this.currentY += 10;
    }
    
    addParagraph(text, options = {}) {
        const maxWidth = this.pageWidth - (this.options.margin * 2);
        const lineHeight = options.lineHeight || 6;
        
        this.pdf.setFontSize(this.options.fontSize.body);
        this.pdf.setTextColor(...this.hexToRgb(this.options.colors.text));
        this.pdf.setFont('helvetica', 'normal');
        
        const lines = this.pdf.splitTextToSize(text, maxWidth);
        
        lines.forEach(line => {
            if (this.currentY > this.pageHeight - this.options.margin) {
                this.addNewPage();
            }
            this.pdf.text(line, this.options.margin, this.currentY);
            this.currentY += lineHeight;
        });
        
        this.currentY += 3; // Extra spacing after paragraph
    }
    
    addBulletList(items) {
        items.forEach(item => {
            this.pdf.setFontSize(this.options.fontSize.body);
            this.pdf.setTextColor(...this.hexToRgb(this.options.colors.text));
            this.pdf.setFont('helvetica', 'normal');
            
            this.pdf.text('•', this.options.margin, this.currentY);
            this.pdf.text(item, this.options.margin + 5, this.currentY);
            this.currentY += 6;
        });
    }
    
    centerText(text, y) {
        const textWidth = this.pdf.getTextWidth(text);
        const x = (this.pageWidth - textWidth) / 2;
        this.pdf.text(text, x, y);
    }
    
    addNewPage() {
        this.pdf.addPage();
        this.currentY = this.options.margin;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
    
    /**
     * Content generation methods
     */
    
    generatePersonaName(analysisResult) {
        const { engineOS, interfaceOS, safeModeOS } = analysisResult;
        const engineName = engineOS?.hexagramInfo?.name || '創造';
        const interfaceName = interfaceOS?.hexagramInfo?.name || '調和';
        const safeName = safeModeOS?.hexagramInfo?.name || '守護';
        
        return `${engineName}の${interfaceName}者`;
    }
    
    generateExecutiveSummary(analysisResult) {
        const integrationLevel = this.calculateIntegrationLevel(analysisResult);
        
        return `本分析では、あなたの心理的特性を三つの独立したOS（オペレーティングシステム）として解析しました。
        
Engine OSは「${analysisResult.engineOS?.hexagramInfo?.name || '創造'}」の性質を持ち、あなたの核となる価値観と動機を表しています。Interface OSは「${analysisResult.interfaceOS?.hexagramInfo?.name || '調和'}」として、社会的な表現と対人関係における傾向を示します。Safe Mode OSは「${analysisResult.safeModeOS?.hexagramInfo?.name || '守護'}」の特徴を持ち、ストレス時の防御機制を表現しています。

現在の統合レベルは${integrationLevel}%であり、これらの三つのOSが${integrationLevel >= 70 ? '良好に' : integrationLevel >= 50 ? '適度に' : '部分的に'}調和していることを示しています。`;
    }
    
    calculateIntegrationLevel(analysisResult) {
        const { engineOS, interfaceOS, safeModeOS } = analysisResult;
        const scores = [
            engineOS?.matchPercentage || 0,
            interfaceOS?.matchPercentage || 0,
            safeModeOS?.matchPercentage || 0
        ];
        
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
        return Math.round(Math.max(0, 100 - variance));
    }
    
    /**
     * Export methods
     */
    
    async downloadPDF(filename = null) {
        if (!this.pdf) {
            throw new Error('PDF not generated yet');
        }
        
        const defaultFilename = `HAQEI-Analysis-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        this.pdf.save(filename || defaultFilename);
        
        console.log(`✅ PDF downloaded: ${filename || defaultFilename}`);
    }
    
    getPDFBlob() {
        if (!this.pdf) {
            throw new Error('PDF not generated yet');
        }
        
        return this.pdf.output('blob');
    }
    
    getPDFDataUri() {
        if (!this.pdf) {
            throw new Error('PDF not generated yet');
        }
        
        return this.pdf.output('datauristring');
    }
}

// Export for global use
window.PDFExportManager = PDFExportManager;

console.log('✅ PDFExportManager loaded successfully with HAQEI branding');