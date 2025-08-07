const { chromium } = require("playwright");

async function testChartJsFix() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  const page = await browser.newPage();

  try {
    console.log("📊 Chart.js修正検証開始");
    
    await page.goto("http://127.0.0.1:8084/future_simulator.html", {
      waitUntil: "networkidle"
    });
    
    // Chart.js読み込み確認
    const chartStatus = await page.evaluate(() => {
      return {
        chartExists: typeof window.Chart !== 'undefined',
        chartVersion: typeof window.Chart !== 'undefined' ? window.Chart.version : 'N/A',
        chartConstructor: typeof window.Chart === 'function',
        globalObjects: Object.keys(window).filter(key => key.toLowerCase().includes('chart'))
      };
    });
    
    console.log("📊 Chart.js状態:", chartStatus);
    
    // Chart.jsファイルの直接読み込みテスト
    const chartRequest = await page.evaluate(async () => {
      try {
        const response = await fetch('/js/lib/chart.min.js');
        return {
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type'),
          size: response.headers.get('content-length')
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log("📁 Chart.jsファイル状態:", chartRequest);
    
    // 簡単なChart作成テスト
    const chartTest = await page.evaluate(() => {
      if (typeof window.Chart === 'undefined') {
        return { success: false, reason: 'Chart not available' };
      }
      
      try {
        // テスト用のcanvasを作成
        const canvas = document.createElement('canvas');
        canvas.id = 'testChart';
        canvas.width = 400;
        canvas.height = 200;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Test1', 'Test2', 'Test3'],
            datasets: [{
              label: 'Test Dataset',
              data: [1, 2, 3],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          options: {
            responsive: false,
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
        
        return { 
          success: true, 
          chartId: chart.id,
          canvasCreated: true
        };
      } catch (error) {
        return { 
          success: false, 
          reason: error.message 
        };
      }
    });
    
    console.log("🎨 Chart作成テスト:", chartTest);
    
    await page.screenshot({ path: "chart-js-fix-verification.png", fullPage: true });
    
    return {
      chartStatus,
      chartRequest,
      chartTest,
      success: chartStatus.chartExists && chartTest.success
    };
    
  } catch (error) {
    console.error("❌ Chart.jsテストエラー:", error.message);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

testChartJsFix().then(result => {
  console.log("🎯 Chart.js修正検証結果:");
  console.log(JSON.stringify(result, null, 2));
  
  if (result.success) {
    console.log("✅ Chart.js修正完了 - 完全動作確認");
  } else {
    console.log("❌ Chart.js修正要追加対応");
  }
});