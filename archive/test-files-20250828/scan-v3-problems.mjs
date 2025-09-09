import { readFile } from 'fs/promises';

async function scanV3Problems() {
  try {
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    const window = {};
    eval(content);
    
    const v3Data = window.HexagramHumanTraitsV3;
    
    console.log('=== V3データベース 問題表現スキャン ===\n');
    
    // 問題のある表現パターン
    const problemPatterns = [
      /雷で反撃/,
      /火で燃やす/,
      /水で流す/,
      /風で飛ばす/,
      /山で押しつぶす/,
      /沼に沈める/,
      /天に昇る/,
      /地に埋める/,
      /触れたら感電/,
      /爆発的な/,
      /破壊的な/,
      /全てを燃やし尽くす/,
      /敵を/,
      /攻撃/,
      /反撃/,
      /雷撃/,
      /放電/,
      /暴発/,
      /電撃/
    ];
    
    const problems = [];
    
    Object.entries(v3Data).forEach(([hexName, hex]) => {
      const checkText = (path, text) => {
        if (!text) return;
        
        problemPatterns.forEach(pattern => {
          if (pattern.test(text)) {
            problems.push({
              hexagram: hexName,
              path: path,
              text: text,
              pattern: pattern.source
            });
          }
        });
        
        // 追加チェック：短すぎる説明
        if (text.length < 10 && !path.includes('type') && !path.includes('style')) {
          problems.push({
            hexagram: hexName,
            path: path,
            text: text,
            issue: '説明が短すぎる'
          });
        }
      };
      
      // Engine OS
      if (hex.asEngineOS) {
        const os = hex.asEngineOS;
        checkText('asEngineOS.profile.description', os.profile?.description);
        checkText('asEngineOS.profile.metaphor', os.profile?.metaphor);
        checkText('asEngineOS.normalState.whatHappens', os.normalState?.whatHappens);
        checkText('asEngineOS.normalState.example', os.normalState?.example);
        checkText('asEngineOS.superMode.whatHappens', os.superMode?.whatHappens);
        checkText('asEngineOS.restMode.whatHappens', os.restMode?.whatHappens);
        checkText('asEngineOS.maintenance.warning', os.maintenance?.warning);
      }
      
      // Interface OS
      if (hex.asInterfaceOS) {
        const os = hex.asInterfaceOS;
        checkText('asInterfaceOS.profile.description', os.profile?.description);
        checkText('asInterfaceOS.profile.metaphor', os.profile?.metaphor);
        checkText('asInterfaceOS.howToTalk.style', os.howToTalk?.style);
        checkText('asInterfaceOS.howToTalk.example', os.howToTalk?.example);
      }
      
      // SafeMode OS
      if (hex.asSafeModeOS) {
        const os = hex.asSafeModeOS;
        checkText('asSafeModeOS.profile.description', os.profile?.description);
        checkText('asSafeModeOS.profile.metaphor', os.profile?.metaphor);
        checkText('asSafeModeOS.stressResponse.whatYouDo', os.stressResponse?.whatYouDo);
        checkText('asSafeModeOS.stressResponse.example', os.stressResponse?.example);
        checkText('asSafeModeOS.emergencyMode.whatHappens', os.emergencyMode?.whatHappens);
        checkText('asSafeModeOS.emergencyMode.example', os.emergencyMode?.example);
      }
    });
    
    console.log(`問題のある表現: ${problems.length}件\n`);
    
    // 卦ごとにグループ化
    const byHexagram = {};
    problems.forEach(p => {
      if (!byHexagram[p.hexagram]) {
        byHexagram[p.hexagram] = [];
      }
      byHexagram[p.hexagram].push(p);
    });
    
    Object.entries(byHexagram).forEach(([hexName, issues]) => {
      console.log(`\n【${hexName}】${issues.length}件の問題`);
      issues.forEach(issue => {
        console.log(`  ${issue.path}:`);
        console.log(`    "${issue.text}"`);
        if (issue.pattern) {
          console.log(`    問題: "${issue.pattern}"を含む`);
        } else if (issue.issue) {
          console.log(`    問題: ${issue.issue}`);
        }
      });
    });
    
    // 特に問題の多い卦を特定
    console.log('\n=== 問題の多い卦TOP10 ===');
    const sorted = Object.entries(byHexagram)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10);
    
    sorted.forEach(([hexName, issues], index) => {
      const hex = v3Data[hexName];
      console.log(`${index + 1}. ${hexName}（${hex.nickname}）: ${issues.length}件`);
    });
    
    return problems;
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

scanV3Problems();