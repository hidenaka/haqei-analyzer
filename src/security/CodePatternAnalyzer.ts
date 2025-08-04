/**
 * 危険なコードパターン検出・修正システム
 * セキュリティ脆弱性を自動検出し、段階的修正を提案
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { glob } from 'glob'

// 危険なパターンの定義
interface SecurityPattern {
  id: string
  name: string
  pattern: RegExp
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  fix: string
  replacement?: string
}

// セキュリティパターン定義
const SECURITY_PATTERNS: SecurityPattern[] = [
  {
    id: 'hardcoded-secrets',
    name: 'ハードコードされた機密情報',
    pattern: /(password|secret|key|token)\s*[:=]\s*['"`][^'"`\s]{8,}['"`]/gi,
    severity: 'critical',
    description: 'パスワードやAPIキーがハードコードされています',
    fix: '環境変数を使用してください'
  },
  {
    id: 'sql-injection',
    name: 'SQLインジェクション脆弱性',
    pattern: /query\s*\(\s*['"`][^'"`]*\$\{[^}]+\}[^'"`]*['"`]/gi,
    severity: 'critical', 
    description: 'SQLインジェクション脆弱性の可能性があります',
    fix: 'パラメータ化クエリを使用してください'
  },
  {
    id: 'xss-vulnerability',
    name: 'XSS脆弱性',
    pattern: /innerHTML\s*=\s*[^;]+\+|document\.write\s*\([^)]*\+/gi,
    severity: 'high',
    description: 'XSS攻撃の脆弱性があります',
    fix: 'textContentやsetTextContentを使用してください'
  },
  {
    id: 'insecure-random',
    name: '安全でない乱数生成',
    pattern: /Math\.random\(\)/gi,
    severity: 'medium',
    description: '暗号学的に安全でない乱数を使用しています',
    fix: 'crypto.randomBytes()を使用してください',
    replacement: 'crypto.randomBytes(16).toString("hex")'
  },
  {
    id: 'console-log',
    name: 'デバッグ情報の残存',
    pattern: /console\.(log|debug|info|warn|error)\s*\(/gi,
    severity: 'low',
    description: 'プロダクションでデバッグ情報が出力されます',
    fix: 'プロダクションビルドでconsoleを除去してください'
  },
  {
    id: 'eval-usage',
    name: 'eval関数の使用',
    pattern: /\beval\s*\(/gi,
    severity: 'critical',
    description: 'eval関数はセキュリティリスクがあります',
    fix: '安全な代替手段を使用してください'
  },
  {
    id: 'weak-crypto',
    name: '弱い暗号化アルゴリズム',
    pattern: /(md5|sha1)\s*\(/gi,
    severity: 'high',
    description: '弱い暗号化アルゴリズムを使用しています',
    fix: 'SHA-256以上の強いハッシュを使用してください'
  },
  {
    id: 'insecure-protocol',
    name: '安全でないプロトコル',
    pattern: /(http:\/\/|ftp:\/\/)/gi,
    severity: 'medium',
    description: '安全でないプロトコルを使用しています',
    fix: 'HTTPSを使用してください',
    replacement: 'https://'
  },
  {
    id: 'buffer-overflow',
    name: 'バッファオーバーフロー脆弱性',
    pattern: /Buffer\s*\(\s*\d+\s*\)/gi,
    severity: 'high',
    description: 'バッファオーバーフローの脆弱性があります',
    fix: 'Buffer.alloc()を使用してください',
    replacement: 'Buffer.alloc'
  },
  {
    id: 'path-traversal',
    name: 'パストラバーサル脆弱性',
    pattern: /\.\.\//gi,
    severity: 'high',
    description: 'パストラバーサル攻撃の脆弱性があります',
    fix: 'path.resolve()でパスを正規化してください'
  }
]

// 検出結果の型定義
interface SecurityIssue {
  file: string
  line: number
  column: number
  pattern: SecurityPattern
  code: string
  context: string
  fixed?: boolean
}

// 修正結果の型定義
interface FixResult {
  file: string
  issuesFound: number
  issuesFixed: number
  issues: SecurityIssue[]
}

/**
 * コードパターンアナライザークラス
 */
