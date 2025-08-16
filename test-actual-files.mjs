/**
 * 実際に配信されているファイルの特定テスト
 * ブラウザが見ているファイルと修正したファイルの差分確認
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function testActualFiles() {
    console.log('🔍 実際に配信されているファイルの特定');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        console.log('📂 Step 1: サーバーの配信状況確認');
        console.log('--------------------------------');
        
        // サーバーアクセス
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        // ページソースを取得
        const pageSource = await page.content();
        
        // ブラウザが実際に読み込んでいる内容を分析
        const browserContent = await page.evaluate(() => {
            return {
                title: document.title,
                h1Text: document.querySelector('h1')?.textContent?.trim(),
                subtitle: document.querySelector('h1')?.nextElementSibling?.textContent?.trim(),
                textareaPlaceholder: document.querySelector('textarea, #worryInput')?.placeholder,
                textareaId: document.querySelector('textarea, #worryInput')?.id,
                allTextareas: Array.from(document.querySelectorAll('textarea')).map(t => ({
                    id: t.id,
                    placeholder: t.placeholder
                })),
                hasStats: document.body.textContent.includes('384パターン'),
                bodyStartsWith: document.body.textContent.substring(0, 200)
            };
        });
        
        console.log('ブラウザが表示している内容:');
        console.log(`  ページタイトル: "${browserContent.title}"`);
        console.log(`  H1タイトル: "${browserContent.h1Text}"`);
        console.log(`  サブタイトル: "${browserContent.subtitle}"`);
        console.log(`  アクティブテキストエリアID: ${browserContent.textareaId}`);
        console.log(`  プレースホルダー: "${browserContent.textareaPlaceholder}"`);
        console.log(`  統計情報表示: ${browserContent.hasStats ? '✅' : '❌'}`);
        
        console.log('\n全テキストエリアの状況:');
        browserContent.allTextareas.forEach(ta => {
            console.log(`  ${ta.id}: "${ta.placeholder}"`);
        });
        
        console.log('\n📁 Step 2: ローカルファイルとの比較');
        console.log('--------------------------------');
        
        // public/future_simulator.htmlの内容確認
        const publicHtmlPath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/public/future_simulator.html';
        const publicHtml = fs.readFileSync(publicHtmlPath, 'utf8');
        
        // dist/future_simulator.htmlの存在確認
        const distHtmlPath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/dist/future_simulator.html';
        const distExists = fs.existsSync(distHtmlPath);
        
        console.log(`public/future_simulator.html: 存在`);
        console.log(`dist/future_simulator.html: ${distExists ? '存在' : '存在しない'}`);
        
        // publicファイルの内容分析
        const publicAnalysis = {
            title: publicHtml.match(/<title>(.*?)<\/title>/)?.[1] || 'タイトルなし',
            hasNewTitle: publicHtml.includes('易経未来分析システム'),
            hasOldTitle: publicHtml.includes('HaQei マルチバース'),
            hasObjectivePlaceholder: publicHtml.includes('現在の状況を客観的に記述'),
            hasEmotionalPlaceholder: publicHtml.includes('現在の悩みや課題を'),
            has384Stats: publicHtml.includes('384パターン')
        };
        
        console.log('\npublic/future_simulator.html の分析:');
        console.log(`  タイトル: "${publicAnalysis.title}"`);
        console.log(`  新タイトル含有: ${publicAnalysis.hasNewTitle ? '✅' : '❌'}`);
        console.log(`  旧タイトル含有: ${publicAnalysis.hasOldTitle ? '✅' : '❌'}`);
        console.log(`  客観的プレースホルダー: ${publicAnalysis.hasObjectivePlaceholder ? '✅' : '❌'}`);
        console.log(`  感情的プレースホルダー: ${publicAnalysis.hasEmotionalPlaceholder ? '✅' : '❌'}`);
        console.log(`  384統計情報: ${publicAnalysis.has384Stats ? '✅' : '❌'}`);
        
        // distファイルの分析（存在する場合）
        if (distExists) {
            const distHtml = fs.readFileSync(distHtmlPath, 'utf8');
            const distAnalysis = {
                title: distHtml.match(/<title>(.*?)<\/title>/)?.[1] || 'タイトルなし',
                hasNewTitle: distHtml.includes('易経未来分析システム'),
                hasOldTitle: distHtml.includes('HaQei マルチバース'),
                hasObjectivePlaceholder: distHtml.includes('現在の状況を客観的に記述'),
                hasEmotionalPlaceholder: distHtml.includes('現在の悩みや課題を'),
                has384Stats: distHtml.includes('384パターン')
            };
            
            console.log('\ndist/future_simulator.html の分析:');
            console.log(`  タイトル: "${distAnalysis.title}"`);
            console.log(`  新タイトル含有: ${distAnalysis.hasNewTitle ? '✅' : '❌'}`);
            console.log(`  旧タイトル含有: ${distAnalysis.hasOldTitle ? '✅' : '❌'}`);
            console.log(`  客観的プレースホルダー: ${distAnalysis.hasObjectivePlaceholder ? '✅' : '❌'}`);
            console.log(`  感情的プレースホルダー: ${distAnalysis.hasEmotionalPlaceholder ? '✅' : '❌'}`);
            console.log(`  384統計情報: ${distAnalysis.has384Stats ? '✅' : '❌'}`);
        }
        
        console.log('\n🔍 Step 3: 差分の特定');
        console.log('--------------------------------');
        
        // ブラウザ表示とpublicファイルの差分
        const differences = [];
        
        if (browserContent.title !== publicAnalysis.title) {
            differences.push(`タイトル不一致: ブラウザ="${browserContent.title}" vs ファイル="${publicAnalysis.title}"`);
        }
        
        if (browserContent.h1Text === 'HaQei' && publicAnalysis.hasNewTitle) {
            differences.push('H1タイトル: ブラウザ="HaQei" だが、ファイルは修正済み');
        }
        
        if (browserContent.textareaPlaceholder?.includes('悩み') && publicAnalysis.hasObjectivePlaceholder) {
            differences.push('プレースホルダー: ブラウザ="悩み系" だが、ファイルは修正済み');
        }
        
        if (!browserContent.hasStats && publicAnalysis.has384Stats) {
            differences.push('統計情報: ブラウザ=非表示 だが、ファイルには存在');
        }
        
        if (differences.length > 0) {
            console.log('❌ 差分発見:');
            differences.forEach(diff => {
                console.log(`  • ${diff}`);
            });
            
            console.log('\n💡 原因推測:');
            if (distExists) {
                console.log('  • dist/フォルダが優先配信されている可能性');
                console.log('  • public/の修正がdist/に反映されていない');
            } else {
                console.log('  • ブラウザキャッシュが原因');
                console.log('  • 別のファイルが配信されている');
            }
        } else {
            console.log('✅ ブラウザ表示とファイル内容が一致');
        }
        
        console.log('\n📋 Step 4: 修正対象ファイルの決定');
        console.log('--------------------------------');
        
        let targetFile;
        let reason;
        
        if (distExists) {
            targetFile = 'dist/future_simulator.html';
            reason = 'サーバーがdist/を優先配信している';
        } else {
            targetFile = 'public/future_simulator.html';
            reason = 'dist/が存在せず、public/が配信されている';
        }
        
        console.log(`修正対象: ${targetFile}`);
        console.log(`理由: ${reason}`);
        
        return {
            browserContent,
            publicAnalysis,
            distExists,
            distAnalysis: distExists ? true : false,
            differences,
            targetFile,
            needsUpdate: differences.length > 0
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error);
        return null;
    } finally {
        await browser.close();
    }
}

// 実行
testActualFiles().then(result => {
    if (result) {
        console.log('\n=====================================');
        console.log('📊 ファイル特定結果');
        console.log('=====================================');
        
        if (result.needsUpdate) {
            console.log(`🎯 修正が必要: ${result.targetFile}`);
            console.log(`差分数: ${result.differences.length}件`);
            
            console.log('\n次のアクション:');
            console.log('1. ブラウザキャッシュクリア');
            console.log(`2. ${result.targetFile} の直接修正`);
            console.log('3. サーバー再起動');
            console.log('4. 再検証');
        } else {
            console.log('✅ ファイルとブラウザ表示が一致');
            console.log('他の原因を調査する必要があります');
        }
    }
}).catch(console.error);