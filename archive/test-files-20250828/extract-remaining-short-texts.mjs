import { readFile, writeFile } from 'fs/promises';

async function extractRemainingShortTexts() {
  try {
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    const window = {};
    eval(content);
    
    const v3Data = window.HexagramHumanTraitsV3;
    
    // 除外フィールド
    const excludeFields = [
      'type', 'emoji', 'symbol', 'element', 'nickname', 
      'energyLevel', 'id', 'season', 'time', 'direction'
    ];
    
    // 全ての短い説明を収集
    const shortTexts = new Map();
    
    const checkField = (hexName, path, text) => {
      if (!text || typeof text !== 'string') return;
      
      // 除外フィールドをスキップ
      const shouldExclude = excludeFields.some(field => path.includes(field));
      if (shouldExclude) return;
      
      // 10文字未満の説明を記録
      if (text.length < 10) {
        if (!shortTexts.has(text)) {
          shortTexts.set(text, []);
        }
        shortTexts.get(text).push({
          hexagram: hexName,
          path: path
        });
      }
    };
    
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
    
    // 修正マッピングを生成
    const fixes = {};
    const sortedTexts = Array.from(shortTexts.entries())
      .sort((a, b) => a[0].length - b[0].length);
    
    console.log(`総数: ${sortedTexts.length}件の短い説明を発見\n`);
    
    sortedTexts.forEach(([text, locations]) => {
      // パスに基づいて適切な修正文を生成
      const firstLocation = locations[0];
      const path = firstLocation.path;
      
      let fixedText = text;
      
      // パスに応じた修正を適用
      if (path.includes('howToCharge')) {
        fixedText = `${text}からエネルギーを得る`;
      } else if (path.includes('howToRest')) {
        fixedText = `${text}して心身を休める`;
      } else if (path.includes('howToRecover')) {
        fixedText = `${text}で回復を図る`;
      } else if (path.includes('bestWay')) {
        fixedText = `${text}することが最も効果的`;
      } else if (path.includes('support')) {
        fixedText = `${text}してくれる人の存在`;
      } else if (path.includes('environment')) {
        fixedText = `${text}できる環境が必要`;
      } else if (path.includes('whatYouNeed')) {
        fixedText = `${text}が必要不可欠`;
      } else if (path.includes('withWho')) {
        fixedText = `${text}と一緒にいると良い`;
      } else if (path.includes('where')) {
        fixedText = `${text}できる場所が最適`;
      } else if (path.includes('style')) {
        fixedText = `${text}な話し方をする`;
      } else if (path.includes('notGoodAt')) {
        fixedText = `${text}が苦手な傾向`;
      } else if (path.includes('goodAt')) {
        fixedText = `${text}が得意な能力`;
      } else if (path.includes('strength')) {
        fixedText = `${text}という強みがある`;
      } else if (path.includes('weakness')) {
        fixedText = `${text}という弱点がある`;
      } else if (path.includes('goodPoint')) {
        fixedText = `${text}という良い点がある`;
      } else if (path.includes('badPoint')) {
        fixedText = `${text}という改善点がある`;
      } else if (path.includes('recovery')) {
        fixedText = `${text}して回復する方法`;
      } else if (path.includes('whatHappens')) {
        fixedText = `${text}という状態になる`;
      } else if (path.includes('tip')) {
        fixedText = `${text}することがコツ`;
      } else if (path.includes('advice')) {
        fixedText = `${text}することが大切`;
      } else if (path.includes('note')) {
        fixedText = `${text}に注意が必要`;
      } else {
        // デフォルトの拡張
        if (text.length <= 5) {
          fixedText = `${text}を大切にする姿勢`;
        } else if (text.length <= 7) {
          fixedText = `${text}を心がけること`;
        } else {
          fixedText = `${text}という特徴`;
        }
      }
      
      // 最低10文字を確保
      if (fixedText.length < 10) {
        fixedText = fixedText + "を意識する";
      }
      
      fixes[`"${text}"`] = `"${fixedText}"`;
    });
    
    // ファイルに保存
    await writeFile('./remaining-fixes-detailed.json', JSON.stringify(fixes, null, 2));
    console.log('修正マッピング生成完了: remaining-fixes-detailed.json');
    
    return fixes;
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

extractRemainingShortTexts();