export class CodePatternAnalyzer {
  private issues: SecurityIssue[] = []
  private excludePatterns: string[] = [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.git/**',
    '**/coverage/**',
    '**/*.min.js'
  ]

  /**
   * 指定されたディレクトリ内のファイルを分析
   * @param rootPath - 分析対象のルートパス
   * @param filePatterns - ファイルパターン
   */
  async analyzeDirectory(
    rootPath: string,
    filePatterns: string[] = ['**/*.{js,ts,vue,html}']
  ): Promise<SecurityIssue[]> {
    this.issues = []
    
    console.log('🔍 セキュリティパターン分析を開始...')
    
    for (const pattern of filePatterns) {
      const files = await glob(pattern, {
        cwd: rootPath,
        ignore: this.excludePatterns,
        absolute: true
      })
      
      for (const file of files) {
        await this.analyzeFile(file)
      }
    }
    
    this.printSummary()
    return this.issues
  }

  /**
   * 単一ファイルを分析
   * @param filePath - 分析対象ファイル
   */
  private async analyzeFile(filePath: string): Promise<void> {
    if (!existsSync(filePath)) return
    
    try {
      const content = readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')
      
      for (const pattern of SECURITY_PATTERNS) {
        let match
        const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags)
        
        while ((match = regex.exec(content)) !== null) {
          const beforeMatch = content.substring(0, match.index)
          const lineNumber = beforeMatch.split('\n').length
          const columnNumber = match.index - beforeMatch.lastIndexOf('\n')
          
          const issue: SecurityIssue = {
            file: filePath,
            line: lineNumber,
            column: columnNumber,
            pattern,
            code: match[0],
            context: this.getContext(lines, lineNumber - 1)
          }
          
          this.issues.push(issue)
        }
      }
    } catch (error) {
      console.warn(`⚠️ ファイル分析エラー: ${filePath}`, error)
    }
  }

  /**
   * コンテキスト行を取得
   * @param lines - ファイルの全行
   * @param lineIndex - 対象行のインデックス
   */
  private getContext(lines: string[], lineIndex: number): string {
    const start = Math.max(0, lineIndex - 2)
    const end = Math.min(lines.length, lineIndex + 3)
    return lines.slice(start, end).join('\n')
  }

  /**
   * 段階的修正を実行
   * @param autoFix - 自動修正を行うか
   */
  async applyFixes(autoFix: boolean = false): Promise<FixResult[]> {
    const results: FixResult[] = []
    const fileGroups = this.groupIssuesByFile()
    
    console.log('🔧 段階的修正を開始...')
    
    for (const [filePath, issues] of fileGroups) {
      const result = await this.fixFile(filePath, issues, autoFix)
      results.push(result)
    }
    
    return results
  }

  /**
   * ファイル別にissuesをグループ化
   */
  private groupIssuesByFile(): Map<string, SecurityIssue[]> {
    const groups = new Map<string, SecurityIssue[]>()
    
    for (const issue of this.issues) {
      if (!groups.has(issue.file)) {
        groups.set(issue.file, [])
      }
      groups.get(issue.file)!.push(issue)
    }
    
    return groups
  }

  /**
   * 単一ファイルの修正
   * @param filePath - 修正対象ファイル
   * @param issues - 修正対象のissues
   * @param autoFix - 自動修正を行うか
   */
  private async fixFile(
    filePath: string,
    issues: SecurityIssue[],
    autoFix: boolean
  ): Promise<FixResult> {
    let content = readFileSync(filePath, 'utf-8')
    let issuesFixed = 0
    
    // 重要度順にソート（高い順）
    const sortedIssues = issues.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return severityOrder[b.pattern.severity] - severityOrder[a.pattern.severity]
    })
    
    for (const issue of sortedIssues) {
      if (autoFix && issue.pattern.replacement) {
        // 自動修正可能な場合
        const regex = new RegExp(issue.pattern.pattern.source, 'gi')
        const newContent = content.replace(regex, issue.pattern.replacement)
        
        if (newContent !== content) {
          content = newContent
          issue.fixed = true
          issuesFixed++
          console.log(`✅ 修正済み: ${issue.pattern.name} in ${filePath}:${issue.line}`)
        }
      } else {
        // 手動修正が必要
        console.log(`⚠️ 手動修正必要: ${issue.pattern.name} in ${filePath}:${issue.line}`)
        console.log(`   説明: ${issue.pattern.description}`)
        console.log(`   修正方法: ${issue.pattern.fix}`)
        console.log(`   コード: ${issue.code}`)
        console.log()
      }
    }
    
    // 修正内容をファイルに書き込み
    if (issuesFixed > 0) {
      writeFileSync(filePath, content, 'utf-8')
      console.log(`💾 ${filePath} を更新しました (${issuesFixed}件修正)`)
    }
    
    return {
      file: filePath,
      issuesFound: issues.length,
      issuesFixed,
      issues: sortedIssues
    }
  }

  /**
   * 分析結果のサマリーを表示
   */
  private printSummary(): void {
    const severityCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }
    
    for (const issue of this.issues) {
      severityCounts[issue.pattern.severity]++
    }
    
    console.log('\n📊 セキュリティパターン分析結果:')
    console.log(`   総検出数: ${this.issues.length}`)
    console.log(`   🔴 Critical: ${severityCounts.critical}`)
    console.log(`   🟠 High: ${severityCounts.high}`)
    console.log(`   🟡 Medium: ${severityCounts.medium}`)
    console.log(`   🟢 Low: ${severityCounts.low}`)
  }

  /**
   * 詳細レポートをJSONで出力
   * @param outputPath - 出力先パス
   */
  async generateReport(outputPath: string): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: this.issues.length,
      severityBreakdown: this.getSeverityBreakdown(),
      issues: this.issues.map(issue => ({
        file: issue.file,
        line: issue.line,
        column: issue.column,
        severity: issue.pattern.severity,
        patternName: issue.pattern.name,
        description: issue.pattern.description,
        fix: issue.pattern.fix,
        code: issue.code,
        fixed: issue.fixed || false
      }))
    }
    
    writeFileSync(outputPath, JSON.stringify(report, null, 2))
    console.log(`📄 セキュリティレポートを生成: ${outputPath}`)
  }

  /**
   * 重要度別の集計を取得
   */
  private getSeverityBreakdown(): Record<string, number> {
    const breakdown = { critical: 0, high: 0, medium: 0, low: 0 }
    
    for (const issue of this.issues) {
      breakdown[issue.pattern.severity]++
    }
    
    return breakdown
  }

  /**
   * 修正可能なissuesのみを取得
   */
  getFixableIssues(): SecurityIssue[] {
    return this.issues.filter(issue => issue.pattern.replacement)
  }

  /**
   * 手動修正が必要なissuesを取得
   */
  getManualFixIssues(): SecurityIssue[] {
    return this.issues.filter(issue => !issue.pattern.replacement)
  }
}

