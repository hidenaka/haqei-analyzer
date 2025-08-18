/**
 * Results Page v2.1 コンポーネント群
 * メトリクス計算、HERO生成、Switch Lenses、ペイロード生成
 */

/**
 * メトリクス計算クラス（v2.1仕様準拠）
 */
class MetricsCalculator {
    calculate(tripleOSResults) {
        // 8次元ベクトルの取得
        const vectors = this.extractVectors(tripleOSResults);
        
        // 正規化ベクトル
        const normalized = this.normalizeVectors(vectors);
        
        // Synergyの計算
        const synergyEdges = {
            EI: this.calculateSynergy(normalized.engine, normalized.interface),
            IS: this.calculateSynergy(normalized.interface, normalized.safe),
            ES: this.calculateSynergy(normalized.engine, normalized.safe)
        };
        
        const globalSynergy = (synergyEdges.EI + synergyEdges.IS + synergyEdges.ES) / 3;
        
        // Tensionの計算
        const tension = this.calculateTension(normalized);
        
        // Confidenceの計算
        const confidence = this.calculateConfidence(tripleOSResults);
        
        // Herfindahl指数
        const herfindahl = this.calculateHerfindahl(vectors);
        
        // Blindspots検出
        const blindspots = this.detectBlindspots(tripleOSResults);
        
        return {
            synergy_edges: synergyEdges,
            synergy: globalSynergy,
            tension: tension,
            confidence: confidence,
            herfindahl: herfindahl,
            blindspots: blindspots
        };
    }
    
    extractVectors(results) {
        // 8次元ベクトル抽出（乾/震/坎/兌/離/巽/艮/坤）
        const dimensions = ['乾', '震', '坎', '兌', '離', '巽', '艮', '坤'];
        
        const extractVector = (os) => {
            if (!os || !os.baguaEnergies) {
                // デフォルト値
                return dimensions.map(() => 0.125);
            }
            return dimensions.map(dim => (os.baguaEnergies[dim] || 0) / 100);
        };
        
        return {
            engine: extractVector(results.engineOS),
            interface: extractVector(results.interfaceOS),
            safe: extractVector(results.safeModeOS)
        };
    }
    
    normalizeVectors(vectors) {
        const normalize = (vec) => {
            const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
            return magnitude > 0 ? vec.map(v => v / magnitude) : vec;
        };
        
        return {
            engine: normalize(vectors.engine),
            interface: normalize(vectors.interface),
            safe: normalize(vectors.safe)
        };
    }
    
    calculateSynergy(vecA, vecB) {
        // syn(a,b) = max(0, u_a · u_b)（コサイン類似度の正部分）
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        return Math.max(0, dotProduct);
    }
    
    calculateTension(normalized) {
        // ten(a,b) = max(0, -u_a · u_b) + 五行相剋ペナルティ
        const tensions = [];
        
        const pairs = [
            ['engine', 'interface'],
            ['interface', 'safe'],
            ['engine', 'safe']
        ];
        
        pairs.forEach(([a, b]) => {
            const dotProduct = normalized[a].reduce((sum, v, i) => sum + v * normalized[b][i], 0);
            const baseTension = Math.max(0, -dotProduct);
            
            // 五行相剋チェック（簡略版）
            const penalty = this.checkWuxingConflict(a, b) ? 0.05 : 0;
            
            tensions.push(Math.min(1, baseTension + penalty));
        });
        
        // Global Tension = 平均 + 三角形の細長度×0.2
        const avgTension = tensions.reduce((sum, t) => sum + t, 0) / tensions.length;
        const elongation = this.calculateElongation(normalized);
        
        return Math.min(1, avgTension + elongation * 0.2);
    }
    
    calculateConfidence(results) {
        // conf = clamp(1 - (0.5*r + 0.3*t + 0.2*d), 0, 1)
        
        // r: 逆転項目不整合率（簡略版）
        const r = 0.2; // TODO: 実際の逆転項目チェック実装
        
        // t: 回答時間Zスコアのばらつき（簡略版）
        const t = 0.3; // TODO: 実際の時間分析実装
        
        // d: Herfindahl H の健全帯逸脱
        const h = this.calculateHerfindahl(this.extractVectors(results));
        const d = Math.abs(h - 0.3); // 0.3を理想値として距離を計算
        
        const confidence = 1 - (0.5 * r + 0.3 * t + 0.2 * d);
        return Math.max(0, Math.min(1, confidence));
    }
    
