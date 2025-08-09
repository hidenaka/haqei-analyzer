/**
 * PDF Export ユーティリティ
 * 
 * 目的：
 * 分析結果をPDF形式でエクスポート
 * 
 * 機能：
 * - 分析結果のPDF生成
 * - 8次元グラフのキャンバス描画
 * - 日本語フォントのサポート
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { AnalysisResult } from '@/data/types'
import type { TripleOSAnalysisResult } from '@/utils/tripleOSEngine'

// 日本語フォントの設定（実際の実装では適切な日本語フォントを追加）
// import { font } from './fonts/NotoSansJP-Regular'

export interface PDFExportOptions {
  includeCharts?: boolean
  includeDetailedAnalysis?: boolean
  includeActionPlans?: boolean
}

/**
 * 分析結果をPDFとしてエクスポート
 * 
 * 目的：
 * ユーザーが分析結果を保存・印刷できるようにする
 * 
 * 入力：
 * - analysisResult: 基本的な分析結果
 * - tripleOSResult: Triple OS分析結果
 * - options: エクスポートオプション
 * 
 * 処理内容：
 * 1. PDFドキュメントの初期化
 * 2. ヘッダー情報の追加
 * 3. Triple OS結果の追加
 * 4. 8次元スコアの追加
 * 5. チャート画像の埋め込み（オプション）
 * 6. アクションプランの追加（オプション）
 * 
 * 出力：
 * - PDFファイルのダウンロード
 */
export async function exportToPDF(
  analysisResult: AnalysisResult,
  tripleOSResult: TripleOSAnalysisResult,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    includeCharts = true,
    includeDetailedAnalysis = true,
    includeActionPlans = true
  } = options

  // Create new PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Add custom font for Japanese support (if available)
  // pdf.addFileToVFS('NotoSansJP-Regular.ttf', font)
  // pdf.addFont('NotoSansJP-Regular.ttf', 'NotoSansJP', 'normal')
  // pdf.setFont('NotoSansJP')

  let yPosition = 20

  // Title
  pdf.setFontSize(24)
  pdf.text('HaQei 分析結果レポート', 105, yPosition, { align: 'center' })
  yPosition += 15

  // Date
  pdf.setFontSize(12)
  const date = new Date(analysisResult.timestamp)
  pdf.text(`作成日: ${date.toLocaleDateString('ja-JP')}`, 105, yPosition, { align: 'center' })
  yPosition += 20

  // Triple OS Overview
  pdf.setFontSize(18)
  pdf.text('Triple OS 分析結果', 20, yPosition)
  yPosition += 10

  // Engine OS
  pdf.setFontSize(14)
  pdf.text('Engine OS (価値観システム)', 20, yPosition)
  yPosition += 7
  pdf.setFontSize(12)
  pdf.text(`主要卦: ${tripleOSResult.engineOS.hexagramId} - ${tripleOSResult.engineOS.hexagramName}`, 25, yPosition)
  yPosition += 5
  pdf.text(`主要三爻: ${tripleOSResult.engineOS.primaryTrigram}`, 25, yPosition)
  yPosition += 5
  pdf.text(`副次三爻: ${tripleOSResult.engineOS.secondaryTrigram}`, 25, yPosition)
  yPosition += 10

  // Interface OS
  pdf.setFontSize(14)
  pdf.text('Interface OS (社会的システム)', 20, yPosition)
  yPosition += 7
  pdf.setFontSize(12)
  pdf.text(`卦: ${tripleOSResult.interfaceOS.hexagramId} - ${tripleOSResult.interfaceOS.hexagramName}`, 25, yPosition)
  yPosition += 10

  // SafeMode OS
  pdf.setFontSize(14)
  pdf.text('SafeMode OS (防御システム)', 20, yPosition)
  yPosition += 7
  pdf.setFontSize(12)
  pdf.text(`卦: ${tripleOSResult.safeModeOS.hexagramId} - ${tripleOSResult.safeModeOS.hexagramName}`, 25, yPosition)
  yPosition += 10

  // Consistency Score
  pdf.setFontSize(14)
  pdf.text(`システム整合性: ${tripleOSResult.consistencyScore}%`, 20, yPosition)
  yPosition += 5
  pdf.setFontSize(12)
  pdf.text(`リスクレベル: ${tripleOSResult.misalignmentData?.riskLevel || '不明'}`, 25, yPosition)
  yPosition += 15

  // Check if need new page
  if (yPosition > 250) {
    pdf.addPage()
    yPosition = 20
  }

  // 8 Dimension Scores
  pdf.setFontSize(18)
  pdf.text('8次元パーソナリティスコア', 20, yPosition)
  yPosition += 10

  pdf.setFontSize(12)
  const dimensions = Array.from(analysisResult.dimensionScores.entries())
  dimensions.forEach(([dimension, score]) => {
    pdf.text(`${dimension}: ${score.toFixed(1)}`, 25, yPosition)
    
    // Draw score bar
    const barWidth = 100
    const barHeight = 4
    const fillWidth = (score / 100) * barWidth
    
    pdf.setDrawColor(200, 200, 200)
    pdf.rect(80, yPosition - 3, barWidth, barHeight)
    
    pdf.setFillColor(74, 144, 226)
    pdf.rect(80, yPosition - 3, fillWidth, barHeight, 'F')
    
    yPosition += 8
  })

  // Add chart if requested
  if (includeCharts) {
    const chartElement = document.querySelector('.radar-chart-container canvas') as HTMLCanvasElement
    if (chartElement) {
      yPosition += 10
      
      if (yPosition > 200) {
        pdf.addPage()
        yPosition = 20
      }
      
      try {
        const canvas = await html2canvas(chartElement)
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 40, yPosition, 130, 130)
        yPosition += 140
      } catch (error) {
        console.error('Failed to add chart to PDF:', error)
      }
    }
  }

  // Add detailed analysis if requested
  if (includeDetailedAnalysis && tripleOSResult.integrationInsights) {
    if (yPosition > 200) {
      pdf.addPage()
      yPosition = 20
    }

    pdf.setFontSize(18)
    pdf.text('詳細分析', 20, yPosition)
    yPosition += 10

    pdf.setFontSize(12)
    tripleOSResult.integrationInsights.forEach((insight: any) => {
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 20
      }

      pdf.setFontSize(14)
      pdf.text(insight.title, 20, yPosition)
      yPosition += 7

      pdf.setFontSize(11)
      const lines = pdf.splitTextToSize(insight.content, 170)
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPosition)
        yPosition += 5
      })
      yPosition += 5
    })
  }

  // Add action plans if requested
  if (includeActionPlans) {
    if (yPosition > 200) {
      pdf.addPage()
      yPosition = 20
    }

    pdf.setFontSize(18)
    pdf.text('アクションプラン', 20, yPosition)
    yPosition += 10

    pdf.setFontSize(12)
    pdf.text('このセクションは今後実装予定です。', 25, yPosition)
  }

  // Save the PDF
  const fileName = `haqei_analysis_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.pdf`
  pdf.save(fileName)
}

