// InsightEngine.js - 診断結果パーソナライズ生成エンジン
// HaQei Analyzer

/**
 * OS詳細解説テキスト生成（改善版品質）
 * @param {object} hexagram - 64卦データ（hexagrams_masterの1件）
 * @param {object} osManual - os_manual[hexagram_id]
 * @returns {string}
 */
function getOSDetailText(hexagram, osManual) {
  if (!hexagram) return "";
  
  // hexagramのname_jpプロパティまたはnameプロパティを取得
  const hexagramName = hexagram.name_jp || hexagram.name || "名称不明";
  const hexagramCatchphrase = hexagram.catchphrase || "";
  const hexagramDescription = hexagram.description || "";
  const hexagramKeywords = hexagram.keywords || "";
  
  // 改善版品質用の詳細情報を組み込み
  const keywordShort = osManual?.keyword_short || "";
  const archetypeIcon = osManual?.archetype_icon || "";
  const summary = osManual?.summary || "";
  const strategicRoles = osManual?.strategic_roles || [];
  const microExamples = osManual?.micro_examples || [];
  
  return `
【${hexagramName}】${archetypeIcon ? " " + archetypeIcon : ""}
${hexagramCatchphrase ? "「" + hexagramCatchphrase + "」\n" : ""}
${keywordShort ? "📍 *" + keywordShort + "*\n" : ""}

${hexagramDescription ? hexagramDescription + "\n\n" : ""}
${summary ? "🎯 **人格の核心**\n" + summary + "\n\n" : ""}
${strategicRoles.length > 0 ? "🔧 **戦略的役割**\n" + strategicRoles.map(role => "• " + role).join("\n") + "\n\n" : ""}
${microExamples.length > 0 ? "💡 **具体例**\n" + microExamples.map(example => "• " + example).join("\n") + "\n\n" : ""}
${
  osManual?.proactive_use
    ? "🚀 **このOSを攻めに使うと？**\n" + osManual.proactive_use + "\n\n"
    : ""
}
${
  osManual?.defensive_use
    ? "🛡️ **このOSが守りに入ると？**\n" + osManual.defensive_use + "\n\n"
    : ""
}
${
  osManual?.debug_pattern || osManual?.debug_method
    ? "🔧 **暴走時のデバッグ方法**\n" +
      (osManual.debug_pattern ? "⚠️ 症状: " + osManual.debug_pattern + "\n" : "") +
      (osManual.debug_method ? "💊 対処法: " + osManual.debug_method + "\n" : "") +
      "\n"
    : ""
}
${
  osManual?.quests && osManual.quests.length > 0
    ? "🎯 **今週のクエスト**\n" + osManual.quests.map((quest, i) => "" + (i + 1) + ". " + quest).join("\n") + "\n"
    : ""
}
`.trim();
}

/**
 * 五行関係を判定
 * @param {string} element1
 * @param {string} element2
 * @param {Array} elementRelationships
 * @returns {string} 相生/相剋/なし
 */
function getElementRelationship(
  element1,
  element2,
  elementRelationships
) {
  if (!element1 || !element2) return "";
  const rel = elementRelationships.find(
    (r) => r.source_element === element1 && r.target_element === element2
  );
  return rel ? rel.relationship_type : "";
}

/**
 * パーソナライズ洞察テキスト生成（改善版品質）
 * @param {object} engineHex - エンジンOS hexagram
 * @param {object} interfaceHex - インターフェースOS hexagram
 * @param {object} safeHex - セーフモードOS hexagram
 * @param {Array} trigramsMaster
 * @param {Array} elementRelationships
 * @param {object} bible - 彖伝・大象伝データ
 * @returns {string}
 */