// CLI実行用のメイン関数
export async function runSecurityAnalysis(
  rootPath: string = process.cwd(),
  autoFix: boolean = false
): Promise<void> {
  const analyzer = new CodePatternAnalyzer()
  
  try {
    // 分析実行
    await analyzer.analyzeDirectory(rootPath)
    
    // 修正実行
    const fixResults = await analyzer.applyFixes(autoFix)
    
    // レポート生成
    const reportPath = join(rootPath, 'security-analysis-report.json')
    await analyzer.generateReport(reportPath)
    
    // 結果サマリー
    const totalFixed = fixResults.reduce((sum, result) => sum + result.issuesFixed, 0)
    const totalFound = fixResults.reduce((sum, result) => sum + result.issuesFound, 0)
    
    console.log('\n🎯 分析完了:')
    console.log(`   検出した問題: ${totalFound}件`)
    console.log(`   修正した問題: ${totalFixed}件`)
    console.log(`   残りの問題: ${totalFound - totalFixed}件`)
    
    if (totalFound - totalFixed > 0) {
      console.log('\n⚠️ 手動修正が必要な問題があります。レポートを確認してください。')
    }
    
  } catch (error) {
    console.error('❌ セキュリティ分析でエラーが発生:', error)
    process.exit(1)
  }
}

// デフォルトエクスポート
export default CodePatternAnalyzer