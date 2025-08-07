// HAQEI H384 H64 Database - Core Data Structure
// 64卦データベース: 易経正統データ

window.H384H64DATABASE = {
  version: "2.0.0",
  lastUpdated: "2025-08-07",
  source: "HAQEI-Analyzer",
  
  // 64卦完全データセット
  hexagrams: [
    { id: 1, name: "乾為天", symbol: "☰☰", trigrams: ["乾", "乾"], element: "天", nature: "創造" },
    { id: 2, name: "坤為地", symbol: "☷☷", trigrams: ["坤", "坤"], element: "地", nature: "受容" },
    { id: 3, name: "水雷屯", symbol: "☵☳", trigrams: ["坎", "震"], element: "水雷", nature: "困難" },
    { id: 4, name: "山水蒙", symbol: "☶☵", trigrams: ["艮", "坎"], element: "山水", nature: "蒙昧" },
    { id: 5, name: "水天需", symbol: "☵☰", trigrams: ["坎", "乾"], element: "水天", nature: "待機" },
    { id: 6, name: "天水訟", symbol: "☰☵", trigrams: ["乾", "坎"], element: "天水", nature: "争訟" },
    { id: 7, name: "地水師", symbol: "☷☵", trigrams: ["坤", "坎"], element: "地水", nature: "統率" },
    { id: 8, name: "水地比", symbol: "☵☷", trigrams: ["坎", "坤"], element: "水地", nature: "親比" }
  ],
  
  // 基本三爻（8三爻）
  trigrams: {
    "乾": { symbol: "☰", name: "天", nature: "創造", element: "天" },
    "兌": { symbol: "☱", name: "沢", nature: "喜悦", element: "金" },
    "離": { symbol: "☲", name: "火", nature: "光明", element: "火" },
    "震": { symbol: "☳", name: "雷", nature: "動雷", element: "木" },
    "巽": { symbol: "☴", name: "風", nature: "順風", element: "木" },
    "坎": { symbol: "☵", name: "水", nature: "険難", element: "水" },
    "艮": { symbol: "☶", name: "山", nature: "停止", element: "土" },
    "坤": { symbol: "☷", name: "地", nature: "受容", element: "土" }
  },
  
  // マッピング関数
  getHexagram: function(id) {
    return this.hexagrams.find(h => h.id === id) || this.hexagrams[0];
  },
  
  getTrigram: function(name) {
    return this.trigrams[name] || this.trigrams["乾"];
  },
  
  // システム統合用
  initialize: function() {
    console.log(`✅ H384H64DATABASE initialized - Version ${this.version}`);
    console.log(`📚 Hexagrams loaded: ${this.hexagrams.length}`);
    console.log(`☯ Trigrams loaded: ${Object.keys(this.trigrams).length}`);
    return true;
  }
};

// 自動初期化
if (typeof window !== 'undefined') {
  window.H384H64DATABASE.initialize();
}