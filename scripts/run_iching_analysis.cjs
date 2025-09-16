/*
  Minimal runner to execute IChingGuidanceEngine.performCompleteAnalysis()
  in a Node environment by stubbing window/document/localStorage and loading
  the in-repo H384 database and engine implementation.
*/

// 1) Minimal browser-like globals
global.window = global;
global.document = {
  readyState: 'complete',
  addEventListener: () => {}
};
global.localStorage = {
  _s: new Map(),
  getItem(k){ return this._s.has(k) ? this._s.get(k) : null; },
  setItem(k,v){ this._s.set(k, String(v)); },
  removeItem(k){ this._s.delete(k); }
};

// 2) Load H384/H64 data into window
require('../public/assets/H384H64database.js');

// Provide a minimal h384db so GuidanceEngine can use getDatabaseData()
global.window.h384db = {
  isLoaded: true,
  getDatabaseData: () => window.H384_DATA
};

// Safety check
if (!Array.isArray(window.H384_DATA) || window.H384_DATA.length < 10) {
  console.error('H384_DATA not loaded properly. length=', window.H384_DATA && window.H384_DATA.length);
  process.exit(1);
}

// 3) Load engine (registers window.iChingGuidance and auto-initializes)
require('../public/js/core/IChingGuidanceEngine.js');

async function main(){
  const inputText = process.env.INPUT || (
    '新しいシステムを今作っていて、2ヶ月ぐらい経ったけど、まだリリースには至っていません。' +
    '理由としては制作があんまり進まなかったということもあるけれども、本当にこれでいいのかってところで迷ったりすることがすごくあります。' +
    'ただ、今自分がやっていることは誰もやってないことだし、短期的に見ると、これでお金を稼げるかどうかわからないけれども、' +
    'やっていくうちに好きなことで淡々と続けられるっていうことを1回続けてみようと思っていて、これをやっているので、' +
    'ある程度結果が出るまでこれは続けていきたいなと思っています。その上で今これの発信活動のところの課題を持っていて、' +
    'どういう発信をしていけばいいのかというところを悩んでいます。'
  );

  // Ensure engine exists
  const engine = window.iChingGuidance || new window.IChingGuidanceEngine();
  if (!engine.isInitialized) {
    await engine.initialize();
  }

  const result = await engine.performCompleteAnalysis(inputText);
  if (!result) {
    console.error('No result');
    process.exit(2);
  }

  const cs = result.currentSituation || {};
  const top = result.topCandidates || [];
  const summary = {
    inputPreview: inputText.slice(0, 60) + '...',
    currentSituation: {
      hexagramNumber: cs.hexagramNumber,
      hexagramName: cs.hexagramName,
      yaoName: cs.yaoName,
      modernInterpretation: cs['現代解釈の要約']
    },
    reasons: cs.reasons || null,
    topCandidates: top.map(x => ({ hexagramName: x.hexagramName, yaoName: x.yaoName, score: Math.round(x.score) }))
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