/**
 * チャート画像を生成
 * 
 * 目的：
 * Canvas要素から画像データを生成
 */
export async function generateChartImage(canvasElement: HTMLCanvasElement): Promise<string> {
  return canvasElement.toDataURL('image/png')
}

/**
 * レポートのプレビューを生成
 * 
 * 目的：
 * PDF生成前にプレビューを表示
 */
export function generateReportPreview(
  analysisResult: AnalysisResult,
  tripleOSResult: TripleOSAnalysisResult
): string {
  const date = new Date(analysisResult.timestamp)
  
  let html = `
    <div class="report-preview">
      <h1>HaQei 分析結果レポート</h1>
      <p>作成日: ${date.toLocaleDateString('ja-JP')}</p>
      
      <h2>Triple OS 分析結果</h2>
      
      <h3>Engine OS (価値観システム)</h3>
      <p>主要卦: ${tripleOSResult.engineOS.hexagramId} - ${tripleOSResult.engineOS.hexagramName}</p>
      <p>主要三爻: ${tripleOSResult.engineOS.primaryTrigram}</p>
      <p>副次三爻: ${tripleOSResult.engineOS.secondaryTrigram}</p>
      
      <h3>Interface OS (社会的システム)</h3>
      <p>卦: ${tripleOSResult.interfaceOS.hexagramId} - ${tripleOSResult.interfaceOS.hexagramName}</p>
      
      <h3>SafeMode OS (防御システム)</h3>
      <p>卦: ${tripleOSResult.safeModeOS.hexagramId} - ${tripleOSResult.safeModeOS.hexagramName}</p>
      
      <h3>システム整合性</h3>
      <p>整合性スコア: ${tripleOSResult.consistencyScore}%</p>
      <p>リスクレベル: ${tripleOSResult.misalignmentData?.riskLevel || '不明'}</p>
      
      <h2>8次元パーソナリティスコア</h2>
      <ul>
  `
  
  Array.from(analysisResult.dimensionScores.entries()).forEach(([dimension, score]) => {
    html += `<li>${dimension}: ${score.toFixed(1)}</li>`
  })
  
  html += `
      </ul>
    </div>
  `
  
  return html
}