    calculateHerfindahl(vectors) {
        // Herfindahl-Hirschman Index
        const allValues = [
            ...vectors.engine,
            ...vectors.interface,
            ...vectors.safe
        ];
        
        const sum = allValues.reduce((s, v) => s + v, 0);
        const normalized = allValues.map(v => v / sum);
        
        return normalized.reduce((h, v) => h + v * v, 0);
    }
    
    calculateElongation(normalized) {
        // 三角形の細長度（バリセントリック分散）
        const weights = {
            engine: 0.33,
            interface: 0.33,
            safe: 0.34
        };
        
        // 簡略版：重みの分散を計算
        const values = Object.values(weights);
        const mean = values.reduce((s, v) => s + v, 0) / values.length;
        const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
        
        return Math.sqrt(variance);
    }
    
    checkWuxingConflict(osA, osB) {
        // 五行相剋の簡略チェック
        const conflicts = {
            'engine-interface': false,
            'interface-safe': false,
            'engine-safe': true // 例：火と水の相剋
        };
        
        return conflicts[`${osA}-${osB}`] || conflicts[`${osB}-${osA}`] || false;
    }
    
    detectBlindspots(results) {
        const blindspots = [];
        
        // 簡略版：いくつかの例を返す
        if (!results.engineOS || results.engineOS.strength < 30) {
            blindspots.push('Engine OSの評価が不明確です');
        }
        
        if (Math.abs(results.interfaceOS?.strength - results.safeModeOS?.strength) < 5) {
            blindspots.push('Interface OSとSafe Mode OSの区別が曖昧です');
        }
        
        return blindspots;
    }
}

/**
 * HERO文生成クラス
 */
class HeroGenerator {
    generate(data) {
        const { scores, metrics } = data;
        
        // 主導OS判定
        const dominant = this.findDominant(scores);
        
        // メタファー選択
        const metaphor = this.selectMetaphor(dominant, metrics);
        
        // HERO文生成（18-28字）
        const heroText = this.createHeroText(metaphor, dominant);
        
        // Whyバッジ生成（28-44字）
        const whyText = this.createWhyText(scores, metrics);
        
        // タグ生成（最大4個、各11字以内）
        const tags = this.generateTags(dominant, metrics);
        
        return {
            text: heroText,
            why: whyText,
            tags: tags,
            metaphor: metaphor
        };
    }
    
    findDominant(scores) {
        const entries = Object.entries(scores);
        const max = Math.max(...entries.map(([_, v]) => v));
        const dominant = entries.find(([_, v]) => v === max);
        
        return {
            type: dominant[0],
            score: dominant[1],
            balance: this.checkBalance(scores)
        };
    }
    
    checkBalance(scores) {
        const values = Object.values(scores);
        const max = Math.max(...values);
        const min = Math.min(...values);
        
        if (max - min < 0.05) return 'balanced';
        if (max - min > 0.5) return 'specialized';
        return 'normal';
    }
    
    selectMetaphor(dominant, metrics) {
        const metaphors = {
            engine: {
                high_synergy: '創造の泉を持つ探索者',
                low_synergy: '内なる炎を守る思索者',
                balanced: '深層と表層を繋ぐ架け橋'
            },
            interface: {
                high_synergy: '調和を紡ぐコンダクター',
                low_synergy: '慎重な対話の設計者',
                balanced: '内と外を調整する翻訳者'
            },
            safe: {
                high_synergy: '安定の中に革新を見る',
                low_synergy: '嵐の中の静かな港',
                balanced: 'リスクと安全の均衡点'
            }
        };
        
        const synergyLevel = metrics.synergy > 0.6 ? 'high_synergy' : 
                            metrics.synergy < 0.3 ? 'low_synergy' : 'balanced';
        
        return metaphors[dominant.type]?.[synergyLevel] || '独自の道を歩む探求者';
    }
    
    createHeroText(metaphor, dominant) {
        // 18-28字に収める
        if (metaphor.length > 28) {
            return metaphor.substring(0, 28);
        }
        if (metaphor.length < 18) {
            return metaphor + 'タイプ';
        }
        return metaphor;
    }
    
