#!/usr/bin/env node

/**
 * Claude自然言語コマンドインタープリター
 * 「○○を実行して」のような指示を自動的にコマンドに変換・実行
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ClaudeCommandInterpreter {
  constructor() {
    this.commandMappings = {
      // PDCA関連
      'pdca': {
        patterns: [
          /(?:pdca|PDCA).*?(?:評価|実行|開始)/i,
          /仮想ユーザー.*?(?:評価|テスト)/i,
          /サイト.*?(?:評価|テスト|分析)/i
        ],
        handler: this.handlePDCAEvaluate.bind(this)
      },
      'pdca-discuss': {
        patterns: [
          /(?:claude|Claude).*?(?:相談|ディスカッション)/i,
          /改善.*?(?:相談|検討)/i,
          /フィードバック.*?(?:相談|検討)/i
        ],
        handler: this.handlePDCADiscuss.bind(this)
      },
      'pdca-implement': {
        patterns: [
          /(?:実装|実行|適用).*?(?:改善|修正)/i,
          /コード.*?(?:修正|改善|実装)/i,
          /機能.*?(?:追加|実装)/i
        ],
        handler: this.handlePDCAImplement.bind(this)
      },
      'pdca-verify': {
        patterns: [
          /(?:検証|確認|検査)/i,
          /before.*?after/i,
          /効果.*?測定/i,
          /改善.*?効果/i
        ],
        handler: this.handlePDCAVerify.bind(this)
      },
      
      // 仮想ユーザー生成
      'virtual-users': {
        patterns: [
          /仮想ユーザー.*?(?:生成|作成)/i,
          /ユーザー.*?(?:\d+).*?(?:人|名)/i,
          /テストユーザー.*?(?:生成|作成)/i
        ],
        handler: this.handleVirtualUsers.bind(this)
      },
      
      // サーバー関連
      'server': {
        patterns: [
          /サーバー.*?(?:起動|開始|スタート)/i,
          /localhost.*?(?:起動|開始)/i,
          /ローカル.*?(?:サーバー|起動)/i
        ],
        handler: this.handleServerStart.bind(this)
      },
      
      // テスト関連  
      'test': {
        patterns: [
          /テスト.*?(?:実行|開始)/i,
          /(?:検証|バリデーション).*?(?:実行|開始)/i,
          /動作.*?(?:確認|テスト)/i
        ],
        handler: this.handleTest.bind(this)
      },
      
      // Claude Code起動
      'claude-code': {
        patterns: [
          /claude.*?(?:起動|開始|実行)/i,
          /mcp.*?(?:起動|開始)/i,
          /claude.*?code/i
        ],
        handler: this.handleClaudeCode.bind(this)
      }
    };
  }

  /**
   * 自然言語指示を解析・実行
   */
  async interpretAndExecute(instruction) {
    console.log(`🤖 Claude指示を解析中: "${instruction}"`);
    
    try {
      // 指示パターンマッチング
      const matchedCommand = this.findMatchingCommand(instruction);
      
      if (!matchedCommand) {
        console.log('❓ 該当するコマンドが見つかりませんでした');
        this.showAvailableCommands();
        return false;
      }
      
      console.log(`✅ マッチしたコマンド: ${matchedCommand.type}`);
      
      // パラメータ抽出
      const params = this.extractParameters(instruction, matchedCommand.type);
      
      // 安全性チェック
      if (!this.isSafeCommand(matchedCommand.type, params)) {
        console.log('⚠️ 安全性チェックに引っかかりました');
        return false;
      }
      
      // コマンド実行
      console.log(`🚀 実行中: ${matchedCommand.type}`);
      const result = await matchedCommand.handler(params, instruction);
      
      console.log('✅ コマンド実行完了');
      return result;
      
    } catch (error) {
      console.error('❌ 実行エラー:', error.message);
      return false;
    }
  }

  /**
   * 指示にマッチするコマンドを見つける
   */
  findMatchingCommand(instruction) {
    for (const [type, config] of Object.entries(this.commandMappings)) {
      for (const pattern of config.patterns) {
        if (pattern.test(instruction)) {
          return { type, ...config };
        }
      }
    }
    return null;
  }

  /**
   * パラメータ抽出
   */
  extractParameters(instruction, commandType) {
    const params = {};
    
    // 数字抽出（人数など）
    const numberMatch = instruction.match(/(\d+)(?:人|名|個)/);
    if (numberMatch) {
      params.count = parseInt(numberMatch[1]);
    }
    
    // サイト名抽出
    if (instruction.includes('os') || instruction.includes('OS') || instruction.includes('アナライザー')) {
      params.site = 'os-analyzer';
    } else if (instruction.includes('future') || instruction.includes('Future') || instruction.includes('シミュレーター')) {
      params.site = 'future-simulator';
    }
    
    // セッションID抽出
    const sessionMatch = instruction.match(/(?:セッション|session)[\s]*[:：]?\s*([a-zA-Z0-9_-]+)/i);
    if (sessionMatch) {
      params.sessionId = sessionMatch[1];
    }
    
    // ポート番号抽出
    const portMatch = instruction.match(/(?:ポート|port)[\s]*[:：]?\s*(\d+)/i);
    if (portMatch) {
      params.port = parseInt(portMatch[1]);
    }
    
    return params;
  }

  /**
   * 安全性チェック
   */
  isSafeCommand(commandType, params) {
    // 危険なコマンドをブロック
    const dangerousPatterns = [
      /rm\s+-rf/,
      /sudo/,
      /chmod\s+777/,
      />/  // ファイル上書き
    ];
    
    // パラメータに危険な文字列が含まれていないかチェック
    const paramString = JSON.stringify(params);
    for (const pattern of dangerousPatterns) {
      if (pattern.test(paramString)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * PDCA評価コマンド処理
   */
  async handlePDCAEvaluate(params, instruction) {
    console.log('🎭 PDCA評価を実行します');
    
    let command = 'npm run pdca:evaluate';
    
    // 人数指定
    if (params.count) {
      if (params.count === 15) command = 'npm run pdca:evaluate:15';
      else if (params.count === 20) command = 'npm run pdca:evaluate:20';
      else if (params.count === 30) command = 'npm run pdca:evaluate:30';
      else command += ` --userCount=${params.count}`;
    }
    
    // サイト指定
    if (params.site) {
      command += ` --site=${params.site}`;
    }
    
    return this.executeCommand(command);
  }

  /**
   * PDCA相談コマンド処理
   */
  async handlePDCADiscuss(params, instruction) {
    console.log('🤝 PDCA相談を準備します');
    
    if (!params.sessionId) {
      // 最新のセッションを自動検出
      params.sessionId = this.findLatestSession();
    }
    
    if (!params.sessionId) {
      console.log('⚠️ セッションIDが必要です。先にPDCA評価を実行してください。');
      return false;
    }
    
    const command = `npm run pdca:discuss --session=${params.sessionId}`;
    return this.executeCommand(command);
  }

  /**
   * PDCA実装コマンド処理
   */
  async handlePDCAImplement(params, instruction) {
    console.log('⚡ PDCA実装を実行します');
    
    if (!params.sessionId) {
      params.sessionId = this.findLatestSession();
    }
    
    if (!params.sessionId) {
      console.log('⚠️ セッションIDが必要です。');
      return false;
    }
    
    const command = `npm run pdca:implement --session=${params.sessionId}`;
    return this.executeCommand(command);
  }

  /**
   * PDCA検証コマンド処理
   */
  async handlePDCAVerify(params, instruction) {
    console.log('🔍 PDCA検証を実行します');
    
    if (!params.sessionId) {
      params.sessionId = this.findLatestSession();
    }
    
    if (!params.sessionId) {
      console.log('⚠️ セッションIDが必要です。');
      return false;
    }
    
    const command = `npm run pdca:verify --session=${params.sessionId}`;
    return this.executeCommand(command);
  }

  /**
   * 仮想ユーザー生成処理
   */
  async handleVirtualUsers(params, instruction) {
    console.log('👥 仮想ユーザーを生成します');
    
    const count = params.count || 10;
    const command = `node scripts/enhanced-virtual-user-generator.cjs ${count}`;
    
    return this.executeCommand(command);
  }

  /**
   * サーバー起動処理
   */
  async handleServerStart(params, instruction) {
    console.log('🖥️ サーバーを起動します');
    
    const port = params.port || 8788;
    let command;
    
    if (port === 8788) {
      command = 'npm run future-simulator';
    } else if (port === 8080) {
      command = 'npm run local-server:8080';
    } else if (port === 3000) {
      command = 'npm run local-server:3000';
    } else {
      command = `npm run local-server -- --port=${port}`;
    }
    
    console.log(`ポート ${port} でサーバーを起動します`);
    return this.executeCommand(command);
  }

  /**
   * テスト実行処理
   */
  async handleTest(params, instruction) {
    console.log('🧪 テストを実行します');
    
    let command = 'node test-virtual-user-validation.cjs';
    
    if (instruction.includes('統合') || instruction.includes('integration')) {
      command = 'npm run test:e2e';
    } else if (instruction.includes('パフォーマンス') || instruction.includes('performance')) {
      command = 'npm run test:coverage';
    }
    
    return this.executeCommand(command);
  }

  /**
   * Claude Code起動処理
   */
  async handleClaudeCode(params, instruction) {
    console.log('🤖 Claude Codeを起動します');
    
    let command = 'npm run mcp:claude:unsafe';
    
    if (instruction.includes('再開') || instruction.includes('resume')) {
      command = 'npm run mcp:resume:unsafe';
    }
    
    console.log('Claude Codeが起動されます...');
    return this.executeCommand(command);
  }

  /**
   * 最新セッション検索
   */
  findLatestSession() {
    try {
      const outputDir = path.join(__dirname, '..', 'output', 'pdca');
      if (!fs.existsSync(outputDir)) return null;
      
      const sessions = fs.readdirSync(outputDir)
        .filter(dir => dir.startsWith('pdca-'))
        .map(dir => ({
          id: dir,
          time: fs.statSync(path.join(outputDir, dir)).mtime
        }))
        .sort((a, b) => b.time - a.time);
      
      return sessions.length > 0 ? sessions[0].id : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * コマンド実行
   */
  async executeCommand(command) {
    try {
      console.log(`💻 実行: ${command}`);
      const output = execSync(command, { 
        encoding: 'utf8', 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      
      return { success: true, output };
    } catch (error) {
      console.error(`❌ コマンド実行エラー: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 利用可能なコマンド一覧表示
   */
  showAvailableCommands() {
    console.log('\n📋 利用可能な指示例:');
    console.log('');
    console.log('🎭 PDCA評価:');
    console.log('  "PDCA評価を実行して"');
    console.log('  "OSアナライザーを20人でテストして"');
    console.log('  "Future Simulatorを評価して"');
    console.log('');
    console.log('🤝 PDCA相談:');
    console.log('  "Claudeと相談して"');
    console.log('  "改善案を相談して"');
    console.log('');
    console.log('⚡ PDCA実装:');
    console.log('  "改善を実装して"');
    console.log('  "コードを修正して"');
    console.log('');
    console.log('🔍 PDCA検証:');
    console.log('  "効果を検証して"');
    console.log('  "Before/Afterを確認して"');
    console.log('');
    console.log('👥 仮想ユーザー:');
    console.log('  "仮想ユーザーを15人生成して"');
    console.log('  "テストユーザーを作成して"');
    console.log('');
    console.log('🖥️ サーバー:');
    console.log('  "サーバーを起動して"');
    console.log('  "ポート8080でサーバーを起動して"');
    console.log('');
    console.log('🧪 テスト:');
    console.log('  "テストを実行して"');
    console.log('  "動作確認して"');
    console.log('');
    console.log('🤖 Claude Code:');
    console.log('  "Claude Codeを起動して"');
    console.log('  "MCPを起動して"');
  }
}

// コマンドライン実行
if (require.main === module) {
  const interpreter = new ClaudeCommandInterpreter();
  const instruction = process.argv.slice(2).join(' ');
  
  if (!instruction) {
    console.log('🤖 Claude自然言語コマンドインタープリター');
    console.log('');
    console.log('使用方法:');
    console.log('  node scripts/claude-command-interpreter.cjs "PDCA評価を実行して"');
    console.log('  node scripts/claude-command-interpreter.cjs "仮想ユーザーを20人生成して"');
    console.log('');
    interpreter.showAvailableCommands();
    process.exit(0);
  }
  
  interpreter.interpretAndExecute(instruction)
    .then(result => {
      if (result && result.success) {
        console.log('\n✅ 指示を正常に実行しました！');
      } else {
        console.log('\n❌ 指示の実行に失敗しました。');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ エラー:', error);
      process.exit(1);
    });
}

module.exports = ClaudeCommandInterpreter;