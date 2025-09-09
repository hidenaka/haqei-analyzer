import { readFile, writeFile } from 'fs/promises';

async function generateCompleteMockV3() {
  try {
    // V3データベースファイルを読み込む
    const v3Content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // windowオブジェクトを模擬
    const window = {};
    eval(v3Content);
    
    const v3Data = window.HexagramHumanTraitsV3;
    
    // より多くの代表的な卦を選択（各タイプから代表を選ぶ）
    const selectedHexagrams = [
      "乾為天",     // イノベーター
      "坤為地",     // サポーター
      "水雷屯",     // パイオニア
      "山水蒙",     // 育成者
      "水天需",     // 戦略家
      "天水訟",     // 交渉人
      "離為火",     // 情熱者
      "坎為水",     // 流動者
      "震為雷",     // 衝撃者
      "艮為山",     // 不動者
      "巽為風",     // 浸透者
      "兌為澤",     // 喜悦者
      "澤火革",     // 革命者
      "火風鼎",     // 創造者
      "水火既済",   // 完成者
    ];
    
    // V3データベースのJavaScript部分を生成
    let v3DatabaseJS = "const v3Database = {\n";
    
    selectedHexagrams.forEach((hexName, index) => {
      const hex = v3Data[hexName];
      if (!hex) return;
      
      v3DatabaseJS += `            "${hexName}": ${JSON.stringify(hex, null, 16)},\n`;
    });
    
    v3DatabaseJS = v3DatabaseJS.slice(0, -2) + "\n        };";
    
    // 新しいパターンを生成（より多様なパターン）
    const dataPatterns = `
        const dataPatterns = {
            innovator: {
                engineOS: { hexagram: "乾為天", score: 92 },
                interfaceOS: { hexagram: "離為火", score: 75 },
                safeModeOS: { hexagram: "震為雷", score: 68 }
            },
            supporter: {
                engineOS: { hexagram: "坤為地", score: 85 },
                interfaceOS: { hexagram: "山水蒙", score: 88 },
                safeModeOS: { hexagram: "艮為山", score: 72 }
            },
            balanced: {
                engineOS: { hexagram: "水天需", score: 80 },
                interfaceOS: { hexagram: "巽為風", score: 79 },
                safeModeOS: { hexagram: "坎為水", score: 81 }
            },
            revolutionary: {
                engineOS: { hexagram: "澤火革", score: 89 },
                interfaceOS: { hexagram: "火風鼎", score: 86 },
                safeModeOS: { hexagram: "天水訟", score: 73 }
            },
            stabilizer: {
                engineOS: { hexagram: "艮為山", score: 77 },
                interfaceOS: { hexagram: "水火既済", score: 82 },
                safeModeOS: { hexagram: "兌為澤", score: 78 }
            }
        };`;
    
    // mockファイルを読み込んで更新
    let mockContent = await readFile('./results-dynamic-mockup.html', 'utf-8');
    
    // v3Databaseセクションを置き換え
    mockContent = mockContent.replace(
      /const v3Database = \{[\s\S]*?\};/,
      v3DatabaseJS
    );
    
    // dataPatternsセクションを置き換え
    mockContent = mockContent.replace(
      /const dataPatterns = \{[\s\S]*?\};/,
      dataPatterns
    );
    
    // ボタンを追加
    const newButtons = `
                    <button onclick="loadPattern('innovator')" style="padding: 0.5rem 1rem; background: var(--primary-blue); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        パターン1: イノベーター型
                    </button>
                    <button onclick="loadPattern('supporter')" style="padding: 0.5rem 1rem; background: var(--interface-color); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        パターン2: サポーター型
                    </button>
                    <button onclick="loadPattern('balanced')" style="padding: 0.5rem 1rem; background: var(--safemode-color); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        パターン3: バランス型
                    </button>
                    <button onclick="loadPattern('revolutionary')" style="padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        パターン4: 革命型
                    </button>
                    <button onclick="loadPattern('stabilizer')" style="padding: 0.5rem 1rem; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        パターン5: 安定型
                    </button>`;
    
    mockContent = mockContent.replace(
      /<button onclick="loadPattern\('innovator'\)[\s\S]*?<\/button>\s*<button onclick="loadPattern\('supporter'\)[\s\S]*?<\/button>\s*<button onclick="loadPattern\('balanced'\)[\s\S]*?<\/button>/,
      newButtons
    );
    
    // 新しいmockファイルを保存
    await writeFile('./results-dynamic-mockup-v3-complete.html', mockContent, 'utf-8');
    
    console.log('✅ 完全版V3モックファイルを生成しました: results-dynamic-mockup-v3-complete.html');
    console.log(`\n📊 追加された卦（合計${selectedHexagrams.length}個）:`);
    selectedHexagrams.forEach((hex, i) => {
      const data = v3Data[hex];
      console.log(`  ${i+1}. ${hex} (${data.nickname})`);
    });
    
    console.log('\n🎯 新しいパターン:');
    console.log('  - innovator: イノベーター型');
    console.log('  - supporter: サポーター型');
    console.log('  - balanced: バランス型');
    console.log('  - revolutionary: 革命型');
    console.log('  - stabilizer: 安定型');
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

generateCompleteMockV3();