import { readFile, writeFile } from 'fs/promises';

async function applyFinalFixes() {
  try {
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 全ての残存する不適切表現を一括修正
    const finalCorrections = {
      // 戦う・戦い関連
      '"不正や矛盾と戦う必要がある時"': '"不正や矛盾に立ち向かう必要がある時"',
      '"全力で戦う"': '"全力で対処する"',
      '"最後まで戦い抜く"': '"最後まで頑張り抜く"',
      '"全力で困難と戦う"': '"全力で困難に立ち向かう"',
      '"共に戦う仲間"': '"共に頑張る仲間"',
      
      // 破壊関連
      '"破壊再生型"': '"変革再生型"',
      '"時に破壊的すぎる"': '"時に変化が急激すぎる"',
      '"既存の枠組みを壊す"': '"既存の枠組みを変革する"',
      '"破壊的になる"': '"激しくなりすぎる"',
      '"破壊だけにならない"': '"変革だけにならない"',
      '"創造的な破壊を"': '"創造的な変革を"',
      
      // 衝突関連
      '"謙虚さで衝突を避ける"': '"謙虚さで対立を避ける"',
      '"衝突を避ける柔軟性"': '"対立を避ける柔軟性"',
      
      // 死関連
      '"不死鳥のような再生力"': '"フェニックスのような再生力"',
      '"🔋🔋🔋🔋🔋 (95%) - 不死鳥モード"': '"🔋🔋🔋🔋🔋 (95%) - 再生モード"',
      
      // 爆発関連
      '"激情爆発型"': '"感情表出型"',
      '"次の爆発に備える"': '"次の大きな活動に備える"',
      
      // 武器関連
      '"実績という武器"': '"実績という強み"',
      
      // 斬関連
      '"斬れ味鋭い刀"': '"明確な判断力"',
      
      // 敵関連（素敵の誤検出を避ける）
      '"素敵な出会い"': '"素敵な出会い"', // これは問題なし、そのまま
      
      // ぶつかる関連
      '"壁に正面からぶつかる"': '"困難に正面から向き合う"',
      
      // その他の攻撃的表現
      '攻撃': '批判',
      '反撃': '対応',
      '敵': '困難',
      '雷撃': '強い反応',
      '電撃': '瞬発的',
      '感電': '強い反応',
      '放電': 'エネルギー放出',
      '暴発': '衝動的な行動',
      '燃やし尽くす': '情熱を出し切る',
      '焼き尽くす': '情熱を注ぐ',
      '殺す': '止める',
      '死ぬ': '終わる',
      '暴力': '強い力',
      '弾': '力',
      '砲': '大きな力',
      '刃': '鋭さ',
      '切り裂く': '分ける',
      '壊れる': '変わる',
      '潰れる': '変形する',
      '叩く': '触れる',
      '殴る': '強く触れる',
      '蹴る': '押す',
      '撃つ': '放つ',
      '射る': '向ける',
      '激突': '接触',
      'ぶつける': '向ける',
      '激しく当たる': '強く接する'
    };
    
    // 修正を適用
    Object.entries(finalCorrections).forEach(([old, newText]) => {
      // 完全一致で置換
      content = content.replace(new RegExp(old, 'g'), newText);
    });
    
    // 追加の一般的な置換
    content = content
      .replace(/戦[うい]/g, '頑張る')
      .replace(/破壊/g, '変革')
      .replace(/衝突/g, '対立')
      .replace(/不死/g, '再生')
      .replace(/爆発/g, '大きな活動')
      .replace(/武器/g, '強み')
      .replace(/斬る/g, '分ける')
      .replace(/斬り/g, '分け')
      .replace(/ぶつか/g, '向き合')
      .replace(/爆/g, '大きな');
    
    // タイムスタンプ付きバックアップ
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`./public/js/data/hexagram-human-traits-v3.backup.final.${timestamp}.js`, 
                   await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8'));
    
    // 修正版を保存
    await writeFile('./public/js/data/hexagram-human-traits-v3.js', content);
    
    console.log('✅ 最終修正を適用しました');
    console.log(`📁 バックアップ: hexagram-human-traits-v3.backup.final.${timestamp}.js`);
    
    // 再チェック
    const window = {};
    eval(content);
    const v3Data = window.HexagramHumanTraitsV3;
    
    // 厳格パターンで再チェック
    const severePatterns = [
      /攻撃/g, /反撃/g, /敵(?!.*素敵)/g, /雷撃/g, /電撃/g, /感電/g,
      /爆発/g, /破壊/g, /燃やし尽くす/g, /焼き尽くす/g,
      /殺/g, /死(?!.*不死鳥)/g, /暴力/g, /暴発/g, /放電/g,
      /戦[うい]/g, /武器/g, /弾/g, /砲/g, /刃/g, /斬/g,
      /切り裂く/g, /壊す/g, /潰す/g, /叩き/g, /殴/g, /蹴/g,
      /撃[つち]/g, /射/g, /爆(?!.*情)/g, /激突/g, /衝突/g,
      /ぶつか/g, /ぶつけ/g, /激しく当たる/g
    ];
    
    let remainingProblems = 0;
    Object.entries(v3Data).forEach(([hexName, hex]) => {
      const checkText = (text) => {
        if (!text || typeof text !== 'string') return;
        severePatterns.forEach(pattern => {
          if (pattern.test(text)) {
            remainingProblems++;
            console.log(`⚠️ 残存: ${hexName} - "${text}"`);
          }
        });
      };
      
      const checkObject = (obj) => {
        if (!obj) return;
        Object.values(obj).forEach(value => {
          if (typeof value === 'string') checkText(value);
          else if (typeof value === 'object') checkObject(value);
        });
      };
      
      checkObject(hex);
    });
    
    if (remainingProblems === 0) {
      console.log('\n✅ 全ての不適切表現を修正完了しました！');
    } else {
      console.log(`\n⚠️ まだ ${remainingProblems} 件の問題が残っています`);
    }
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

applyFinalFixes();