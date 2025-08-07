#!/usr/bin/env node

/**
 * Claude AI 自然言語インターフェース
 * 「claude-ai "○○を実行して"」で簡単にコマンド実行
 */

const ClaudeCommandInterpreter = require('./scripts/claude-command-interpreter.cjs');

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🤖 Claude AI コマンドインターフェース');
    console.log('');
    console.log('使用方法:');
    console.log('  claude-ai "PDCA評価を実行して"');
    console.log('  claude-ai "仮想ユーザーを20人生成して"'); 
    console.log('  claude-ai "OSアナライザーをテストして"');
    console.log('  claude-ai "サーバーを起動して"');
    console.log('  claude-ai "Claude Codeを起動して"');
    console.log('');
    console.log('📋 詳細なコマンド一覧:');
    
    const interpreter = new ClaudeCommandInterpreter();
    interpreter.showAvailableCommands();
    return;
  }
  
  const instruction = args.join(' ');
  const interpreter = new ClaudeCommandInterpreter();
  
  console.log(`🤖 Claude AI: "${instruction}"`);
  console.log('');
  
  const result = await interpreter.interpretAndExecute(instruction);
  
  if (result && result.success) {
    console.log('\n🎉 Claude AI: 指示を完了しました！');
  } else {
    console.log('\n😔 Claude AI: 指示の実行に失敗しました。');
    process.exit(1);
  }
}

main().catch(console.error);