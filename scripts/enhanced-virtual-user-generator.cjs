#!/usr/bin/env node

/**
 * 強化版仮想ユーザー生成システム
 * 実行毎に異なる人格のユーザーを動的生成し、統計的有意性を確保
 */

const fs = require('fs');
const path = require('path');

class EnhancedVirtualUserGenerator {
  constructor() {
    // ベース人格テンプレート
    this.personalityTemplates = {
      philosophical: {
        baseName: "哲学志向型",
        traits: {
          philosophicalInterest: [0.7, 0.9],
          analyticalThinking: [0.6, 0.8],
          patience: [0.7, 0.9],
          abstractThinking: [0.8, 0.95]
        },
        occupations: ["研究者", "コンサルタント", "教師", "カウンセラー", "作家"],
        concerns: ["理論が複雑すぎる", "実用性が不明", "時間がかかりすぎる"],
        expectations: ["深い自己理解", "哲学的洞察", "本質的な気づき"]
      },
      practical: {
        baseName: "実用志向型",
        traits: {
          philosophicalInterest: [0.2, 0.5],
          analyticalThinking: [0.5, 0.7],
          resultOriented: [0.8, 0.95],
          efficiency: [0.7, 0.9]
        },
        occupations: ["営業", "管理職", "経営者", "事務職", "サービス業"],
        concerns: ["時間の無駄", "実際の効果が不明", "複雑すぎる"],
        expectations: ["即効性", "具体的改善", "行動指針"]
      },
      technical: {
        baseName: "技術志向型",
        traits: {
          techSavvy: [0.8, 0.95],
          logicalThinking: [0.8, 0.95],
          analyticalThinking: [0.7, 0.9],
          philosophicalInterest: [0.1, 0.4]
        },
        occupations: ["エンジニア", "データアナリスト", "研究職", "IT職", "システム管理者"],
        concerns: ["科学的根拠の欠如", "アルゴリズムの不透明性", "データの信頼性"],
        expectations: ["論理的分析", "データの可視化", "技術的精度"]
      },
      empathetic: {
        baseName: "共感志向型",
        traits: {
          empathetic: [0.8, 0.95],
          peopleOriented: [0.8, 0.95],
          philosophicalInterest: [0.5, 0.8],
          patience: [0.7, 0.9]
        },
        occupations: ["看護師", "保育士", "HR", "カウンセラー", "教師"],
        concerns: ["結果が冷たい", "人間性の欠如", "配慮不足"],
        expectations: ["温かい洞察", "人間関係改善", "心の理解"]
      },
      creative: {
        baseName: "創造志向型",
        traits: {
          creativity: [0.8, 0.95],
          openness: [0.8, 0.95],
          philosophicalInterest: [0.6, 0.8],
          abstractThinking: [0.7, 0.9]
        },
        occupations: ["デザイナー", "アーティスト", "ライター", "プランナー", "建築家"],
        concerns: ["画一的な結果", "創造性の軽視", "型にはめられる"],
        expectations: ["独創的洞察", "創造的ヒント", "新しい視点"]
      }
    };

    // 日本人の名前パターン
    this.namePatterns = {
      familyNames: ["田中", "佐藤", "鈴木", "高橋", "渡辺", "伊藤", "山本", "中村", "小林", "加藤", 
                   "吉田", "山田", "松本", "井上", "木村", "林", "清水", "山崎", "池田", "橋本"],
      maleNames: ["健一", "翔太", "大輔", "雄太", "浩二", "拓也", "智也", "直樹", "康平", "裕介",
                 "亮", "誠", "学", "薫", "司", "武", "剛", "修", "哲也", "正男"],
      femaleNames: ["美香", "恵子", "由美", "真理", "直美", "裕子", "智子", "美穂", "綾子", "麻衣",
                   "愛", "恵", "薫", "香", "舞", "瞳", "彩", "歩", "楓", "桜"]
    };

    this.ages = {
      young: [22, 35],      // 若年層
      middle: [36, 50],     // 中年層  
      senior: [51, 65]      // シニア層
    };
  }

  /**
   * 指定された数の多様な仮想ユーザーを生成
   */
  generateDiverseUsers(count = 15, options = {}) {
    console.log(`🎭 ${count}人の多様な仮想ユーザーを生成中...`);
    
    const users = [];
    const templateKeys = Object.keys(this.personalityTemplates);
    
    // 各人格タイプから均等に生成
    const usersPerType = Math.ceil(count / templateKeys.length);
    
    templateKeys.forEach(templateKey => {
      const template = this.personalityTemplates[templateKey];
      
      for (let i = 0; i < usersPerType && users.length < count; i++) {
        const user = this.generateSingleUser(template, templateKey, users.length + 1);
        users.push(user);
      }
    });

    // ランダムにシャッフル
    this.shuffleArray(users);
    
    console.log(`✅ ${users.length}人の仮想ユーザー生成完了`);
    console.log(`   人格分布: ${this.getPersonalityDistribution(users)}`);
    
    return users.slice(0, count);
  }

  /**
   * 単一ユーザーの生成
   */
  generateSingleUser(template, templateKey, userId) {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const ageGroup = this.randomChoice(['young', 'middle', 'senior']);
    const age = this.randomInt(this.ages[ageGroup][0], this.ages[ageGroup][1]);
    
    const familyName = this.randomChoice(this.namePatterns.familyNames);
    const givenName = gender === 'male' 
      ? this.randomChoice(this.namePatterns.maleNames)
      : this.randomChoice(this.namePatterns.femaleNames);
    
    const name = `${familyName} ${givenName}`;
    const occupation = this.randomChoice(template.occupations);
    
    // 性格パラメータをランダムに生成（範囲内で）
    const personality = {};
    Object.entries(template.traits).forEach(([trait, range]) => {
      personality[trait] = this.randomFloat(range[0], range[1]);
    });

    // 年齢・性別による微調整
    this.adjustPersonalityByDemo(personality, age, gender);
    
    // 背景ストーリー生成
    const background = this.generateBackground(name, age, occupation, templateKey);
    
    return {
      id: userId,
      name,
      age,
      gender,
      occupation,
      personalityType: templateKey,
      background,
      personality,
      expectations: this.randomChoice(template.expectations),
      concerns: this.randomChoice(template.concerns),
      evaluationStyle: this.generateEvaluationStyle(templateKey, personality),
      sessionVariation: this.generateSessionVariation() // 実行毎の個体差
    };
  }

  /**
   * 年齢・性別による性格調整
   */
  adjustPersonalityByDemo(personality, age, gender) {
    // 年齢による調整
    if (age < 30) {
      personality.techSavvy = (personality.techSavvy || 0.5) * 1.2;
      personality.patience = (personality.patience || 0.5) * 0.9;
    } else if (age > 50) {
      personality.patience = (personality.patience || 0.5) * 1.1;
      personality.techSavvy = (personality.techSavvy || 0.5) * 0.8;
    }

    // 性別による微調整（ステレオタイプを避けつつ、統計的傾向を反映）
    if (gender === 'female') {
      personality.empathetic = (personality.empathetic || 0.5) * 1.05;
    } else {
      personality.logicalThinking = (personality.logicalThinking || 0.5) * 1.05;
    }

    // 値を0-1の範囲に正規化
    Object.keys(personality).forEach(key => {
      personality[key] = Math.min(1.0, Math.max(0.0, personality[key]));
    });
  }

  /**
   * 背景ストーリー生成
   */
  generateBackground(name, age, occupation, personalityType) {
    const templates = {
      philosophical: `${age}歳の${occupation}。深い思考と自己探求を重視し、人生の意味について常に考えている。`,
      practical: `${age}歳の${occupation}。効率と結果を重視し、実用的な解決策を求める現実主義者。`,
      technical: `${age}歳の${occupation}。論理的思考とデータ分析を得意とし、科学的アプローチを好む。`,
      empathetic: `${age}歳の${occupation}。人との関係性を大切にし、他者への共感と理解を重視する。`,
      creative: `${age}歳の${occupation}。創造性と独創性を重視し、新しい視点や表現を探求している。`
    };
    
    return templates[personalityType] || `${age}歳の${occupation}として活動している。`;
  }