    createWhyText(scores, metrics) {
        // 28-44字で計算根拠を説明
        const dominantPercent = Math.round(Math.max(...Object.values(scores)) * 100);
        const synergyPercent = Math.round(metrics.synergy * 100);
        
        return `主導${dominantPercent}%・協調度${synergyPercent}%から導出`;
    }
    
    generateTags(dominant, metrics) {
        const tags = [];
        
        // 主導タイプ
        if (dominant.type === 'engine') tags.push('創造型');
        else if (dominant.type === 'interface') tags.push('調和型');
        else if (dominant.type === 'safe') tags.push('安定型');
        
        // バランス
        if (dominant.balance === 'balanced') tags.push('バランス');
        else if (dominant.balance === 'specialized') tags.push('特化型');
        
        // シナジー
        if (metrics.synergy > 0.6) tags.push('高協調');
        else if (metrics.synergy < 0.3) tags.push('独立型');
        
        // テンション
        if (metrics.tension > 0.5) tags.push('葛藤あり');
        
        return tags.slice(0, 4); // 最大4個
    }
}

/**
 * Switch Lenses計算クラス
 */
class SwitchLensCalculator {
    constructor(baseScores = null) {
        
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.baseScores = baseScores;
        
        // 係数行列（v2.1仕様準拠）
        this.matrix = [
            [-0.10, +0.00, +0.10],  // U: 不確実性
            [+0.12, -0.08, -0.04],  // T: 時間圧力
            [-0.05, -0.12, +0.17]   // R: 社会的リスク
        ];
        
        this.sensitivity = 1.2;
    }
    
    calculate(U, T, R, baseScores = null) {
        const scores = baseScores || this.baseScores || {
            engine: 0.5,
            interface: 0.5,
            safe: 0.5
        };
        
        // 条件ベクトル
        const conditions = [U, T, R];
        
        // 変化量計算
        const deltas = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                deltas[j] += conditions[i] * this.matrix[i][j];
            }
        }
        
        // 重み更新
        const logWeights = [
            Math.log(scores.engine + 0.01),
            Math.log(scores.interface + 0.01),
            Math.log(scores.safe + 0.01)
        ];
        
        const adjustedLogWeights = logWeights.map((w, i) => 
            w + this.sensitivity * deltas[i]
        );
        
        // Softmax正規化
        const maxLog = Math.max(...adjustedLogWeights);
        const expWeights = adjustedLogWeights.map(w => 
            Math.exp(w - maxLog)
        );
        const sumExp = expWeights.reduce((a, b) => a + b, 0);
        
        return {
            engine: expWeights[0] / sumExp,
            interface: expWeights[1] / sumExp,
            safe: expWeights[2] / sumExp,
            dominant: this.getDominantMode(expWeights[0], expWeights[1], expWeights[2])
        };
    }
    
    getDominantMode(e, i, s) {
        const max = Math.max(e, i, s);
        if (max === e) return 'Engine-led';
        if (max === i) return 'Interface-led';
        return 'Safe-led';
    }
    
    getPrediction(type, value) {
        const predictions = {
            uncertainty: {
                low: '情報が明確で、効率的に動けます',
                medium: '通常の不確実性では、バランスを保ちます',
                high: '不確実性が高く、慎重なアプローチが必要です'
            },
            timePressure: {
                low: '時間に余裕があり、丁寧な調整が可能です',
                medium: '適度な時間制約は、効率的な行動を促します',
                high: '締切が迫り、素早い決断が求められます'
            },
            socialRisk: {
                low: '親密な関係で、自然な表現ができます',
                medium: '一般的な社会場面では、適度な調整で対応します',
                high: 'リスクの高い対人場面で、慎重さが必要です'
            }
        };
        
        const level = value < 0.33 ? 'low' : value < 0.67 ? 'medium' : 'high';
        return predictions[type]?.[level] || '分析中...';
    }
}

/**
 * ペイロード生成クラス
 */
class PayloadGenerator {
    generate(purpose, data) {
        const timestamp = new Date().toISOString();
        const sessionId = this.generateUUID();
        
        switch(purpose) {
            case 'full':
                return this.generateFullPayload(data, timestamp, sessionId);
            case 'lite':
                return this.generateLitePayload(data, timestamp, sessionId);
            case 'min':
                return this.generateMinPayload(data, timestamp, sessionId);
            default:
                return this.generateLitePayload(data, timestamp, sessionId);
        }
    }
    