function getPersonalizedInsight(
  engineHex,
  interfaceHex,
  safeHex,
  trigramsMaster,
  elementRelationships,
  bible = null
) {
  // 各OSの主トリグラムの五行を取得
  const getElement = (hex) => {
    if (!hex) return "";
    const trig = trigramsMaster.find(
      (t) => t.trigram_id === hex.upper_trigram_id
    );
    return trig ? trig.element : "";
  };
  const engineElem = getElement(engineHex);
  const interfaceElem = getElement(interfaceHex);
  const safeElem = getElement(safeHex);

  // 五行関係
  const relEI = getElementRelationship(
    engineElem,
    interfaceElem,
    elementRelationships
  );
  const relES = getElementRelationship(
    engineElem,
    safeElem,
    elementRelationships
  );
  const relIS = getElementRelationship(
    interfaceElem,
    safeElem,
    elementRelationships
  );

  // 安全な名前取得
  const getHexagramName = (hex) => hex?.name_jp || hex?.name || "不明なOS";
  
  const engineName = getHexagramName(engineHex);
  const interfaceName = getHexagramName(interfaceHex);
  const safeName = getHexagramName(safeHex);

  // 改善版品質洞察生成
  let text = "";
  
  // 人格構造全体の説明
  text += "🧠 **あなたの人格構造の全体像**\n";
  text += `あなたは「${engineName}」を核として、「${interfaceName}」で世界と関わり、「${safeName}」で自分を守る多層構造を持っています。\n\n`;
  
  // 五行関係による詳細な洞察
  text += "⚡ **エネルギーの流れと相互作用**\n";
  
  // エンジンOS → インターフェースOS
  if (relEI === "相生") {
    const relationship = elementRelationships.find(
      (r) => r.source_element === engineElem && r.target_element === interfaceElem
    );
    if (relationship) {
      text += relationship.metaphor_text.replace("{source}", `あなたの核となる「${engineName}」`).replace("{target}", `表面的な「${interfaceName}」`) + "\n";
    }
    text += "これは非常に理想的なエネルギーの流れです。あなたの本質が自然に外面に現れ、周囲に良い影響を与えます。\n\n";
  } else if (relEI === "相剋") {
    const relationship = elementRelationships.find(
      (r) => r.source_element === engineElem && r.target_element === interfaceElem
    );
    if (relationship) {
      text += relationship.metaphor_text.replace("{source}", `あなたの核となる「${engineName}」`).replace("{target}", `表面的な「${interfaceName}」`) + "\n";
    }
    text += "この関係性は、内面と外面の間で葛藤を生み出しやすいですが、同時に独特の魅力と成長の機会をもたらします。\n\n";
  }
  
  // エンジンOS → セーフモードOS
  if (relES === "相生") {
    text += `また、あなたの「${engineName}」と「${safeName}」の組み合わせは、内面の安定や回復力を高める好循環を生み出します。\n`;
  } else if (relES === "相剋") {
    text += `一方で、「${engineName}」と「${safeName}」の間には、無意識下での葛藤が生じやすい傾向があります。この違いを受け入れ、両方の側面を活かす工夫が大切です。\n`;
  }
  
  // インターフェースOS → セーフモードOS
  if (relIS === "相生") {
    text += `さらに、「${interfaceName}」と「${safeName}」の組み合わせも、公私のバランスを保つ上で有効に働きます。\n\n`;
  } else if (relIS === "相剋") {
    text += `「${interfaceName}」と「${safeName}」の間には微妙な緊張関係があり、表の顔と内面の整合性を保つことが重要になります。\n\n`;
  }
  
  // 人格一貫性の評価
  text += "🎯 **人格の一貫性と成長のヒント**\n";
  let consistency = 0;
  if (relEI === "相生") consistency += 1;
  if (relES === "相生") consistency += 1;
  if (relIS === "相生") consistency += 1;
  
  if (consistency === 3) {
    text += "あなたの3つのOSは非常に調和のとれた関係にあり、一貫性の高い人格を形成しています。この安定感を活かして、リーダーシップを発揮できるでしょう。\n";
  } else if (consistency === 2) {
    text += "あなたの人格は全体的に安定していますが、一部に成長の余地があります。この多面性こそが、あなたの独特の魅力となっています。\n";
  } else if (consistency === 1) {
    text += "あなたの人格は複雑で多面的です。時に内面的な葛藤を感じるかもしれませんが、それがあなたの深みと創造性の源となっています。\n";
  } else {
    text += "あなたの人格は非常に複雑で、内面に強いエネルギーを秘めています。この複雑さを理解し、受け入れることで、大きな可能性が開花します。\n";
  }
  
  return text.trim();
}

