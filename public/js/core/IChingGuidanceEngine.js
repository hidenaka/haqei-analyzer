/**
 * IChingGuidanceEngine - 易経変化哲学に基づく段階的選択プロセス
 * 3段階の変化を通じて、主体的な行動選択の指針を提供
 */

console.log('☯️ IChingGuidanceEngine Loading...');

(function(global) {
  'use strict';

  class IChingGuidanceEngine {
    constructor() {
      this.name = 'IChingGuidanceEngine';
      this.version = '2.0.0';
      this.h384db = null;
      this.currentHexagram = null;
      this.currentYao = null;
      this.choiceHistory = [];
      this.isInitialized = false;

      // 意味ベース強化: 同義語辞書とカテゴリ語彙（最小版）
      this.semanticLexicon = {
        cooperation: ['協力','連携','合意','信頼','仲間','チーム','公','共同','共創','協調','配慮','調整','合意形成','横断','社内横断'],
        foundation: ['基盤','整備','土台','持続','維持','仕組み','整える','安定','段取り','手順','運用','体制','インフラ','標準化','定着','ルール','ワークフロー','オンボーディング','ドキュメント'],
        reform: ['改革','刷新','改編','再編','再設計','転換','変革','抜本','見直し','リファクタ','再構築','構造改革','方針転換','モデルチェンジ','刷新する'],
        retreat: ['退避','撤退','距離','身を引く','安全第一','離れる','様子見','クールダウン','回避'],
        acceptance: ['受容','受け入れ','順応','慎重','静観','従う','任せる','育む','寄り添う','受け止める','包む','謙虚','柔軟'],
        decision: ['決断','断行','決める','はっきり','思い切る','断固','決裁','意思決定','腹をくくる','選び取る','一手','踏み切る','判断'],
        resonance: ['感応','共鳴','通じ合う','響き合う','シナジー','共感','交感','呼応'],
        danger: ['危険','リスク','不安','焦る','間に合わない','切迫','緊急','逼迫','停滞','詰まる','行き詰まり','閉塞'],
        resource: ['人手不足','工数不足','リソース不足','時間不足','予算不足','手が回らない','足りない'],
        morale: ['やる気がない','疲れ','消耗','士気低下','不満','摩擦','対立','温度差','通じない']
      };
      this.categoryOrder = ['cooperation','foundation','reform','retreat','acceptance','decision','resonance','danger','resource','morale'];
      this._h384Index = null;
      this.stopwords = new Set(['です','ます','する','した','して','ある','いる','なる','こと','もの','よう','ため','的','的な','それ','これ','あれ','その','この','あの','そして','また','ので','から','へ','に','で','を','が','は','と','や','も','にて']);
      this.phrasePatterns = {
        cooperation: ['公の場','合意形成','部門横断','社内横断','関係調整','関係構築'],
        foundation: ['体制整備','標準化','基盤整備','運用定着','土台作り'],
        reform: ['構造改革','方針転換','再構築','抜本改革'],
        retreat: ['いったん離れる','距離を取る','安全第一'],
        acceptance: ['受け止める','寄り添う','謙虚に受容'],
        resource: ['人手不足','工数不足','時間不足','予算不足'],
        morale: ['やる気がない','士気低下','温度差','対立がある']
      };

      // チューニング定数（容易に調整可能）
      this.tuning = {
        wKw: 36,   // 語義一致
        wSum: 7,    // 要約一致
        wCat: 18,   // カテゴリ一致
        wPhrase: 10,// 句一致ブースト
        wS1: 0.05,  // S1補助
        wS5: 6,     // 受動/能動補助
        wS6: 2,     // 変動×緊急
        wS3: 2,     // 安定×複雑
        wS4: 0.02,  // リスク
        wS7: 0.05   // 総合
      };

      // ブリッジング設定（カテゴリ → 推奨カテゴリと重み）
      this.bridging = [
        { has:'resource',   favors:['cooperation','foundation'], w:8 },
        { has:'morale',     favors:['cooperation','acceptance'], w:8 },
        { has:'danger',     favors:['reform','retreat'], w:6 },
        { has:'speed',      favors:['decision','foundation'], w:6 },
        { has:'quality',     favors:['foundation','acceptance'], w:6 },
        { has:'compliance',  favors:['foundation','retreat'], w:6 },
        { has:'cost',        favors:['foundation','reform'], w:5 },
        { has:'schedule',    favors:['decision','foundation'], w:6 },
        { has:'communication', favors:['cooperation','acceptance'], w:6 },
        { has:'learning',     favors:['foundation','acceptance'], w:5 },
        { has:'innovation',   favors:['reform','decision'], w:6 },
        { has:'conflict',     favors:['cooperation','acceptance'], w:7 },
        { has:'delegation',   favors:['acceptance','cooperation'], w:5 },
        { has:'ownership',    favors:['decision','reform'], w:5 },
        { has:'priority',     favors:['decision','retreat'], w:5 },
        { has:'measurement',  favors:['foundation','decision'], w:4 },
        { has:'scalability',  favors:['foundation','reform'], w:5 },
        { has:'reliability',  favors:['foundation','retreat'], w:5 },
        { has:'maintenance',  favors:['foundation','acceptance'], w:5 },
        { has:'techdebt',     favors:['reform','foundation'], w:6 },
        { has:'sales',        favors:['decision','cooperation'], w:6 },
        { has:'marketing',    favors:['decision','reform'], w:6 },
        { has:'cs',           favors:['acceptance','cooperation'], w:6 },
        { has:'legal',        favors:['compliance','foundation'], w:6 },
        { has:'hr',           favors:['cooperation','learning'], w:6 },
        { has:'product',      favors:['decision','reform'], w:6 },
        { has:'engineering',  favors:['foundation','quality'], w:6 },
        { has:'operations',   favors:['foundation','maintenance'], w:6 },
        { has:'finance',      favors:['foundation','reform'], w:6 },
        { has:'procurement',  favors:['foundation','decision'], w:6 },
        { has:'supplychain',  favors:['foundation','decision'], w:6 },
        { has:'healthcare',   favors:['compliance','quality'], w:6 },
        { has:'education',    favors:['learning','foundation'], w:6 },
        { has:'public',       favors:['compliance','cooperation'], w:6 },
        { has:'manufacturing',favors:['quality','foundation'], w:6 },
        { has:'itcloud',      favors:['scalability','reliability'], w:6 }
      ];
    }

    /**
     * 初期化
     */
    async initialize() {
      console.log('🔄 IChingGuidanceEngine initializing...');
      
      try {
        // H384データベース接続
        await this.connectDatabase();
        
        // 変化パターン初期化
        this.initializeChangePatterns();
        
        // 行動指針システム初期化
        this.initializeGuidanceSystem();
        // 外部レキシコンの読み込み（任意）
        await this.loadExternalLexicon('/data/semantic-lexicon.json');

        // H384索引の前計算（レキシコン読み込み後に実施）
        this.buildH384Index();
        
        this.isInitialized = true;
        console.log('✅ IChingGuidanceEngine initialized successfully');
        return true;
      } catch (error) {
        console.error('❌ IChingGuidanceEngine initialization failed:', error);
        return false;
      }
    }

    buildH384Index() {
      try {
        const data = window.H384_DATA || (this.h384db && this.h384db.getDatabaseData && this.h384db.getDatabaseData()) || [];
        this._h384Index = data.map((e, i) => {
          const kw = Array.isArray(e['キーワード']) ? e['キーワード'] : typeof e['キーワード']==='string' ? e['キーワード'].split(/[、,\s]+/) : [];
          const kwNorm = this.normalizeTokens(kw);
          const summary = String(e['現代解釈の要約'] || '');
          const sumTokens = this.normalizeTokens(summary.split(/[\s\p{P}\p{S}、。・…！？!?,，．。]+/u));
          const categories = this.detectCategories(new Set([...kwNorm, ...sumTokens]));
          return { idx: i, entry: e, kwSet: new Set(kwNorm), sumSet: new Set(sumTokens), categories };
        });
        console.log('✅ H384 index built:', this._h384Index.length);
      } catch (e) {
        console.warn('H384 index build failed:', e.message);
        this._h384Index = null;
      }
    }

    async loadExternalLexicon(url) {
      try {
        if (!url) return;
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) return;
        const json = await res.json();
        // synonyms
        if (json && json.synonyms) {
          Object.keys(json.synonyms).forEach(cat => {
            const arr = Array.isArray(json.synonyms[cat]) ? json.synonyms[cat] : [];
            if (!this.semanticLexicon[cat]) this.semanticLexicon[cat] = [];
            const merged = new Set([...
              this.semanticLexicon[cat].map(s=>String(s).toLowerCase().trim()),
              ...arr.map(s=>String(s).toLowerCase().trim())
            ]);
            this.semanticLexicon[cat] = Array.from(merged);
            if (!this.categoryOrder.includes(cat)) this.categoryOrder.push(cat);
          });
        }
        // phrases
        if (json && json.phrases) {
          Object.keys(json.phrases).forEach(cat => {
            const arr = Array.isArray(json.phrases[cat]) ? json.phrases[cat] : [];
            if (!this.phrasePatterns[cat]) this.phrasePatterns[cat] = [];
            const merged = new Set([...
              this.phrasePatterns[cat].map(s=>String(s).toLowerCase().trim()),
              ...arr.map(s=>String(s).toLowerCase().trim())
            ]);
            this.phrasePatterns[cat] = Array.from(merged);
            if (!this.categoryOrder.includes(cat)) this.categoryOrder.push(cat);
          });
        }
        // aliases
        if (json && json.aliases) {
          const map = new Map();
          Object.keys(json.aliases).forEach(k => {
            map.set(String(k).toLowerCase().trim(), String(json.aliases[k]).toLowerCase().trim());
          });
          // 既存aliasにマージ（存在しなければ新規）
          this.aliasMap = map;
        }
        // frames
        if (json && json.frames) {
          this.frames = json.frames; // { frameName: [patterns] }
        }
        console.log('✅ External semantic lexicon loaded:', url);
      } catch (e) {
        console.warn('External lexicon load failed:', e.message);
      }
    }

    // 公開API: 入力テキストの語義とカテゴリ（デバッグ/UX用）
    getSemantics(inputText) {
      try {
        const analysis = this.analyzeText(String(inputText||''));
        const frames = this.detectFrames(analysis, String(inputText||''));
        return {
          keywords: analysis.keywords || [],
          categories: Array.from(analysis.categories || new Set()),
          frames: Array.from(frames)
        };
      } catch (e) { return { keywords: [], categories: [] }; }
    }

    detectFrames(analysis, rawText) {
      const fset = new Set();
      try {
        const txt = String(rawText||'').toLowerCase();
        const frames = this.frames || {};
        Object.keys(frames).forEach(name => {
          const patterns = frames[name] || [];
          if (patterns.some(p => txt.includes(String(p).toLowerCase()))) fset.add(name);
        });
      } catch {}
      return fset;
    }

    /**
     * データベース接続
     */
    async connectDatabase() {
      // H384DatabaseConnectorの利用
      if (window.h384db && window.h384db.isLoaded) {
        this.h384db = window.h384db;
        console.log('✅ Connected to H384 Database');
      } else {
        // フォールバック
        console.warn('⚠️ H384db not ready, using getDatabaseData()');
        const data = window.getDatabaseData ? window.getDatabaseData() : [];
        if (data.length > 0) {
          this.h384db = { getDatabaseData: () => data };
        }
      }
    }

    /**
     * 変化パターン初期化
     */
    initializeChangePatterns() {
      // 易経の基本的な変化パターン
      this.changePatterns = {
        // 陽から陰への変化
        yangToYin: {
          name: '陽転陰',
          description: '積極的な状態から受容的な状態への変化',
          guidance: '力を抜いて、自然の流れに身を任せる時期'
        },
        // 陰から陽への変化
        yinToYang: {
          name: '陰転陽',
          description: '受動的な状態から能動的な状態への変化',
          guidance: '行動を起こし、主体的に動き出す時期'
        },
        // 老陽（極まった陽）
        oldYang: {
          name: '老陽',
          description: '陽が極まり、変化の時を迎える',
          guidance: '成功の頂点にあるが、謙虚さを忘れずに'
        },
        // 老陰（極まった陰）
        oldYin: {
          name: '老陰',
          description: '陰が極まり、転換点を迎える',
          guidance: '最も暗い時期を過ぎ、光が見え始める'
        }
      };
    }

    /**
     * 行動指針システム初期化
     */
    initializeGuidanceSystem() {
      // 3段階の選択における指針パターン
      this.guidancePatterns = {
        stage1: {
          conservative: {
            name: '保守的選択',
            keywords: ['安定', '継続', '忍耐'],
            description: '現状を維持し、内なる力を蓄える',
            iChingPrinciple: '潜龍勿用 - 力を秘めて時を待つ'
          },
          progressive: {
            name: '進歩的選択',
            keywords: ['変革', '挑戦', '革新'],
            description: '新しい可能性に向かって一歩踏み出す',
            iChingPrinciple: '見龍在田 - 才能を世に現す時'
          }
        },
        stage2: {
          collaborative: {
            name: '協調的選択',
            keywords: ['協力', '調和', '共生'],
            description: '他者との協力関係を重視する',
            iChingPrinciple: '群龍無首 - 皆が協力して進む'
          },
          independent: {
            name: '独立的選択',
            keywords: ['自立', '独創', '個性'],
            description: '自分の道を独自に切り開く',
            iChingPrinciple: '飛龍在天 - 独自の道を行く'
          }
        },
        stage3: {
          cautious: {
            name: '慎重な選択',
            keywords: ['熟慮', '計画', '準備'],
            description: '十分な準備と計画を重視',
            iChingPrinciple: '君子終日乾乾 - 慎重に努力を続ける'
          },
          decisive: {
            name: '決断的選択',
            keywords: ['即断', '直感', '勇気'],
            description: '直感を信じて迅速に行動',
            iChingPrinciple: '或躍在淵 - 機を見て躍動する'
          }
        }
      };
    }

    /**
     * 状況卦の算出
     */
    calculateSituationHexagram(inputText) {
      if (!this.h384db) {
        console.error('❌ Database not connected');
        return null;
      }

      const data = this.h384db.getDatabaseData();
      if (!data || data.length === 0) {
        console.error('❌ No database data available');
        return null;
      }

      // テキスト分析によるスコア計算
      const analysis = this.analyzeText(inputText);
      
      // 最適な卦・爻の選択（意味×補助スコア）
      let bestMatch = null;
      let highestScore = -Infinity;
      let altMatch = null;
      const index = this._h384Index || data.map(e => ({ entry: e, kwSet: null, sumSet: null, categories: null }));
      for (const idxEntry of index) {
        const { score } = this.scoreEntry(analysis, idxEntry);
        if (score > highestScore) {
          altMatch = bestMatch;
          highestScore = score;
          bestMatch = idxEntry.entry;
        }
      }

      if (bestMatch) {
        // フィールドの存在と値を確認
        const hexagramNumber = bestMatch['卦番号'] || 1;
        const hexagramName = bestMatch['卦名'] || '乾為天';
        const yaoName = bestMatch['爻'] || '初九';
        
        this.currentHexagram = hexagramNumber;
        this.currentYao = yaoName;
        console.log(`📍 状況卦: ${hexagramName} ${yaoName}`);
        
        // 爻位置は爻名から決定（用九/用六にも対応）
        const posMap = { '初九':1,'九二':2,'九三':3,'九四':4,'九五':5,'上九':6,'初六':1,'六二':2,'六三':3,'六四':4,'六五':5,'上六':6,'用九':7,'用六':7 };
        let yaoPosition = posMap[yaoName];
        if (!yaoPosition) {
          // 不明な場合は安全側
          yaoPosition = 1;
        }
        
        // H384データベースのデータをそのまま返す（加工せず、フィールドを追加）
        const result = {
          hexagramNumber: hexagramNumber,
          hexagramName: hexagramName,
          yaoPosition: yaoPosition,
          yaoName: yaoName,
          serialNumber: bestMatch['通し番号'] || null,
          theme: bestMatch['テーマ'] || '初期状態',
          description: bestMatch['説明'] || '初期の状態です。',
          keywords: bestMatch['キーワード'] || ['開始'],
          modernInterpretation: bestMatch['現代解釈の要約'] || '新しい始まり。',
          // 元のH384データベースのフィールドもそのまま含める
          '卦名': hexagramName,
          '爻': yaoName,
          'キーワード': bestMatch['キーワード'] || ['開始'],
          '現代解釈の要約': bestMatch['現代解釈の要約'] || '新しい始まり。',
          'S1_基本スコア': bestMatch['S1_基本スコア'] || 50,
          'S2_ポテンシャル': bestMatch['S2_ポテンシャル'] || 50,
          'S3_安定性スコア': bestMatch['S3_安定性スコア'] || 50,
          'S4_リスク': bestMatch['S4_リスク'] || -35,
          'S5_主体性推奨スタンス': bestMatch['S5_主体性推奨スタンス'] || '中立',
          'S6_変動性スコア': bestMatch['S6_変動性スコア'] || 50,
          'S7_総合評価スコア': bestMatch['S7_総合評価スコア'] || 50,
          rawData: bestMatch
        };
        if (altMatch) {
          result.alternative = {
            hexagramNumber: altMatch['卦番号'],
            hexagramName: altMatch['卦名'],
            yaoName: altMatch['爻']
          };
        }
        return result;
      }

      // データが見つからない場合はnullを返す（エラーを隠さない）
      console.error('❌ No matching hexagram found for input');
      return null;
    }

    /**
     * テキスト分析
     */
    analyzeText(text) {
      const analysis = {
        length: text.length,
        emotionScore: 0,
        urgencyScore: 0,
        complexityScore: 0,
        keywords: []
      };

      // 1) 入力キーワード抽出（形態素解析があれば使用）
      try {
        if (global.OfflineKuromojiInitializer && global.OfflineKuromojiInitializer.initialized) {
          // 同期APIがなければ簡易トークナイズにフォールバック
          const tokens = (global.OfflineKuromojiInitializer.lastTokens
            || []).map(t => t.basic_form || t.surface_form).filter(Boolean);
          if (tokens.length) analysis.keywords = this.normalizeTokens(tokens);
        }
        if (analysis.keywords.length === 0) {
          // 簡易分割（記号・空白・英数で分割）
          const rough = String(text).split(/[\s\p{P}\p{S}、。・…！？!?,，．。]+/u).filter(Boolean);
          analysis.keywords = this.normalizeTokens(rough);
        }
        // 同義語展開＋カテゴリ検出
        analysis.keywords = this.expandTokens(analysis.keywords);
        analysis.categories = this.detectCategories(new Set(analysis.keywords));
        analysis.rawText = String(text||'');

        // 補助規則: リソース不足/士気低下が強い場合の誘導語追加（問題→打ち手に繋がる語）
        const cats = analysis.categories;
        if (cats && cats.has('resource')) {
          // 人手不足→協力/基盤の語を追加して意味一致を促進
          analysis.keywords.push('協力','連携','基盤','整備');
        }
        if (cats && cats.has('morale')) {
          // 士気・対立→関係改善/受容の語を追加
          analysis.keywords.push('協力','受容','配慮');
        }
        // 追加後に再検出
        analysis.keywords = this.normalizeTokens(analysis.keywords);
        analysis.categories = this.detectCategories(new Set(analysis.keywords));

        // 追加強化: レキシコン語彙と代表句を生文から直接抽出（日本語分かち無し対策）
        try {
          const rawLower = String(text||'').toLowerCase();
          const directHits = new Set();
          // synonyms terms
          Object.keys(this.semanticLexicon||{}).forEach(cat => {
            (this.semanticLexicon[cat]||[]).forEach(term => {
              const t = String(term||'').toLowerCase().trim();
              if (t && rawLower.includes(t)) directHits.add(t);
            });
          });
          // phrase patterns
          Object.keys(this.phrasePatterns||{}).forEach(cat => {
            (this.phrasePatterns[cat]||[]).forEach(term => {
              const t = String(term||'').toLowerCase().trim();
              if (t && rawLower.includes(t)) directHits.add(t);
            });
          });
          // alias keys
          const aliasMap = this.aliasMap || new Map();
          aliasMap.forEach((v, k) => { if (rawLower.includes(String(k))) directHits.add(String(v)); });
          if (directHits.size) {
            analysis.keywords = this.normalizeTokens([...analysis.keywords, ...Array.from(directHits)]);
            analysis.categories = this.detectCategories(new Set(analysis.keywords));
          }
        } catch {}
      } catch {}

      // 2) 感情スコア（維持）
      const positiveWords = ['希望', '成功', '良い', '楽しい', '嬉しい', '前向き'];
      const negativeWords = ['不安', '心配', '困難', '問題', '失敗', '悩み', '焦る'];
      positiveWords.forEach(word => { if (text.includes(word)) analysis.emotionScore += 10; });
      negativeWords.forEach(word => { if (text.includes(word)) analysis.emotionScore -= 10; });

      // 3) 緊急度スコア（維持）
      const urgentWords = ['急ぐ', '至急', '緊急', 'すぐ', '今すぐ', '締切', '間に合わない'];
      urgentWords.forEach(word => { if (text.includes(word)) analysis.urgencyScore += 15; });

      // 4) 複雑度（維持）
      analysis.complexityScore = Math.min(100, text.length / 5);

      return analysis;
    }

    normalizeTokens(arr) {
      try {
        const normed = arr.map(s => String(s).toLowerCase().trim())
          .filter(s => s.length > 0 && s !== ' ' && !this.stopwords.has(s));
        return Array.from(new Set(normed))
          .slice(0, 200);
      } catch { return []; }
    }

    expandTokens(tokens) {
      try {
        const out = new Set(tokens);
        const map = this.semanticLexicon;
        // カタカナ・英略語の単純マッピング
        const alias = this.aliasMap || new Map([
          ['シナジー','共鳴'],['アライン','合意形成'],['リソース','リソース不足'],['モラル','士気低下'],['スタック','詰まる'],
          ['アジャイル','刷新'],['リファクタ','リファクタ'],['ドキュメンテーション','ドキュメント']
        ]);
        tokens.forEach(t => { const v = alias.get(t); if (v) out.add(v); });
        Object.keys(map).forEach(cat => {
          const set = new Set(map[cat]);
          for (const t of tokens) {
            if (set.has(t)) { map[cat].forEach(w => out.add(w)); break; }
          }
        });
        return Array.from(out).slice(0, 300);
      } catch { return tokens; }
    }

    detectCategories(tokenSet) {
      const cats = new Set();
      try {
        for (const cat of this.categoryOrder) {
          const list = this.semanticLexicon[cat]||[];
          for (const w of list) { if (tokenSet.has(w)) { cats.add(cat); break; } }
        }
      } catch {}
      return cats;
    }

    scoreEntry(analysis, idxEntry) {
      const inputKw = new Set(analysis.keywords || []);
      const inputCats = analysis.categories || new Set();
      // 句パターンの検出
      let phraseCats = new Set();
      try {
        const raw = String((analysis.rawText || '')).toLowerCase();
        for (const cat of Object.keys(this.phrasePatterns)) {
          const arr = this.phrasePatterns[cat] || [];
          if (arr.some(p => raw.includes(p))) phraseCats.add(cat);
        }
      } catch {}
      const e = idxEntry.entry;
      const kwSet = idxEntry.kwSet || new Set(this.normalizeTokens(Array.isArray(e['キーワード'])?e['キーワード']:String(e['キーワード']||'').split(/[、,\s]+/)));
      const sumSet = idxEntry.sumSet || new Set(this.normalizeTokens(String(e['現代解釈の要約']||'').split(/[\s\p{P}\p{S}、。・…！？!?,，．。]+/u)));
      const eCats = idxEntry.categories || this.detectCategories(new Set([...kwSet, ...sumSet]));

      // 類似度
      let matchKw = []; kwSet.forEach(k => { if (inputKw.has(k)) matchKw.push(k); });
      let matchSum = []; sumSet.forEach(k => { if (inputKw.has(k)) matchSum.push(k); });
      let matchCat = []; eCats.forEach(c => { if (inputCats.has(c)) matchCat.push(c); });

      let score = 0;
      score += matchKw.length * (this.tuning.wKw||36);     // 語義一致（強）
      score += matchSum.length * (this.tuning.wSum||7);     // 要約一致
      score += matchCat.length * (this.tuning.wCat||18);    // カテゴリ一致
      // 句一致によるカテゴリ補強
      let phraseBoost = 0;
      phraseCats.forEach(c => { if (eCats.has(c)) phraseBoost += (this.tuning.wPhrase||10); });
      score += phraseBoost;

      // 補助（弱）
      score += (e['S1_基本スコア'] || 0) * (this.tuning.wS1||0.05);
      if (analysis.emotionScore > 0 && e['S5_主体性推奨スタンス'] === '能動') score += (this.tuning.wS5||6);
      else if (analysis.emotionScore < 0 && e['S5_主体性推奨スタンス'] === '受動') score += (this.tuning.wS5||6);
      if (analysis.urgencyScore > 30 && (e['S6_変動性スコア'] || 0) > 50) score += (this.tuning.wS6||2);
      if (analysis.complexityScore > 50 && (e['S3_安定性スコア'] || 0) > 50) score += (this.tuning.wS3||2);
      score += (e['S4_リスク'] || 0) * (this.tuning.wS4||0.02);
      score += (e['S7_総合評価スコア'] || 0) * (this.tuning.wS7||0.05);

      // ブリッジングルール: 入力カテゴリ/フレームから“打ち手”カテゴリへの誘導
      let catBoost = 0;
      (this.bridging||[]).forEach(rule => {
        if (inputCats.has(rule.has)) {
          rule.favors.forEach(f => { if (eCats.has(f)) catBoost += rule.w; });
        }
      });
      // フレームの誘導
      try {
        const frames = this.detectFrames(analysis, analysis.rawText || '');
        frames.forEach(fr => {
          const mapping = {
            resource_shortage:['cooperation','foundation'],
            collaboration_intent:['cooperation','decision'],
            reform_intent:['reform','decision'],
            retreat_intent:['retreat','foundation'],
            acceptance_intent:['acceptance','foundation'],
            decision_intent:['decision','reform'],
            risk_alert:['reform','retreat'],
            schedule_pressure:['decision','foundation']
          };
          const favors = mapping[fr] || [];
          favors.forEach(f => { if (eCats.has(f)) catBoost += Math.max(4, (this.tuning.wPhrase||10)-2); });
        });
      } catch {}
      score += catBoost;

      return { score, reasons: { matchKw, matchSum, matchCat, phraseBoost, catBoost } };
    }

    setTuning(params={}) {
      try { Object.assign(this.tuning, params); } catch {}
      return this.tuning;
    }

    getTuning() { return this.tuning; }

    /**
     * 入力文に対する上位候補（卦・爻）をスコア順に返す
     */
    async rankCandidates(inputText, topN = 3) {
      if (!this.isInitialized) await this.initialize();
      const data = window.H384_DATA || (this.h384db && this.h384db.getDatabaseData && this.h384db.getDatabaseData()) || [];
      if (!data || data.length === 0) return [];
      const analysis = this.analyzeText(inputText || '');
      const index = this._h384Index || data.map(e => ({ entry: e, kwSet: null, sumSet: null, categories: null }));
      const scored = [];
      for (const idxEntry of index) {
        const r = this.scoreEntry(analysis, idxEntry);
        scored.push({ score: r.score, reasons: r.reasons, entry: idxEntry.entry });
      }
      scored.sort((a,b)=> b.score - a.score);
      const out = scored.slice(0, Math.max(1, Math.min(topN, scored.length))).map(s => ({
        hexagramNumber: s.entry['卦番号'],
        hexagramName: s.entry['卦名'],
        yaoName: s.entry['爻'],
        score: s.score,
        reasons: s.reasons
      }));
      return out;
    }

    /**
     * マッチングスコア計算
     */
    calculateMatchScore(analysis, entry) {
      let score = 0;

      // A) 意味ベースの類似（最重要）
      const inputKw = new Set(analysis.keywords || []);
      const entryKwRaw = entry['キーワード'];
      const entryKw = Array.isArray(entryKwRaw)
        ? entryKwRaw
        : typeof entryKwRaw === 'string'
          ? entryKwRaw.split(/[、,\s]+/)
          : [];
      const entryKwSet = new Set(this.normalizeTokens(entryKw));
      let overlap = 0;
      entryKwSet.forEach(k => { if (inputKw.has(k)) overlap++; });
      // 重要キーワードの重み（協力/公/仲間/連携→同人へのバイアス等を一般化）
      const coopHints = ['協力','協調','合意','信頼','仲間','連携','公','チーム'];
      const coopHits = coopHints.filter(w => inputKw.has(w)).length;
      score += overlap * 30;      // 語義一致の重み
      score += coopHits * 10;     // 関係性ヒントの追加重み

      // B) 文章要約への部分一致（ゆるい意味一致）
      const summary = String(entry['現代解釈の要約'] || '');
      if (summary) {
        inputKw.forEach(k => { if (k && summary.includes(k)) score += 4; });
      }

      // C) 既存スコア（重みを下げて補助指標に）
      score += (entry['S1_基本スコア'] || 0) * 0.10;
      if (analysis.emotionScore > 0 && entry['S5_主体性推奨スタンス'] === '能動') score += 8;
      else if (analysis.emotionScore < 0 && entry['S5_主体性推奨スタンス'] === '受動') score += 8;
      if (analysis.urgencyScore > 30 && entry['S6_変動性スコア'] > 50) score += 5;
      if (analysis.complexityScore > 50 && entry['S3_安定性スコア'] > 50) score += 4;
      score += (entry['S4_リスク'] || 0) * 0.05;
      score += (entry['S7_総合評価スコア'] || 0) * 0.10;

      return score;
    }

    /**
     * 3段階選択プロセスの生成
     */
    generateThreeStageProcess(situationHexagram) {
      console.log('🎯 generateThreeStageProcess called with hexagram:', situationHexagram);
      
      // guidancePatternsが未初期化の場合、緊急初期化
      if (!this.guidancePatterns) {
        console.log('⚠️ guidancePatterns not initialized, emergency initialization...');
        this.initializeGuidanceSystem();
      }

      const process = {
        currentSituation: situationHexagram,
        progressTheme: situationHexagram ? situationHexagram.卦名 : '現状分析',
        changeTheme: situationHexagram ? `${situationHexagram.卦名}からの変化` : '変化の道',
        stages: []
      };

      // Stage 1: 基本方針の選択
      const stage1 = {
        stageNumber: 1,
        title: '第一段階：基本方針の選択',
        description: '現在の状況に対する基本的な態度を決める',
        choices: [],
        iChingGuidance: this.getStageGuidance(situationHexagram, 1)
      };

      // 保守的選択
      const conservativeData = this.guidancePatterns?.stage1?.conservative || {
        name: '保守的選択',
        keywords: ['安定', '継続', '忍耐'],
        description: '現状を維持し、内なる力を蓄える',
        iChingPrinciple: '潜龍勿用 - 力を秘めて時を待つ'
      };
      
      stage1.choices.push({
        id: 'conservative',
        ...conservativeData,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'conservative'),
        outcome: this.predictOutcome(situationHexagram, 'conservative', 1)
      });

      // 進歩的選択
      const progressiveData = this.guidancePatterns?.stage1?.progressive || {
        name: '進歩的選択',
        keywords: ['前進', '革新', '改革'],
        description: '新しい道を切り開く',
        iChingPrinciple: '見龍在田 - 才能を開花させる時'
      };
      
      stage1.choices.push({
        id: 'progressive',
        ...progressiveData,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'progressive'),
        outcome: this.predictOutcome(situationHexagram, 'progressive', 1)
      });

      process.stages.push(stage1);

      // Stage 2: 実行方法の選択
      const stage2 = {
        stageNumber: 2,
        title: '第二段階：実行方法の選択',
        description: '選んだ方針をどのように実行するか',
        choices: [],
        iChingGuidance: this.getStageGuidance(situationHexagram, 2)
      };

      // 協調的選択
      const collaborativeData = this.guidancePatterns?.stage2?.collaborative || {
        name: '協調的選択',
        keywords: ['協力', '調和', '共生'],
        description: '他者と共に歩む道',
        iChingPrinciple: '群龍無首 - 皆で力を合わせる'
      };
      
      stage2.choices.push({
        id: 'collaborative',
        ...collaborativeData,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'collaborative'),
        outcome: this.predictOutcome(situationHexagram, 'collaborative', 2)
      });

      // 独立的選択
      const independentData = this.guidancePatterns?.stage2?.independent || {
        name: '独立的選択',
        keywords: ['自立', '独創', '主導'],
        description: '自らの力で道を切り開く',
        iChingPrinciple: '飛龍在天 - 高い志を持って行動する'
      };
      
      stage2.choices.push({
        id: 'independent',
        ...independentData,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'independent'),
        outcome: this.predictOutcome(situationHexagram, 'independent', 2)
      });

      process.stages.push(stage2);

      // Stage 3: タイミングの選択
      const stage3 = {
        stageNumber: 3,
        title: '第三段階：タイミングの選択',
        description: '行動のタイミングと速度を決める',
        choices: [],
        iChingGuidance: this.getStageGuidance(situationHexagram, 3)
      };

      // 慎重な選択
      const cautiousData = this.guidancePatterns?.stage3?.cautious || {
        name: '慎重な選択',
        keywords: ['慎重', '準備', '観察'],
        description: '時を見て確実に進む',
        iChingPrinciple: '潜龍勿用 - 時機を待つ知恵'
      };
      
      stage3.choices.push({
        id: 'cautious',
        ...cautiousData,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'cautious'),
        outcome: this.predictOutcome(situationHexagram, 'cautious', 3)
      });

      // 決断的選択
      const decisiveData = this.guidancePatterns?.stage3?.decisive || {
        name: '決断的選択',
        keywords: ['決断', '迅速', '行動'],
        description: '機を逃さず素早く行動',
        iChingPrinciple: '亢龍有悔 - 勇気ある決断'
      };
      
      stage3.choices.push({
        id: 'decisive',
        ...decisiveData,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'decisive'),
        outcome: this.predictOutcome(situationHexagram, 'decisive', 3)
      });

      process.stages.push(stage3);

      console.log('✅ ThreeStageProcess generated successfully:', process);
      return process;
    }

    /**
     * 各段階での易経的指導
     */
    getStageGuidance(hexagram, stageNumber) {
      const guidance = {
        principle: '',
        advice: '',
        warning: ''
      };

      // 卦の性質に基づく指導
      const stance = hexagram['S5_主体性推奨スタンス'];
      const stability = hexagram['S3_安定性スコア'];
      const risk = Math.abs(hexagram['S4_リスク']);

      switch(stageNumber) {
        case 1:
          if (stance === '能動') {
            guidance.principle = '陽の気が強い - 積極的な行動が吉';
            guidance.advice = '今は行動を起こす好機。自信を持って前進せよ。';
          } else {
            guidance.principle = '陰の気が強い - 受容と観察が吉';
            guidance.advice = '今は静観の時。状況をよく見極めてから動くべし。';
          }
          guidance.warning = risk > 50 ? '大きなリスクあり。慎重に。' : 'リスクは管理可能。';
          break;

        case 2:
          if (stability > 60) {
            guidance.principle = '安定の卦 - 着実な進歩を';
            guidance.advice = '基盤は固い。計画的に進めることで成功する。';
          } else {
            guidance.principle = '変動の卦 - 柔軟な対応を';
            guidance.advice = '状況は流動的。臨機応変に対応することが重要。';
          }
          guidance.warning = '固執は避け、状況に応じて調整せよ。';
          break;

        case 3:
          const volatility = hexagram['S6_変動性スコア'];
          if (volatility > 50) {
            guidance.principle = '変化激しき時 - 機を見て動け';
            guidance.advice = 'タイミングが重要。好機を逃さぬよう準備せよ。';
          } else {
            guidance.principle = '安定の時 - 着実に進め';
            guidance.advice = '焦る必要なし。自分のペースで進めばよい。';
          }
          guidance.warning = '時機を誤れば、努力も水泡に帰す。';
          break;
      }

      return guidance;
    }

    /**
     * 選択肢との適合性計算
     */
    calculateChoiceCompatibility(hexagram, choiceId) {
      let compatibility = 50; // 基準値

      const stance = hexagram['S5_主体性推奨スタンス'];
      const stability = hexagram['S3_安定性スコア'];
      const potential = hexagram['S2_ポテンシャル'];

      switch(choiceId) {
        case 'conservative':
          if (stance === '受動') compatibility += 30;
          if (stability > 60) compatibility += 20;
          break;
        
        case 'progressive':
          if (stance === '能動') compatibility += 30;
          if (potential > 60) compatibility += 20;
          break;
        
        case 'collaborative':
          if (hexagram['キーワード'].includes('協力')) compatibility += 25;
          compatibility += stability * 0.3;
          break;
        
        case 'independent':
          if (hexagram['キーワード'].includes('自立')) compatibility += 25;
          compatibility += potential * 0.3;
          break;
        
        case 'cautious':
          if (Math.abs(hexagram['S4_リスク']) > 50) compatibility += 30;
          break;
        
        case 'decisive':
          if (hexagram['S6_変動性スコア'] > 50) compatibility += 30;
          break;
      }

      return Math.min(100, Math.max(0, compatibility));
    }

    /**
     * 選択の結果予測
     */
    predictOutcome(hexagram, choiceId, stage) {
      const baseScore = hexagram['S7_総合評価スコア'];
      const compatibility = this.calculateChoiceCompatibility(hexagram, choiceId);
      
      // 成功確率の計算
      const successProbability = (baseScore * 0.5 + compatibility * 0.5);
      
      // 結果の記述
      let outcome = {
        probability: Math.round(successProbability),
        description: '',
        nextStep: ''
      };

      if (successProbability > 70) {
        outcome.description = '非常に良い選択。高い確率で望む結果が得られる。';
        outcome.nextStep = '自信を持って進め。';
      } else if (successProbability > 50) {
        outcome.description = '適切な選択。努力次第で良い結果が期待できる。';
        outcome.nextStep = '着実に実行することが重要。';
      } else if (successProbability > 30) {
        outcome.description = '挑戦的な選択。困難はあるが不可能ではない。';
        outcome.nextStep = '十分な準備と覚悟が必要。';
      } else {
        outcome.description = '困難な選択。別の道を検討することも視野に。';
        outcome.nextStep = '慎重に再考することを勧める。';
      }

      return outcome;
    }

    /**
     * 8つの未来シナリオ生成（3段階の選択の組み合わせ）
     */
    generate8Scenarios(process) {
      const scenarios = [];
      const combinations = [
        ['conservative', 'collaborative', 'cautious'],
        ['conservative', 'collaborative', 'decisive'],
        ['conservative', 'independent', 'cautious'],
        ['conservative', 'independent', 'decisive'],
        ['progressive', 'collaborative', 'cautious'],
        ['progressive', 'collaborative', 'decisive'],
        ['progressive', 'independent', 'cautious'],
        ['progressive', 'independent', 'decisive']
      ];

      combinations.forEach((combo, index) => {
        const scenario = {
          id: index + 1,
          path: combo,
          title: this.generateScenarioTitle(combo),
          description: this.generateScenarioDescription(combo, process.currentSituation),
          probability: this.calculateScenarioProbability(combo, process),
          characteristics: this.getScenarioCharacteristics(combo),
          iChingReference: this.getScenarioIChingReference(combo, process.currentSituation),
          visualPath: this.createVisualPath(combo)
        };
        scenarios.push(scenario);
      });

      // 確率順にソート
      scenarios.sort((a, b) => b.probability - a.probability);

      return scenarios;
    }

    /**
     * シナリオタイトル生成
     */
    generateScenarioTitle(combo) {
      const patterns = {
        'conservative,collaborative,cautious': '堅実な協調路線',
        'conservative,collaborative,decisive': '協調的現状改革',
        'conservative,independent,cautious': '独立的現状維持',
        'conservative,independent,decisive': '独自の保守革新',
        'progressive,collaborative,cautious': '慎重な共同革新',
        'progressive,collaborative,decisive': '迅速な協調変革',
        'progressive,independent,cautious': '計画的独立革新',
        'progressive,independent,decisive': '独創的即断革新'
      };
      
      return patterns[combo.join(',')] || '未定義の道';
    }

    /**
     * シナリオ説明生成
     */
    generateScenarioDescription(combo, hexagram) {
      let description = '';
      
      // Stage 1の選択による説明
      if (combo[0] === 'conservative') {
        description += '現状を基盤としながら、';
      } else {
        description += '新しい可能性を追求し、';
      }
      
      // Stage 2の選択による説明
      if (combo[1] === 'collaborative') {
        description += '周囲との協力関係を重視して、';
      } else {
        description += '独自の道を切り開きながら、';
      }
      
      // Stage 3の選択による説明
      if (combo[2] === 'cautious') {
        description += '慎重に計画を進める道。';
      } else {
        description += '機を見て素早く行動する道。';
      }
      
      // 卦の特性を加味
      const keywords = hexagram['キーワード'] || [];
      if (keywords.length > 0) {
        description += `特に「${keywords[0]}」の要素が重要となる。`;
      }
      
      return description;
    }

    /**
     * シナリオ確率計算
     */
    calculateScenarioProbability(combo, process) {
      let totalProbability = 0;
      let count = 0;
      
      combo.forEach((choice, stageIndex) => {
        const stage = process.stages[stageIndex];
        const choiceData = stage.choices.find(c => c.id === choice);
        if (choiceData && choiceData.outcome) {
          totalProbability += choiceData.outcome.probability;
          count++;
        }
      });
      
      return count > 0 ? Math.round(totalProbability / count) : 50;
    }

    /**
     * シナリオ特性取得
     */
    getScenarioCharacteristics(combo) {
      const characteristics = [];
      
      combo.forEach(choice => {
        // 各選択の特性を集約
        if (choice === 'conservative') characteristics.push('安定重視');
        if (choice === 'progressive') characteristics.push('革新重視');
        if (choice === 'collaborative') characteristics.push('協調性');
        if (choice === 'independent') characteristics.push('独立性');
        if (choice === 'cautious') characteristics.push('慎重さ');
        if (choice === 'decisive') characteristics.push('決断力');
      });
      
      return characteristics;
    }

    /**
     * シナリオの易経参照
     */
    getScenarioIChingReference(combo, hexagram) {
      // 組み合わせに基づく易経の教え
      const teachings = {
        'conservative,collaborative,cautious': '地山謙 - 謙虚に協力する',
        'conservative,collaborative,decisive': '地天泰 - 安定の中の決断',
        'conservative,independent,cautious': '山天大畜 - 内に力を蓄える',
        'conservative,independent,decisive': '天山遯 - 退いて機を待つ',
        'progressive,collaborative,cautious': '風天小畜 - 小さく蓄えて進む',
        'progressive,collaborative,decisive': '天火同人 - 志を同じくする',
        'progressive,independent,cautious': '火天大有 - 大いに保つ',
        'progressive,independent,decisive': '乾為天 - 天の道を行く'
      };
      
      const key = combo.join(',');
      const reference = teachings[key] || hexagram['卦名'];
      
      return {
        hexagram: reference.split(' - ')[0],
        meaning: reference.split(' - ')[1] || hexagram['現代解釈の要約']
      };
    }

    /**
     * ビジュアルパス作成
     */
    createVisualPath(combo) {
      // 3段階の選択を視覚化するためのパス情報
      return {
        stage1: {
          choice: combo[0],
          position: combo[0] === 'conservative' ? 'left' : 'right',
          color: combo[0] === 'conservative' ? '#3B82F6' : '#10B981'
        },
        stage2: {
          choice: combo[1],
          position: combo[1] === 'collaborative' ? 'left' : 'right',
          color: combo[1] === 'collaborative' ? '#F59E0B' : '#8B5CF6'
        },
        stage3: {
          choice: combo[2],
          position: combo[2] === 'cautious' ? 'left' : 'right',
          color: combo[2] === 'cautious' ? '#EF4444' : '#06B6D4'
        }
      };
    }

    /**
     * 選択履歴の記録
     */
    recordChoice(stage, choice) {
      this.choiceHistory.push({
        stage: stage,
        choice: choice,
        timestamp: new Date().toISOString()
      });
      
      // localStorageに保存
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('iching_choice_history', JSON.stringify(this.choiceHistory));
      }
    }

    /**
     * 選択履歴の取得
     */
    getChoiceHistory() {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('iching_choice_history');
        if (saved) {
          this.choiceHistory = JSON.parse(saved);
        }
      }
      return this.choiceHistory;
    }

    /**
     * 緊急用3段階プロセス生成（フォールバック）
     */
    createEmergencyThreeStageProcess(situationHexagram) {
      console.log('🆘 Creating emergency threeStageProcess...');
      
      const hexagramName = situationHexagram?.卦名 || '現状分析';
      
      const process = {
        currentSituation: situationHexagram,
        progressTheme: `${hexagramName}からの道筋`,
        changeTheme: `${hexagramName}からの変化`,
        stages: [
          {
            stageNumber: 1,
            title: '第一段階：基本方針の選択',
            description: '現在の状況に対する基本的な態度を決める',
            choices: [
              {
                id: 'conservative',
                name: '保守的選択',
                keywords: ['安定', '継続', '忍耐'],
                description: '現状を維持し、内なる力を蓄える',
                iChingPrinciple: '潜龍勿用 - 力を秘めて時を待つ',
                compatibility: 75,
                outcome: {
                  probability: 70,
                  description: '着実な進歩が期待できる',
                  nextStep: '慎重に準備を進める'
                }
              },
              {
                id: 'progressive',
                name: '進歩的選択',
                keywords: ['前進', '革新', '改革'],
                description: '新しい道を切り開く',
                iChingPrinciple: '見龍在田 - 才能を開花させる時',
                compatibility: 65,
                outcome: {
                  probability: 60,
                  description: '新しい可能性が開ける',
                  nextStep: '勇気を持って前進する'
                }
              }
            ],
            iChingGuidance: {
              principle: '時機を見極める',
              advice: '現状をよく観察してから行動せよ',
              warning: '焦りは禁物。準備を怠らず。'
            }
          },
          {
            stageNumber: 2,
            title: '第二段階：実行方法の選択',
            description: '選んだ方針をどのように実行するか',
            choices: [
              {
                id: 'collaborative',
                name: '協調的選択',
                keywords: ['協力', '調和', '共生'],
                description: '他者と共に歩む道',
                iChingPrinciple: '群龍無首 - 皆で力を合わせる',
                compatibility: 70,
                outcome: {
                  probability: 75,
                  description: '協力により大きな成果が得られる',
                  nextStep: 'チームワークを重視する'
                }
              },
              {
                id: 'independent',
                name: '独立的選択',
                keywords: ['自立', '独創', '主導'],
                description: '自らの力で道を切り開く',
                iChingPrinciple: '飛龍在天 - 高い志を持って行動する',
                compatibility: 60,
                outcome: {
                  probability: 65,
                  description: '独自の道が開ける',
                  nextStep: '自信を持って進む'
                }
              }
            ],
            iChingGuidance: {
              principle: '調和と独立のバランス',
              advice: '他者との関係を大切にしながら、自分の道を歩め',
              warning: '孤立は避け、適切な協力関係を築くべし'
            }
          },
          {
            stageNumber: 3,
            title: '第三段階：タイミングの選択',
            description: '行動のタイミングと速度を決める',
            choices: [
              {
                id: 'cautious',
                name: '慎重な選択',
                keywords: ['慎重', '準備', '観察'],
                description: '時を見て確実に進む',
                iChingPrinciple: '潜龍勿用 - 時機を待つ知恵',
                compatibility: 80,
                outcome: {
                  probability: 80,
                  description: '着実で確実な成果を得られる',
                  nextStep: '十分な準備で臨む'
                }
              },
              {
                id: 'decisive',
                name: '決断的選択',
                keywords: ['決断', '迅速', '行動'],
                description: '機を逃さず素早く行動',
                iChingPrinciple: '亢龍有悔 - 勇気ある決断',
                compatibility: 55,
                outcome: {
                  probability: 55,
                  description: '迅速な行動で機会を掴む',
                  nextStep: '決断力を発揮する'
                }
              }
            ],
            iChingGuidance: {
              principle: 'タイミングこそ全て',
              advice: '機を見るに敏であれ。しかし焦りは禁物。',
              warning: '時期を誤れば、良い計画も失敗に終わる'
            }
          }
        ]
      };

      return process;
    }

    /**
     * 完全な分析実行
     */
    async performCompleteAnalysis(inputText) {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // 1. 状況卦の算出
      const situationHexagram = this.calculateSituationHexagram(inputText);
      if (!situationHexagram) {
        console.error('❌ Failed to calculate situation hexagram');
        return null;
      }

      // 2. 3段階選択プロセスの生成
      console.log('🎯 [CRITICAL DEBUG] Generating threeStageProcess...');
      let process = this.generateThreeStageProcess(situationHexagram);
      console.log('🎯 [CRITICAL DEBUG] threeStageProcess generated:', {
        hasProcess: !!process,
        stagesCount: process?.stages?.length,
        processData: process
      });

      // フォールバック: processが生成されない場合は緊急データを作成
      if (!process || !process.stages || process.stages.length === 0) {
        console.warn('⚠️ threeStageProcess generation failed, creating emergency fallback data...');
        process = this.createEmergencyThreeStageProcess(situationHexagram);
        console.log('🆘 Emergency threeStageProcess created:', process);
      }

      // 3. 8つの未来シナリオの生成
      console.log('🎯 [CRITICAL DEBUG] Generating 8 scenarios...');
      const scenarios = this.generate8Scenarios(process);
      console.log('🎯 [CRITICAL DEBUG] Scenarios generated:', {
        hasScenarios: !!scenarios,
        scenariosCount: scenarios?.length
      });

      // 4. 結果の統合
      const result = {
        inputText: inputText,
        currentSituation: situationHexagram,
        threeStageProcess: process,
        eightScenarios: scenarios,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Complete analysis performed:', result);
      return result;
    }
  }

  // グローバル登録
  if (typeof window !== 'undefined') {
    window.IChingGuidanceEngine = IChingGuidanceEngine;
    window.iChingGuidance = new IChingGuidanceEngine();
    
    // 自動初期化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.iChingGuidance.initialize();
      });
    } else {
      window.iChingGuidance.initialize();
    }
  }

  console.log('✅ IChingGuidanceEngine loaded');
  
})(typeof window !== 'undefined' ? window : this);
