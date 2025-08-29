import { readFile, writeFile } from 'fs/promises';

async function fixMoreShortTexts() {
  try {
    console.log('=== さらに短い説明文を修正（エンジン名・環境名など） ===\n');
    
    // データベース読み込み
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // バックアップ作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`./public/js/data/hexagram-human-traits-v3.backup.more.${timestamp}.js`, content);
    console.log(`📁 バックアップ作成: hexagram-human-traits-v3.backup.more.${timestamp}.js\n`);
    
    // 残りのエンジン名と環境名を修正
    const fixes = [
      // 8-9文字のエンジン名
      { old: '"資源蓄積エンジン"', new: '"資源を蓄積する堅実な原動力"' },
      { old: '"行動実践エンジン"', new: '"行動で実践する推進力"' },
      { old: '"変革推進エンジン"', new: '"変革を推進する革新的な力"' },
      { old: '"共感共鳴エンジン"', new: '"共感と共鳴を生む感情的な力"' },
      { old: '"統合実現エンジン"', new: '"統合を実現する調和の力"' },
      { old: '"謙虚成長エンジン"', new: '"謙虚さによる成長の原動力"' },
      { old: '"控えめサポート型"', new: '"控えめに支援するサポート型"' },
      { old: '"楽観推進エンジン"', new: '"楽観的に推進する前向きな力"' },
      { old: '"ポジティブ伝播型"', new: '"ポジティブを伝播する明るい型"' },
      { old: '"柔軟適応エンジン"', new: '"柔軟に適応する変化対応力"' },
      { old: '"観察見守りエンジン"', new: '"観察し見守る洞察の原動力"' },
      { old: '"削減簡素化エンジン"', new: '"削減し簡素化する効率化の力"' },
      { old: '"大容量蓄積エンジン"', new: '"大容量で蓄積する強大な力"' },
      { old: '"健康アドバイザー型"', new: '"健康を助言するアドバイザー型"' },
      { old: '"戦略的撤退エンジン"', new: '"戦略的に撤退する賢明な判断力"' },
      { old: '"パワー全開エンジン"', new: '"パワー全開で突進する強力な力"' },
      { old: '"独自性追求エンジン"', new: '"独自性を追求する個性的な力"' },
      { old: '"断定的リーダー型"', new: '"断定的に導くリーダー型"' },
      { old: '"献身的サポート型"', new: '"献身的に支援するサポート型"' },
      { old: '"成長を応援する人"', new: '"成長を応援する支援者"' },
      { old: '"ネットワーク構築型"', new: '"ネットワークを構築する連携型"' },
      { old: '"内省的フィードバック型"', new: '"内省的にフィードバックする型"' },
      { old: '"積極的アプローチ型"', new: '"積極的にアプローチする行動型"' },
      { old: '"慎重な情報収集型"', new: '"慎重に情報収集する分析型"' },
      { old: '"情熱的リーダー型"', new: '"情熱的に導くリーダー型"' },
      { old: '"忍耐強い支援型"', new: '"忍耐強く支援するサポート型"' },
      { old: '"現実的問題解決型"', new: '"現実的に問題解決する実践型"' },
      { old: '"創造的イノベーター型"', new: '"創造的に革新するイノベーター型"' },
      { old: '"戦略的プランナー型"', new: '"戦略的に計画するプランナー型"' },
      { old: '"協調的チームプレイヤー"', new: '"協調的なチームプレイヤー"' },
      { old: '"分析的オブザーバー型"', new: '"分析的に観察するオブザーバー型"' },
      { old: '"直感的ビジョナリー型"', new: '"直感的なビジョナリー型"' },
      { old: '"実践的エグゼキューター"', new: '"実践的なエグゼキューター"' },
      { old: '"調和的ファシリテーター"', new: '"調和的なファシリテーター"' },
      { old: '"革新的チェンジメーカー"', new: '"革新的なチェンジメーカー"' },
      { old: '"支援的メンター型"', new: '"支援的なメンター型"' },
      
      // 環境名の追加修正
      { old: '"ハイリスクな環境"', new: '"リスクの高い挑戦的な環境"' },
      { old: '"ネガティブな環境"', new: '"否定的な雰囲気の環境"' },
      { old: '"感情を軽視する環境"', new: '"感情を軽視する冷たい環境"' },
      { old: '"現状維持的な環境"', new: '"現状維持を好む保守的な環境"' },
      { old: '"スピード重視の環境"', new: '"スピードを重視する速い環境"' },
      { old: '"細部にこだわる環境"', new: '"細部にこだわる完璧主義的環境"' },
      { old: '"経験を軽視する環境"', new: '"経験を軽視する軽率な環境"' },
      { old: '"繊細さが必要な環境"', new: '"繊細さが必要な慎重な環境"' },
      { old: '"規則に縛られた環境"', new: '"規則に縛られた窮屈な環境"' },
      { old: '"急成長を求める環境"', new: '"急成長を求める野心的な環境"' },
      { old: '"競争が激しい環境"', new: '"競争が激しい厳しい環境"' },
      { old: '"創造性重視の環境"', new: '"創造性を重視する自由な環境"' },
      { old: '"形式的な環境"', new: '"形式を重んじる堅い環境"' },
      { old: '"自由度の高い環境"', new: '"自由度の高い柔軟な環境"' },
      { old: '"協調性重視の環境"', new: '"協調性を重視する和やかな環境"' },
      
      // 回復期間の修正
      { old: '"1週間（環境次第）"', new: '"環境により1週間程度で回復"' },
      { old: '"1週間（流れ次第）"', new: '"流れにより1週間程度で回復"' },
      { old: '"2週間（関係次第）"', new: '"関係性により2週間程度で回復"' },
      { old: '"2週間（ゆっくり）"', new: '"ゆっくりと2週間程度で回復"' },
      
      // その他の短い説明
      { old: '"奉仕の心を持つ人々"', new: '"奉仕の心を持つ献身的な人々"' },
      { old: '"人脈を広げ、繋げる"', new: '"人脈を広げて繋げる社交的な力"' },
      { old: '"社交的で明るい人々"', new: '"社交的で明るい性格の人々"' },
      { old: '"困難を恐れない人々"', new: '"困難を恐れない勇敢な人々"' },
      { old: '"成長を求める人々"', new: '"成長を求める向上心の高い人々"' },
      { old: '"安定を求める人々"', new: '"安定を求める堅実な人々"' },
      { old: '"変化を好む人々"', new: '"変化を好む柔軟な人々"' },
      { old: '"秩序を重視する人々"', new: '"秩序を重視する規律正しい人々"' },
      { old: '"自由を愛する人々"', new: '"自由を愛する独立心の強い人々"' },
      { old: '"調和を大切にする人々"', new: '"調和を大切にする平和的な人々"' }
    ];
    
    // 修正を適用
    let totalFixCount = 0;
    const appliedFixes = [];
    
    console.log('エンジン名・環境名等を修正中...\n');
    
    for (const fix of fixes) {
      const regex = new RegExp(fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, fix.new);
        totalFixCount += matches.length;
        appliedFixes.push({
          old: fix.old,
          new: fix.new,
          count: matches.length
        });
        console.log(`✅ ${fix.old} → ${fix.new} (${matches.length}箇所)`);
      }
    }
    
    // ファイル保存
    await writeFile('./public/js/data/hexagram-human-traits-v3.js', content);
    
    console.log(`\n=== 修正完了 ===`);
    console.log(`総修正件数: ${totalFixCount}件`);
    console.log(`修正項目数: ${appliedFixes.length}種類`);
    
    console.log('\n📝 修正済みファイル: ./public/js/data/hexagram-human-traits-v3.js');
    console.log(`📁 バックアップ: hexagram-human-traits-v3.backup.more.${timestamp}.js`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixMoreShortTexts();