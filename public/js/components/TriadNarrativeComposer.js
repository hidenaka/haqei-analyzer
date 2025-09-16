/**
 * TriadNarrativeComposer
 * - Composes three-stage narrative (chain_long) dynamically per start and triad (JJJ..HHH)
 * - Uses H384_DATA and H64_DATA transforms so each card reflects real change steps
 */
(function (global) {
  'use strict';

  const TRIADS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];

  function assert(cond, msg) {
    if (!cond) throw new Error('[TriadNarrativeComposer] ' + msg);
  }

  function linePosFromName(name) {
    const s = String(name);
    if (s.includes('初')) return 1;
    if (s.includes('二')) return 2;
    if (s.includes('三')) return 3;
    if (s.includes('四')) return 4;
    if (s.includes('五')) return 5;
    if (s.includes('上')) return 6;
    return null;
  }

  function getH384(hex, line) {
    assert(Array.isArray(global.H384_DATA), 'H384_DATA not present');
    const idx = (hex - 1) * 6 + (line - 1);
    return global.H384_DATA[idx];
  }

  function transformHexByLine(hex, line) {
    // Use H64_DATA mapping: 初爻変..上爻変
    assert(Array.isArray(global.H64_DATA), 'H64_DATA not present');
    const row = global.H64_DATA.find(r => Number(r['卦番号']) === Number(hex));
    if (!row) return hex;
    const field = line === 1 ? '初爻変' : line === 2 ? '二爻変' : line === 3 ? '三爻変' : line === 4 ? '四爻変' : line === 5 ? '五爻変' : '上爻変';
    const nextHex = Number(row[field]);
    return Number.isFinite(nextHex) ? nextHex : hex;
  }

  function nextLineSameHex(hex, line) {
    return { hex, line: line < 6 ? line + 1 : 1 };
  }

  function followStep(state, stepChar) {
    if (stepChar === 'J') {
      const nl = nextLineSameHex(state.hex, state.line);
      return { hex: nl.hex, line: nl.line, action: '進爻' };
    } else {
      const nextHex = transformHexByLine(state.hex, state.line);
      return { hex: nextHex, line: state.line, action: '変爻' };
    }
  }

  function getStageSentence(stageIndex, action, entry) {
    const hexName = String(entry['卦名']).trim();
    const lineName = String(entry['爻']).trim();
    const keyword = Array.isArray(entry['キーワード']) && entry['キーワード'][0] ? entry['キーワード'][0] : '';
    const summary = String(entry['現代解釈の要約'] || '').trim();
    const prefix = stageIndex === 1 ? 'まず' : stageIndex === 2 ? '続いて' : '最後に';
    const actionText = action === '進爻' ? 'テーマを深め' : '視点を転換し';
    const kwText = keyword ? `（鍵: ${keyword}）` : '';
    return `${prefix}、${hexName} ${lineName}において${actionText}、${kwText}${summary}`;
  }

  function compose(hexNum, lineNum, triad) {
    assert(TRIADS.includes(triad), 'invalid triad');
    let state = { hex: hexNum, line: lineNum };
    const parts = [];
    for (let i = 0; i < 3; i++) {
      const stepChar = triad[i];
      const next = followStep(state, stepChar);
      const entry = getH384(next.hex, next.line);
      parts.push(getStageSentence(i+1, next.action, entry));
      state = { hex: next.hex, line: next.line };
    }
    // closing guidance
    parts.push('状況に応じて、三段階の選択を丁寧に実行しましょう。');
    return parts.join('');
  }

  global.TriadNarrativeComposer = { compose };
})(typeof window !== 'undefined' ? window : globalThis);

