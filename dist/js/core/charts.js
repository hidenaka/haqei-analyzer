/**
 * @file charts.js - チャート描画ユーティリティ
 * @description 推奨度バー、スコア表示などの視覚化補助
 * Chart.js依存だが、D3.jsへの移行も想定した抽象化
 */

(function(global) {
    'use strict';

/**
 * 推奨度バーの生成
 * @param {number} value - 0-1の値
 * @param {Object} options - 描画オプション
 * @returns {HTMLElement} バー要素
 */
function createRecommendationBar(value, options = {}) {
    const {
        width = 200,
        height = 20,
        color = getColorByValue(value),
        showLabel = true,
        animated = true
    } = options;
    
    const container = document.createElement('div');
    container.className = 'relative inline-block';
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    
    // 背景バー
    const bg = document.createElement('div');
    bg.className = 'absolute inset-0 bg-gray-200 rounded-full overflow-hidden';
    
    // 値バー
    const bar = document.createElement('div');
    bar.className = `absolute left-0 top-0 h-full rounded-full ${animated ? 'transition-all duration-500' : ''}`;
    bar.style.width = '0%';
    bar.style.backgroundColor = color;
    
    // アニメーション
    if (animated) {
        setTimeout(() => {
            bar.style.width = `${value * 100}%`;
        }, 100);
    } else {
        bar.style.width = `${value * 100}%`;
    }
    
    bg.appendChild(bar);
    container.appendChild(bg);
    
    // ラベル
    if (showLabel) {
        const label = document.createElement('span');
        label.className = 'absolute inset-0 flex items-center justify-center text-xs font-medium';
        label.textContent = `${Math.round(value * 100)}%`;
        container.appendChild(label);
    }
    
    return container;
}

/**
 * 値に応じた色を取得
 * @param {number} value - 0-1の値
 * @returns {string} カラーコード
 */
function getColorByValue(value) {
    if (value >= 0.8) return '#10b981'; // green-500
    if (value >= 0.6) return '#3b82f6'; // blue-500
    if (value >= 0.4) return '#f59e0b'; // amber-500
    if (value >= 0.2) return '#ef4444'; // red-500
    return '#6b7280'; // gray-500
}

/**
 * スパークラインチャート
 * @param {number[]} data - データ配列
 * @param {Object} options - 描画オプション
 * @returns {HTMLCanvasElement} キャンバス要素
 */
function createSparkline(data, options = {}) {
    const {
        width = 100,
        height = 30,
        color = '#3b82f6',
        lineWidth = 2
    } = options;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!data || data.length < 2) return canvas;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    
    data.forEach((value, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    return canvas;
}

/**
 * レーダーチャートデータ準備
 * @param {Object} scores - スコアオブジェクト
 * @returns {Object} Chart.js用データ
 */
function prepareRadarData(scores) {
    const labels = Object.keys(scores);
    const data = Object.values(scores);
    
    return {
        labels,
        datasets: [{
            label: 'Score',
            data,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
        }]
    };
}

/**
 * 比較バーチャート
 * @param {Object} data1 - データセット1
 * @param {Object} data2 - データセット2
 * @param {HTMLElement} container - 描画先
 */
function renderComparisonBars(data1, data2, container) {
    const keys = [...new Set([...Object.keys(data1), ...Object.keys(data2)])];
    
    container.innerHTML = '';
    
    keys.forEach(key => {
        const row = document.createElement('div');
        row.className = 'flex items-center gap-2 mb-2';
        
        const label = document.createElement('div');
        label.className = 'w-24 text-sm';
        label.textContent = key;
        
        const bars = document.createElement('div');
        bars.className = 'flex-1 flex gap-1';
        
        const bar1 = createRecommendationBar(data1[key] || 0, {
            width: 100,
            height: 16,
            color: '#3b82f6',
            showLabel: false
        });
        
        const bar2 = createRecommendationBar(data2[key] || 0, {
            width: 100,
            height: 16,
            color: '#10b981',
            showLabel: false
        });
        
        bars.appendChild(bar1);
        bars.appendChild(bar2);
        
        row.appendChild(label);
        row.appendChild(bars);
        container.appendChild(row);
    });
}

// グローバルスコープにエクスポート
global.createRecommendationBar = createRecommendationBar;
global.createSparkline = createSparkline;
global.prepareRadarData = prepareRadarData;
global.renderComparisonBars = renderComparisonBars;

})(window);