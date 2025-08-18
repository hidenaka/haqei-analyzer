import { chromium } from 'playwright';
import fs from 'fs';

console.log('🔍 Future Simulator 表示内容分析\n');
console.log('目的: 重複・理解困難な箇所の特定\n');

async function analyzeContent() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  const page = await browser.newPage();
  
  const analysis = {
    timestamp: new Date().toISOString(),
    sections: [],
    duplications: [],
    issues: []
  };
  
  try {
    // ページ読み込み
    console.log('📄 ページ読み込み...');
    await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/public/future_simulator.html');
    await page.waitForTimeout(2000);
    
    // テスト入力と実行
    console.log('📝 テスト実行...');
    await page.fill('#worryInput', '転職を検討していますが、タイミングが分からず悩んでいます');
    await page.click('#aiGuessBtn');
    
    // 結果表示を待つ
    await page.waitForTimeout(5000);
    
    // 1. 8つのカード（JJJ〜HHH）の内容確認
    console.log('\n📊 1. 8つのカード（JJJ〜HHH）の分析...');
    const cards = await page.evaluate(() => {
      const cardSelectors = [
        '.scenario-card',
        '.three-stage-item',
        '[class*="scenario"]',
        '.pattern-card'
      ];
      
      let foundCards = [];
      for (const selector of cardSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          foundCards = Array.from(elements).map(el => ({
            selector,
            title: el.querySelector('h3, h4, .title')?.textContent || '',
            content: el.textContent.substring(0, 200),
            hasClickHandler: el.onclick !== null || el.style.cursor === 'pointer'
          }));
          break;
        }
      }
      return foundCards;
    });
    
    console.log(`  発見されたカード数: ${cards.length}`);
    cards.slice(0, 3).forEach((card, i) => {
      console.log(`  カード${i+1}: ${card.title}`);
      console.log(`    内容: ${card.content.substring(0, 100)}...`);
      console.log(`    クリック可能: ${card.hasClickHandler}`);
    });
    
    analysis.sections.push({
      name: '8つのカード（JJJ〜HHH）',
      count: cards.length,
      samples: cards.slice(0, 3)
    });
    
    // 2. 易経の知恵セクションの確認
    console.log('\n🔮 2. 易経の知恵セクションの分析...');
    const ichingSection = await page.evaluate(() => {
      const sections = [];
      
      // 現在の状況
      const currentSituation = document.querySelector('.current-situation, [class*="current"]');
      if (currentSituation) {
        sections.push({
          type: '現在の状況',
          content: currentSituation.textContent.substring(0, 200),
          visible: window.getComputedStyle(currentSituation).display !== 'none'
        });
      }
      
      // 未来分析結果
      const futureAnalysis = document.querySelector('.future-analysis, [class*="future"]');
      if (futureAnalysis) {
        sections.push({
          type: '未来分析結果',
          content: futureAnalysis.textContent.substring(0, 200),
          visible: window.getComputedStyle(futureAnalysis).display !== 'none'
        });
      }
      
      // その他の易経関連要素
      document.querySelectorAll('[class*="hexagram"], [class*="iching"]').forEach(el => {
        sections.push({
          type: el.className,
          content: el.textContent.substring(0, 100),
          visible: window.getComputedStyle(el).display !== 'none'
        });
      });
      
      return sections;
    });
    
    console.log(`  易経関連セクション数: ${ichingSection.length}`);
    ichingSection.forEach(section => {
      console.log(`  - ${section.type}: ${section.visible ? '表示' : '非表示'}`);
      console.log(`    内容: ${section.content.substring(0, 80)}...`);
    });
    
    analysis.sections.push({
      name: '易経の知恵セクション',
      items: ichingSection
    });
    
    // 3. グラフの確認
    console.log('\n📈 3. グラフ要素の分析...');
    const graphs = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      const charts = [];
      
      canvases.forEach((canvas, i) => {
        const parent = canvas.parentElement;
        const title = parent.querySelector('h3, h4, .title')?.textContent || 
                     parent.previousElementSibling?.textContent || 
                     `グラフ${i+1}`;
        
        charts.push({
          id: canvas.id,
          title,
          visible: window.getComputedStyle(canvas).display !== 'none',
          width: canvas.width,
          height: canvas.height,
          hasData: canvas.getContext('2d').__data ? true : false
        });
      });
      
      return charts;
    });
    
    console.log(`  検出されたグラフ数: ${graphs.length}`);
    graphs.forEach(graph => {
      console.log(`  - ${graph.title}: ${graph.visible ? '表示' : '非表示'} (${graph.width}x${graph.height})`);
      console.log(`    データ: ${graph.hasData ? 'あり' : 'なし'}`);
    });
    
    analysis.sections.push({
      name: 'グラフ要素',
      items: graphs
    });
    
    // 4. 重複コンテンツの検出
    console.log('\n🔄 4. 重複コンテンツの検出...');
    const duplications = await page.evaluate(() => {
      const textContents = new Map();
      const duplicates = [];
      
      // すべてのテキストコンテンツを収集
      document.querySelectorAll('h1, h2, h3, h4, p, li').forEach(el => {
        const text = el.textContent.trim();
        if (text.length > 20) {
          if (textContents.has(text)) {
            duplicates.push({
              text: text.substring(0, 100),
              count: (textContents.get(text) || 0) + 1,
              elements: [textContents.get(text), el.tagName]
            });
          }
          textContents.set(text, el.tagName);
        }
      });
      
      return duplicates;
    });
    
    if (duplications.length > 0) {
      console.log(`  ⚠️ ${duplications.length}個の重複を検出`);
      duplications.slice(0, 3).forEach(dup => {
        console.log(`  - "${dup.text.substring(0, 50)}..." (${dup.count}回)`);
      });
    } else {
      console.log('  ✅ 重複なし');
    }
    
    analysis.duplications = duplications;
    
    // 5. カードクリックの動作確認
    console.log('\n🖱️ 5. カードクリック動作の確認...');
    if (cards.length > 0) {
      // 最初のカードをクリック
      const firstCard = await page.$('.scenario-card, .three-stage-item');
      if (firstCard) {
        await firstCard.click();
        await page.waitForTimeout(1000);
        
        // モーダルや詳細表示の確認
        const modalAppeared = await page.evaluate(() => {
          const modal = document.querySelector('.modal, [class*="detail"], [class*="popup"]');
          const expanded = document.querySelector('.expanded, .active');
          return {
            hasModal: modal && window.getComputedStyle(modal).display !== 'none',
            hasExpanded: expanded !== null,
            visibleChange: false
          };
        });
        
        console.log(`  モーダル表示: ${modalAppeared.hasModal ? 'あり' : 'なし'}`);
        console.log(`  展開表示: ${modalAppeared.hasExpanded ? 'あり' : 'なし'}`);
        
        analysis.interaction = modalAppeared;
      }
    }
    
    // 6. 理解困難な表現の検出
    console.log('\n📝 6. 理解困難な表現の検出...');
    const difficultTerms = await page.evaluate(() => {
      const terms = [];
      const difficultPatterns = [
        /[進変]爻/g,
        /卦[変遷]/g,
        /六[三四五]/g,
        /九[二三四]/g,
        /螺旋/g,
        /仮想段階/g,
        /両者敗北/g
      ];
      
      document.querySelectorAll('p, li, span').forEach(el => {
        const text = el.textContent;
        difficultPatterns.forEach(pattern => {
          const matches = text.match(pattern);
          if (matches) {
            terms.push({
              term: matches[0],
              context: text.substring(0, 100),
              element: el.tagName
            });
          }
        });
      });
      
      return terms;
    });
    
    console.log(`  難解な用語: ${difficultTerms.length}個検出`);
    difficultTerms.slice(0, 5).forEach(term => {
      console.log(`  - "${term.term}": ${term.context.substring(0, 50)}...`);
    });
    
    analysis.difficultTerms = difficultTerms;
    
    // スクリーンショット
    await page.screenshot({ 
      path: '20250814_content_analysis.png',
      fullPage: true 
    });
    
    // 分析結果の保存
    fs.writeFileSync(
      '20250814_content_analysis.json',
      JSON.stringify(analysis, null, 2)
    );
    
    // 問題点のサマリー
    console.log('\n' + '='.repeat(60));
    console.log('📊 問題点サマリー');
    console.log('='.repeat(60));
    
    analysis.issues = [];
    
    if (duplications.length > 0) {
      analysis.issues.push('コンテンツの重複あり');
      console.log('❌ コンテンツの重複が検出されました');
    }
    
    if (difficultTerms.length > 10) {
      analysis.issues.push('難解な専門用語が多い');
      console.log('❌ 難解な専門用語が多すぎます');
    }
    
    if (!analysis.interaction || (!analysis.interaction.hasModal && !analysis.interaction.hasExpanded)) {
      analysis.issues.push('カードクリックの詳細表示が機能していない');
      console.log('❌ カードクリックの詳細表示が機能していません');
    }
    
    if (graphs.some(g => !g.hasData)) {
      analysis.issues.push('データのないグラフがある');
      console.log('❌ データのないグラフが存在します');
    }
    
    console.log('\n📁 詳細分析結果: 20250814_content_analysis.json');
    console.log('📸 スクリーンショット: 20250814_content_analysis.png');
    
    // ブラウザを開いたまま待機
    console.log('\n⏳ ブラウザで確認してください（10秒待機）...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await browser.close();
  }
}

analyzeContent();