/**
 * パーソナライズ推奨事項生成（改善版品質）
 * @param {number} engineId
 * @param {number} interfaceId
 * @param {number} safeId
 * @param {object} actionPlans
 * @param {object} osManual
 * @returns {string}
 */
function getPersonalizedActionPlans(engineId, interfaceId, safeId, actionPlans, osManual) {
  let text = "";
  
  // 既存のアクションプランを利用
  const plans = actionPlans?.[engineId]?.[interfaceId];
  if (plans && plans.length > 0) {
    text += "🎯 **あなたの組み合わせ専用推奨事項**\n";
    text += plans
      .slice(0, 3)
      .map((p, i) => `${i + 1}. ${p}`)
      .join("\n");
    text += "\n\n";
  }
  
  // 各OSのクエストを統合
  const allQuests = [];
  [engineId, interfaceId, safeId].forEach((id) => {
    const manual = osManual?.[id];
    if (manual?.quests && manual.quests.length > 0) {
      allQuests.push(...manual.quests);
    }
  });
  
  if (allQuests.length > 0) {
    text += "🌟 **今月のパーソナル・クエスト**\n";
    text += "以下から興味のあるものを選んで取り組んでみてください：\n\n";
    text += allQuests
      .slice(0, 5)
      .map((quest, i) => `${i + 1}. ${quest}`)
      .join("\n");
    text += "\n\n";
  }
  
  // 汎用的な推奨事項
  text += "💡 **基本的な心構え**\n";
  text += "• 自分の3つのOSの特性を理解し、それぞれの強みを活かす\n";
  text += "• 内面と外面のバランスを意識し、無理をしすぎない\n";
  text += "• 五行の相性を理解し、エネルギーの流れを意識する\n";
  text += "• 困った時は、自分の『セーフモードOS』を活用する\n";
  
  return text.trim();
}

/**
 * 一貫性スコア計算
 * @param {object} engineHex
 * @param {object} interfaceHex
 * @param {object} safeHex
 * @param {Array} trigramsMaster
 * @param {Array} elementRelationships
 * @returns {number} 0-100のスコア
 */
function calculateConsistencyScore(engineHex, interfaceHex, safeHex, trigramsMaster, elementRelationships) {
  const getElement = (hex) => {
    if (!hex) return "";
    const trig = trigramsMaster.find(
      (t) => t.trigram_id === hex.upper_trigram_id
    );
    return trig ? trig.element : "";
  };
  
  const engineElem = getElement(engineHex);
  const interfaceElem = getElement(interfaceHex);
  const safeElem = getElement(safeHex);
  
  const relEI = getElementRelationship(engineElem, interfaceElem, elementRelationships);
  const relES = getElementRelationship(engineElem, safeElem, elementRelationships);
  const relIS = getElementRelationship(interfaceElem, safeElem, elementRelationships);
  
  let score = 50; // ベース値
  
  if (relEI === "相生") score += 20;
  else if (relEI === "相剋") score -= 5;
  
  if (relES === "相生") score += 15;
  else if (relES === "相剋") score -= 5;
  
  if (relIS === "相生") score += 15;
  else if (relIS === "相剋") score -= 5;
  
  return Math.max(0, Math.min(100, score));
}

// グローバルに公開
window.getOSDetailText = getOSDetailText;
window.getElementRelationship = getElementRelationship;
window.getPersonalizedInsight = getPersonalizedInsight;
window.getPersonalizedActionPlans = getPersonalizedActionPlans;
window.calculateConsistencyScore = calculateConsistencyScore;