  /**
   * 評価スタイル生成
   */
  generateEvaluationStyle(personalityType, personality) {
    const styles = {
      philosophical: "哲学的深さと実用性のバランス",
      practical: "即効性と具体的な改善効果",
      technical: "論理的精度とデータの信頼性",
      empathetic: "心理的配慮と人間関係への効果",
      creative: "独創性と新しい視点の提供"
    };
    
    return styles[personalityType] + "を重視";
  }

  /**
   * セッション毎の個体差パラメータ
   */
  generateSessionVariation() {
    return {
      mood: this.randomFloat(0.3, 1.0),           // その日の気分
      concentration: this.randomFloat(0.4, 1.0),   // 集中度
      timeAvailable: this.randomFloat(0.5, 1.0),   // 利用可能時間
      priorExperience: Math.random() > 0.7,        // 類似ツール経験
      motivation: this.randomFloat(0.6, 1.0)       // やる気レベル
    };
  }

  /**
   * 人格分布の取得
   */
  getPersonalityDistribution(users) {
    const distribution = {};
    users.forEach(user => {
      distribution[user.personalityType] = (distribution[user.personalityType] || 0) + 1;
    });
    
    return Object.entries(distribution)
      .map(([type, count]) => `${type}:${count}人`)
      .join(', ');
  }

  /**
   * ユーティリティ関数
   */
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * ユーザーデータをファイルに保存
   */
  saveUsers(users, sessionId) {
    const outputPath = path.join(__dirname, '..', 'output', 'pdca', sessionId, 'virtual-users.json');
    
    // ディレクトリ作成
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    
    // ユーザーデータ保存
    fs.writeFileSync(outputPath, JSON.stringify({
      sessionId,
      generatedAt: new Date().toISOString(),
      totalUsers: users.length,
      personalityDistribution: this.getPersonalityDistribution(users),
      users
    }, null, 2));

    console.log(`💾 仮想ユーザーデータ保存: ${outputPath}`);
    return outputPath;
  }

  /**
   * 統計的サマリー生成
   */
  generateStatisticalSummary(users) {
    const summary = {
      totalUsers: users.length,
      demographics: {
        ageGroups: {
          young: users.filter(u => u.age < 36).length,
          middle: users.filter(u => u.age >= 36 && u.age <= 50).length,
          senior: users.filter(u => u.age > 50).length
        },
        gender: {
          male: users.filter(u => u.gender === 'male').length,
          female: users.filter(u => u.gender === 'female').length
        }
      },
      personalityTypes: {}
    };

    // 人格タイプ分布
    users.forEach(user => {
      summary.personalityTypes[user.personalityType] = 
        (summary.personalityTypes[user.personalityType] || 0) + 1;
    });

    return summary;
  }
}

// コマンドライン実行
if (require.main === module) {
  const generator = new EnhancedVirtualUserGenerator();
  const count = process.env.npm_config_count || process.argv[2] || 15;
  const sessionId = `test-${Date.now()}`;
  
  console.log(`🎭 強化版仮想ユーザー生成テスト (${count}人)`);
  
  const users = generator.generateDiverseUsers(parseInt(count));
  const summary = generator.generateStatisticalSummary(users);
  
  console.log('\n📊 生成統計:');
  console.log(`総ユーザー数: ${summary.totalUsers}人`);
  console.log(`年齢分布: 若年${summary.demographics.ageGroups.young}人, 中年${summary.demographics.ageGroups.middle}人, シニア${summary.demographics.ageGroups.senior}人`);
  console.log(`性別分布: 男性${summary.demographics.gender.male}人, 女性${summary.demographics.gender.female}人`);
  console.log(`人格分布: ${Object.entries(summary.personalityTypes).map(([type, count]) => `${type}:${count}人`).join(', ')}`);
  
  // サンプル表示
  console.log('\n👤 サンプルユーザー:');
  users.slice(0, 3).forEach(user => {
    console.log(`  ${user.name} (${user.age}歳, ${user.occupation}, ${user.personalityType}型)`);
    console.log(`    期待: ${user.expectations}`);
    console.log(`    懸念: ${user.concerns}`);
  });
}

module.exports = EnhancedVirtualUserGenerator;