    generateFullPayload(data, timestamp, sessionId) {
        const payload = {
            schema_version: '1.1',
            generated_at: timestamp,
            locale: 'ja-JP',
            session_id: sessionId,
            user_id_hash: this.hashUserId(),
            
            triple_os: {
                engine: {
                    hex: data.tripleOS?.engineOS?.hexagramId || 1,
                    name: data.tripleOS?.engineOS?.hexagramName || '乾為天',
                    score: data.scores.engine,
                    vec8: data.tripleOS?.engineOS?.vec8 || [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125]
                },
                interface: {
                    hex: data.tripleOS?.interfaceOS?.hexagramId || 2,
                    name: data.tripleOS?.interfaceOS?.hexagramName || '坤為地',
                    score: data.scores.interface,
                    vec8: data.tripleOS?.interfaceOS?.vec8 || [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125]
                },
                safe: {
                    hex: data.tripleOS?.safeModeOS?.hexagramId || 3,
                    name: data.tripleOS?.safeModeOS?.hexagramName || '水雷屯',
                    score: data.scores.safe,
                    vec8: data.tripleOS?.safeModeOS?.vec8 || [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125]
                }
            },
            
            metrics: data.metrics,
            
            insight_primitives: this.generateInsights(data),
            
            switch_lenses: {
                sliders: {
                    uncertainty: 0.5,
                    time_pressure: 0.5,
                    social_risk: 0.5
                },
                matrix: 'v1-default',
                sensitivity_k: 1.2,
                predicted_mode: 'Balanced'
            },
            
            blindspots: data.metrics.blindspots || [],
            
            hypotheses_for_validation: [
                '小集団ではInterface表現性が上昇する可能性',
                '創造的課題でEngine-Safe葛藤が顕在化',
                '時間無制限時のEngine暴走リスク'
            ],
            
            user_overrides: {
                disagree_points: [],
                context_notes: '',
                additional_context: []
            },
            
            raw_answers: {
                compressed: 'base64_encoded_answer_pattern'
            }
        };
        
        // チェックサム追加
        payload.checksum = this.generateChecksum(payload);
        
        return payload;
    }
    
    generateLitePayload(data, timestamp, sessionId) {
        return {
            version: 'lite-1.1',
            size: '~2KB',
            usage: 'クイック連携・表示用',
            
            triple_os: {
                engine: { hex: 60, score: data.scores.engine },
                interface: { hex: 38, score: data.scores.interface },
                safe: { hex: 45, score: data.scores.safe }
            },
            
            metrics: {
                synergy: data.metrics.synergy,
                tension: data.metrics.tension,
                confidence: data.metrics.confidence
            },
            
            dominant_mode: this.findDominantMode(data.scores),
            session_id: sessionId,
            checksum: this.generateChecksum(data)
        };
    }
    
    generateMinPayload(data, timestamp, sessionId) {
        return {
            version: 'min-1.1',
            size: '~500B',
            usage: '識別・参照用',
            os_scores: [data.scores.engine, data.scores.interface, data.scores.safe],
            confidence: data.metrics.confidence,
            session_id: sessionId
        };
    }
    
    generateInsights(data) {
        const insights = [];
        
        if (data.scores.engine > 0.6) {
            insights.push('創造/探求が強く、対人表明が相対的に弱い');
        }
        
        if (data.scores.safe > 0.5 && data.scores.engine < 0.4) {
            insights.push('安全確保が先行し、未知への初速が落ちやすい');
        }
        
        if (data.scores.interface > 0.6) {
            insights.push('Interface優位時、本音表現が制限される');
        }
        
        return insights.slice(0, 3);
    }
    
    findDominantMode(scores) {
        const max = Math.max(scores.engine, scores.interface, scores.safe);
        if (max === scores.engine) return 'Engine-led';
        if (max === scores.interface) return 'Interface-led';
        return 'Safe-led';
    }
    
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = this.rng.next() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    hashUserId() {
        // 簡略版：実際にはSHA256等を使用
        return 'user_' + this.rng.next().toString(36).substr(2, 9);
    }
    
    generateChecksum(data) {
        // 簡略版：実際にはSHA256等を使用
        return 'checksum_' + JSON.stringify(data).length.toString(16);
    }
}