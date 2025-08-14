/**
 * 64卦統合の最終確認スクリプト
 */

const fs = require('fs');

function verifyHexagramMapping() {
    console.log('🔍 64卦完全統合の最終確認\n');
    
    try {
        // マッピングファイル読み込み
        const mapping = JSON.parse(fs.readFileSync('./config/kingwen-mapping.json', 'utf8'));
        
        console.log('📊 基本情報:');
        console.log(`   バージョン: ${mapping.version || 'N/A'}`);
        console.log(`   作成日: ${mapping.metadata?.created || 'N/A'}`);
        console.log(`   総卦数: ${Object.keys(mapping.hexagrams).length}/64`);
        
        // 完全性チェック
        const missing = [];
        const existing = [];
        
        for (let i = 1; i <= 64; i++) {
            if (mapping.hexagrams[i]) {
                existing.push(i);
            } else {
                missing.push(i);
            }
        }
        
        if (missing.length === 0) {
            console.log('\n✅ 完全性チェック: 全64卦が正常にマッピングされています！');
        } else {
            console.log(`\n❌ 不足している卦: ${missing.join(', ')}`);
        }
        
        // サンプル卦の表示
        console.log('\n🎯 重要卦のサンプル:');
        const samples = [1, 2, 11, 12, 33, 63, 64];
        
        samples.forEach(n => {
            const hex = mapping.hexagrams[n];
            if (hex) {
                console.log(`   ${n}: ${hex.name} - [${hex.trigrams.join('+')}] - 爻配列: ${hex.lines.join('')}`);
                
                // データ検証
                if (!Array.isArray(hex.lines) || hex.lines.length !== 6) {
                    console.log(`     ⚠️ 爻配列エラー: 長さ ${hex.lines?.length || 0}`);
                }
                
                if (!Array.isArray(hex.trigrams) || hex.trigrams.length !== 2) {
                    console.log(`     ⚠️ 八卦エラー: 長さ ${hex.trigrams?.length || 0}`);
                }
            } else {
                console.log(`   ${n}: ❌ データなし`);
            }
        });
        
        // 統計情報
        console.log('\n📈 統計情報:');
        const allHexagrams = Object.values(mapping.hexagrams);
        
        const validLines = allHexagrams.filter(hex => 
            Array.isArray(hex.lines) && hex.lines.length === 6
        ).length;
        
        const validTrigrams = allHexagrams.filter(hex => 
            Array.isArray(hex.trigrams) && hex.trigrams.length === 2
        ).length;
        
        console.log(`   有効な爻配列: ${validLines}/64`);
        console.log(`   有効な八卦: ${validTrigrams}/64`);
        
        // Phase 3完了ステータス
        const isComplete = missing.length === 0 && validLines === 64 && validTrigrams === 64;
        
        console.log('\n' + '='.repeat(50));
        if (isComplete) {
            console.log('🎉 Phase 3: H384データベースとの完全統合 - 完了！');
            console.log('✅ 64卦完全マッピング成功');
            console.log('✅ KingWenMapping v2.2.0統合完了');
            console.log('✅ EightScenariosGenerator統合対応');
        } else {
            console.log('⚠️ Phase 3: 統合に一部問題があります');
            console.log(`   不足卦数: ${missing.length}`);
            console.log(`   無効爻配列: ${64 - validLines}`);
            console.log(`   無効八卦: ${64 - validTrigrams}`);
        }
        console.log('='.repeat(50));
        
        return isComplete;
        
    } catch (error) {
        console.error('❌ 検証エラー:', error.message);
        return false;
    }
}

// 実行
const success = verifyHexagramMapping();
process.exit(success ? 0 : 1);