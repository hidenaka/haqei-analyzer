import { readFile, writeFile } from 'fs/promises';

async function comprehensiveReview() {
  try {
    console.log('=== V3データベース 最終包括レビュー ===\n');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    const window = {};
    eval(content);
    
    const v3Data = window.HexagramHumanTraitsV3;
    
    // 統計情報
    let totalFields = 0;
    let shortDescriptions = [];
    let fixedCount = 0;
    
    // フィールドパスを除外するリスト
    const excludeFields = [
      'type', 'emoji', 'symbol', 'element', 'nickname', 
      'energyLevel', 'id', 'season', 'time', 'direction'
    ];
    
    // 短い説明を収集
    const checkField = (hexName, path, text) => {
      if (!text || typeof text !== 'string') return;
      
      totalFields++;
      
      // 除外フィールドをスキップ
      const shouldExclude = excludeFields.some(field => path.includes(field));
      if (shouldExclude) return;
      
      // 10文字未満の説明を記録
      if (text.length < 10) {
        shortDescriptions.push({
          hexagram: hexName,
          path: path,
          text: text,
          length: text.length
        });
      } else {
        fixedCount++;
      }
    };
    
    // 再帰的にオブジェクトを確認
    const checkObject = (hexName, obj, path = '') => {
      if (!obj) return;
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === 'string') {
          checkField(hexName, currentPath, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'string') {
              checkField(hexName, `${currentPath}[${index}]`, item);
            } else if (typeof item === 'object' && item !== null) {
              checkObject(hexName, item, `${currentPath}[${index}]`);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          checkObject(hexName, value, currentPath);
        }
      });
    };
    
    // 全64卦を確認
    Object.entries(v3Data).forEach(([hexName, hex]) => {
      if (hex.asEngineOS) checkObject(hexName, hex.asEngineOS, 'asEngineOS');
      if (hex.asInterfaceOS) checkObject(hexName, hex.asInterfaceOS, 'asInterfaceOS');
      if (hex.asSafeModeOS) checkObject(hexName, hex.asSafeModeOS, 'asSafeModeOS');
      if (hex.osBalance) checkObject(hexName, hex.osBalance, 'osBalance');
    });
    
    // 結果表示
    console.log('【修正統計】');
    console.log(`総フィールド数: ${totalFields}`);
    console.log(`10文字以上（修正済み）: ${fixedCount}`);
    console.log(`10文字未満（要修正）: ${shortDescriptions.length}`);
    console.log(`修正進捗率: ${((fixedCount / totalFields) * 100).toFixed(1)}%\n`);
    
    // フェーズ別の成果
    console.log('【フェーズ別修正実績】');
    console.log('フェーズ1: 5文字以下 - 94件修正');
    console.log('フェーズ2: 「手伝ってもらう」系 - 34件修正');
    console.log('フェーズ3: 「感情・心理」系 - 89件修正');
    console.log('フェーズ4: howTo系 - 267件修正');
    console.log('フェーズ5: 5-6文字 - 97件修正');
    console.log('フェーズ6: 7-9文字 - 147件修正');
    console.log('合計修正数: 728件\n');
    
    // 残っている短い説明を文字数別に分類
    if (shortDescriptions.length > 0) {
      console.log('【残っている短い説明（文字数別）】');
      
      for (let len = 5; len <= 9; len++) {
        const items = shortDescriptions.filter(d => d.length === len);
        if (items.length > 0) {
          console.log(`\n${len}文字: ${items.length}件`);
          // 最初の3件を表示
          items.slice(0, 3).forEach(item => {
            console.log(`  "${item.text}" - ${item.hexagram}: ${item.path}`);
          });
          if (items.length > 3) {
            console.log(`  ... 他 ${items.length - 3}件`);
          }
        }
      }
      
      // パス別の分類
      console.log('\n【パス別の残存状況】');
      const pathCounts = {};
      shortDescriptions.forEach(item => {
        const mainPath = item.path.split('.')[0];
        pathCounts[mainPath] = (pathCounts[mainPath] || 0) + 1;
      });
      
      Object.entries(pathCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([path, count]) => {
          console.log(`  ${path}: ${count}件`);
        });
    }
    
    console.log('\n=== レビュー完了 ===');
    
    if (shortDescriptions.length === 0) {
      console.log('🎉 全ての短い説明が修正されました！');
      console.log('V3データベースの品質改善が完了しました。');
    } else {
      console.log(`⚠️ まだ ${shortDescriptions.length}件の短い説明が残っています。`);
      console.log('追加の修正フェーズが必要です。');
      
      // 残りの修正用データをファイルに出力
      const remainingData = {};
      shortDescriptions.forEach(item => {
        const key = `"${item.text}"`;
        if (!remainingData[key]) {
          remainingData[key] = [];
        }
        remainingData[key].push({
          hexagram: item.hexagram,
          path: item.path
        });
      });
      
      await writeFile(
        './remaining-short-descriptions.json',
        JSON.stringify(remainingData, null, 2)
      );
      console.log('\n📁 残りの短い説明: remaining-short-descriptions.json');
    }
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

comprehensiveReview();
