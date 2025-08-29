import fs from 'fs';

console.log('🔍 質問改善内容の検証を開始します...');

// questions-full.jsファイルを読み込み
const questionsFilePath = './public/assets/js/questions-full.js';
const questionsContent = fs.readFileSync(questionsFilePath, 'utf-8');

console.log('📝 質問ファイルを読み込み完了');

// NGワードの検出
const ngWords = ['革新的', '斬新な', '賢者', '状況による', '状況を見ながら'];
const foundNgWords = [];

ngWords.forEach(word => {
  if (questionsContent.includes(word)) {
    foundNgWords.push(word);
  }
});

if (foundNgWords.length > 0) {
  console.log(`❌ NGワードが発見されました: ${foundNgWords.join(', ')}`);
} else {
  console.log('✅ NGワードは発見されませんでした');
}

// 改善されたワードの確認
const improvedWords = ['新しい', '対応', '力', 'どのように', 'どんな'];
const foundImprovedWords = [];

improvedWords.forEach(word => {
  if (questionsContent.includes(word)) {
    foundImprovedWords.push(word);
  }
});

console.log(`✅ 改善されたワードが確認されました: ${foundImprovedWords.join(', ')}`);

// 具体的な改善例の確認
const improvementChecks = [
  {
    search: '新しいプロジェクトを始めるとき、どのように取り組みますか？',
    description: 'Q1の改善確認'
  },
  {
    search: '困難な状況に直面したとき、どのように対応しますか？',
    description: 'Q25の改善確認'
  },
  {
    search: 'あなたにとって「本当の強さ」とは何ですか？',
    description: 'Q36の改善確認'
  },
  {
    search: '自分で新しい方法を考える',
    description: '改善された選択肢の確認'
  },
  {
    search: 'リスクを避けて慎重に進む',
    description: '改善された選択肢の確認'
  }
];

console.log('\n📋 具体的な改善内容の確認:');
improvementChecks.forEach(check => {
  if (questionsContent.includes(check.search)) {
    console.log(`✅ ${check.description}: 確認済み`);
  } else {
    console.log(`❌ ${check.description}: 見つかりません`);
  }
});

// 質問数の確認
const questionMatches = questionsContent.match(/id: "q\d+"/g);
if (questionMatches) {
  console.log(`\n📊 質問数: ${questionMatches.length}問`);
  if (questionMatches.length === 36) {
    console.log('✅ 全36問が確認されました');
  } else {
    console.log(`❌ 質問数が正しくありません (期待値: 36問)`);
  }
} else {
  console.log('❌ 質問が見つかりません');
}

// 選択肢の数確認
const optionMatches = questionsContent.match(/{ value: "[A-E]"/g);
if (optionMatches) {
  console.log(`📊 選択肢数: ${optionMatches.length}個`);
  if (optionMatches.length === 180) { // 36問 × 5選択肢
    console.log('✅ 全180個の選択肢が確認されました');
  } else {
    console.log(`❌ 選択肢数が正しくありません (期待値: 180個)`);
  }
}

// ENGINE OS質問の確認 (Q1-Q12)
const engineQuestions = questionsContent.match(/ENGINE OS測定質問[\s\S]*?Q13/);
if (engineQuestions) {
  console.log('✅ ENGINE OS質問セクション (Q1-Q12) が確認されました');
} else {
  console.log('❌ ENGINE OS質問セクションが見つかりません');
}

// INTERFACE OS質問の確認 (Q13-Q24)
const interfaceQuestions = questionsContent.match(/INTERFACE OS測定質問[\s\S]*?Q25/);
if (interfaceQuestions) {
  console.log('✅ INTERFACE OS質問セクション (Q13-Q24) が確認されました');
} else {
  console.log('❌ INTERFACE OS質問セクションが見つかりません');
}

// SAFE MODE OS質問の確認 (Q25-Q36)
const safeModeQuestions = questionsContent.match(/SAFE MODE OS測定質問[\s\S]*?]/);
if (safeModeQuestions) {
  console.log('✅ SAFE MODE OS質問セクション (Q25-Q36) が確認されました');
} else {
  console.log('❌ SAFE MODE OS質問セクションが見つかりません');
}

console.log('\n🎯 検証結果サマリー:');
console.log(`- NGワード除去: ${foundNgWords.length === 0 ? '✅ 完了' : '❌ 未完了'}`);
console.log(`- 改善ワード追加: ${foundImprovedWords.length > 0 ? '✅ 完了' : '❌ 未完了'}`);
console.log(`- 質問数: ${questionMatches ? questionMatches.length : 0}/36`);
console.log(`- 選択肢数: ${optionMatches ? optionMatches.length : 0}/180`);

if (foundNgWords.length === 0 && foundImprovedWords.length > 0 && 
    questionMatches && questionMatches.length === 36 &&
    optionMatches && optionMatches.length === 180) {
  console.log('\n🎉 全ての質問改善が正常に完了しています！');
} else {
  console.log('\n⚠️ 一部の改善が完了していない可能性があります');
}

console.log('\n✅ 検証完了');