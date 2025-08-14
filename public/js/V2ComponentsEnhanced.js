/**
 * Results Page v2.1 Phase 2 - 詳細計算最適化版
 * Zone B: Synergy/Tension高度計算実装
 */

/**
 * 最適化されたメトリクス計算クラス
 */
class EnhancedMetricsCalculator {
    constructor() {
        // 五行相生相剋マトリックス
        this.wuxingMatrix = {
            '木': { generates: '火', overcomes: '土', generatedBy: '水', overcomedBy: '金' },
            '火': { generates: '土', overcomes: '金', generatedBy: '木', overcomedBy: '水' },
            '土': { generates: '金', overcomes: '水', generatedBy: '火', overcomedBy: '木' },
            '金': { generates: '水', overcomes: '木', generatedBy: '土', overcomedBy: '火' },
            '水': { generates: '木', overcomes: '火', generatedBy: '金', overcomedBy: '土' }
        };
        
        // 八卦と五行の対応
        this.baguaToWuxing = {
            '乾': '金', // 天
            '兌': '金', // 沢
            '離': '火', // 火
            '震': '木', // 雷
            '巽': '木', // 風
            '坎': '水', // 水
            '艮': '土', // 山
            '坤': '土'  // 地
        };
        
        // パフォーマンス最適化用キャッシュ
        this.cache = new Map();
    }
    
    calculate(tripleOSResults) {
        const startTime = performance.now();
        
        // キャッシュキー生成
        const cacheKey = this.generateCacheKey(tripleOSResults);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        // 8次元ベクトル抽出と正規化
        const vectors = this.extractAndNormalizeVectors(tripleOSResults);
        
        // 詳細Synergy計算
        const synergyDetails = this.calculateDetailedSynergy(vectors, tripleOSResults);
        
        // 詳細Tension計算
        const tensionDetails = this.calculateDetailedTension(vectors, tripleOSResults);
        
        // Confidence計算（改良版）
        const confidence = this.calculateEnhancedConfidence(tripleOSResults, vectors);
        
        // 重心と分散の計算
        const barycenter = this.calculateBarycenter(vectors);
        const variance = this.calculateVariance(vectors, barycenter);
        
        // 動的パターン検出
        const patterns = this.detectDynamicPatterns(vectors, synergyDetails, tensionDetails);
        
        const result = {
            synergy_edges: synergyDetails.edges,
            synergy: synergyDetails.global,
            synergy_details: synergyDetails,
            tension: tensionDetails.global,
            tension_details: tensionDetails,
            confidence: confidence,
            barycenter: barycenter,
            variance: variance,
            patterns: patterns,
            computation_time: performance.now() - startTime
        };
        
        // キャッシュに保存
        this.cache.set(cacheKey, result);
        
        return result;
    }
    
    extractAndNormalizeVectors(results) {
        const dimensions = ['乾', '震', '坎', '兌', '離', '巽', '艮', '坤'];
        
        const extractNormalizedVector = (os) => {
            if (!os || !os.baguaEnergies) {
                return dimensions.map(() => 1/8);
            }
            
            // 値を抽出
            const rawVector = dimensions.map(dim => 
                Math.max(0, (os.baguaEnergies[dim] || 0) / 100)
            );
            
            // L2正規化
            const magnitude = Math.sqrt(rawVector.reduce((sum, v) => sum + v * v, 0));
            if (magnitude === 0) {
                return dimensions.map(() => 1/8);
            }
            
            return rawVector.map(v => v / magnitude);
        };
        
        return {
            engine: extractNormalizedVector(results.engineOS),
            interface: extractNormalizedVector(results.interfaceOS),
            safe: extractNormalizedVector(results.safeModeOS),
            raw: {
                engine: results.engineOS?.baguaEnergies || {},
                interface: results.interfaceOS?.baguaEnergies || {},
                safe: results.safeModeOS?.baguaEnergies || {}
            }
        };
    }
    
    calculateDetailedSynergy(vectors, results) {
        const edges = {};
        const details = {};
        
        const pairs = [
            ['engine', 'interface', 'EI'],
            ['interface', 'safe', 'IS'],
            ['engine', 'safe', 'ES']
        ];
        
        pairs.forEach(([osA, osB, edgeKey]) => {
            // コサイン類似度ベース
            const cosineSimilarity = this.cosineSimilarity(vectors[osA], vectors[osB]);
            
            // 五行相生ボーナス
            const wuxingBonus = this.calculateWuxingSynergy(
                results[osA + 'OS'],
                results[osB + 'OS']
            );
            
            // エネルギー共鳴係数
            const resonance = this.calculateResonance(vectors[osA], vectors[osB]);
            
            // 統合Synergy（0-1範囲）
            const synergy = Math.min(1, Math.max(0, 
                cosineSimilarity * 0.7 + 
                wuxingBonus * 0.2 + 
                resonance * 0.1
            ));
            
            edges[edgeKey] = synergy;
            details[edgeKey] = {
                cosine: cosineSimilarity,
                wuxing: wuxingBonus,
                resonance: resonance,
                final: synergy
            };
        });
        
        // Global Synergy（加重平均）
        const weights = this.calculateEdgeWeights(vectors);
        const globalSynergy = 
            edges.EI * weights.EI + 
            edges.IS * weights.IS + 
            edges.ES * weights.ES;
        
        return {
            edges: edges,
            global: globalSynergy,
            weights: weights,
            details: details
        };
    }
    
    calculateDetailedTension(vectors, results) {
        const tensions = {};
        const details = {};
        
        const pairs = [
            ['engine', 'interface', 'EI'],
            ['interface', 'safe', 'IS'],
            ['engine', 'safe', 'ES']
        ];
        
        pairs.forEach(([osA, osB, edgeKey]) => {
            // 負のコサイン類似度
            const negativeCosine = Math.max(0, -this.cosineSimilarity(vectors[osA], vectors[osB]));
            
            // 五行相剋ペナルティ
            const wuxingConflict = this.calculateWuxingConflict(
                results[osA + 'OS'],
                results[osB + 'OS']
            );
            
            // エネルギー衝突係数
            const collision = this.calculateCollision(vectors[osA], vectors[osB]);
            
            // 方向性の乖離
            const divergence = this.calculateDivergence(vectors[osA], vectors[osB]);
            
            // 統合Tension（0-1範囲）
            const tension = Math.min(1, 
                negativeCosine * 0.4 + 
                wuxingConflict * 0.3 + 
                collision * 0.2 + 
                divergence * 0.1
            );
            
            tensions[edgeKey] = tension;
            details[edgeKey] = {
                negative_cosine: negativeCosine,
                wuxing_conflict: wuxingConflict,
                collision: collision,
                divergence: divergence,
                final: tension
            };
        });
        
        // Global Tension（三角形の歪み度を考慮）
        const elongation = this.calculateTriangleElongation(vectors);
        const avgTension = Object.values(tensions).reduce((a, b) => a + b, 0) / 3;
        const globalTension = Math.min(1, avgTension + elongation * 0.15);
        
        return {
            edges: tensions,
            global: globalTension,
            elongation: elongation,
            details: details
        };
    }
    
    calculateWuxingSynergy(osA, osB) {
        if (!osA || !osB) return 0;
        
        // 主要八卦を特定
        const dominantBaguaA = this.getDominantBagua(osA);
        const dominantBaguaB = this.getDominantBagua(osB);
        
        const wuxingA = this.baguaToWuxing[dominantBaguaA];
        const wuxingB = this.baguaToWuxing[dominantBaguaB];
        
        if (!wuxingA || !wuxingB) return 0;
        
        // 相生関係チェック
        if (this.wuxingMatrix[wuxingA].generates === wuxingB) return 0.8;
        if (this.wuxingMatrix[wuxingB].generates === wuxingA) return 0.8;
        
        // 同じ五行
        if (wuxingA === wuxingB) return 0.5;
        
        return 0;
    }
    
    calculateWuxingConflict(osA, osB) {
        if (!osA || !osB) return 0;
        
        const dominantBaguaA = this.getDominantBagua(osA);
        const dominantBaguaB = this.getDominantBagua(osB);
        
        const wuxingA = this.baguaToWuxing[dominantBaguaA];
        const wuxingB = this.baguaToWuxing[dominantBaguaB];
        
        if (!wuxingA || !wuxingB) return 0;
        
        // 相剋関係チェック
        if (this.wuxingMatrix[wuxingA].overcomes === wuxingB) return 0.7;
        if (this.wuxingMatrix[wuxingB].overcomes === wuxingA) return 0.7;
        
        return 0;
    }
    
    getDominantBagua(os) {
        if (!os || !os.baguaEnergies) return '乾';
        
        const entries = Object.entries(os.baguaEnergies);
        if (entries.length === 0) return '乾';
        
        return entries.reduce((max, [bagua, value]) => 
            value > (os.baguaEnergies[max] || 0) ? bagua : max
        , entries[0][0]);
    }
    
    calculateResonance(vecA, vecB) {
        // 共鳴度：同じ次元で高い値を持つ場合にボーナス
        let resonance = 0;
        for (let i = 0; i < vecA.length; i++) {
            if (vecA[i] > 0.15 && vecB[i] > 0.15) {
                resonance += vecA[i] * vecB[i];
            }
        }
        return Math.min(1, resonance * 2);
    }
    
    calculateCollision(vecA, vecB) {
        // 衝突度：反対方向の強いエネルギー
        let collision = 0;
        for (let i = 0; i < vecA.length; i++) {
            const diff = Math.abs(vecA[i] - vecB[i]);
            if (diff > 0.3) {
                collision += diff * Math.max(vecA[i], vecB[i]);
            }
        }
        return Math.min(1, collision);
    }
    
    calculateDivergence(vecA, vecB) {
        // KLダイバージェンス近似
        let divergence = 0;
        const epsilon = 0.001;
        
        for (let i = 0; i < vecA.length; i++) {
            const p = vecA[i] + epsilon;
            const q = vecB[i] + epsilon;
            divergence += p * Math.log(p / q);
        }
        
        return Math.min(1, Math.abs(divergence) / 2);
    }
    
    calculateEdgeWeights(vectors) {
        // エッジの重要度を動的に計算
        const strengths = {
            engine: this.vectorStrength(vectors.engine),
            interface: this.vectorStrength(vectors.interface),
            safe: this.vectorStrength(vectors.safe)
        };
        
        const total = strengths.engine + strengths.interface + strengths.safe;
        
        return {
            EI: (strengths.engine + strengths.interface) / (2 * total),
            IS: (strengths.interface + strengths.safe) / (2 * total),
            ES: (strengths.engine + strengths.safe) / (2 * total)
        };
    }
    
    vectorStrength(vec) {
        // ベクトルの「強さ」を計算（エントロピーの逆数）
        const entropy = vec.reduce((sum, v) => {
            if (v <= 0) return sum;
            return sum - v * Math.log(v);
        }, 0);
        
        return 1 / (1 + entropy);
    }
    
    calculateTriangleElongation(vectors) {
        // 三角形の細長度（0=正三角形, 1=線形）
        const distances = [
            this.euclideanDistance(vectors.engine, vectors.interface),
            this.euclideanDistance(vectors.interface, vectors.safe),
            this.euclideanDistance(vectors.engine, vectors.safe)
        ];
        
        const perimeter = distances.reduce((a, b) => a + b, 0);
        const s = perimeter / 2;
        
        // ヘロンの公式で面積計算
        const areaSquared = s * (s - distances[0]) * (s - distances[1]) * (s - distances[2]);
        
        if (areaSquared <= 0) return 1; // 退化した三角形
        
        const area = Math.sqrt(areaSquared);
        
        // 正三角形との比率
        const equilateralArea = (Math.sqrt(3) / 4) * Math.pow(perimeter / 3, 2);
        
        return 1 - Math.min(1, area / equilateralArea);
    }
    
    calculateEnhancedConfidence(results, vectors) {
        // 複数の信頼性指標を統合
        
        // 1. 内的一貫性（各OS内での八卦分布の一貫性）
        const consistency = this.calculateInternalConsistency(results);
        
        // 2. 時間的安定性（仮想的な再テスト信頼性）
        const stability = this.estimateTemporalStability(vectors);
        
        // 3. 応答パターンの自然性
        const naturality = this.calculateResponseNaturality(results);
        
        // 4. Herfindahl指数の健全性
        const herfindahl = this.calculateHerfindahl(vectors);
        const herfindahlScore = 1 - Math.abs(herfindahl - 0.33) * 3;
        
        // 統合Confidence
        const confidence = 
            consistency * 0.3 + 
            stability * 0.3 + 
            naturality * 0.2 + 
            herfindahlScore * 0.2;
        
        return Math.max(0, Math.min(1, confidence));
    }
    
    calculateInternalConsistency(results) {
        // Cronbach's alpha的な内的一貫性
        const osTypes = ['engineOS', 'interfaceOS', 'safeModeOS'];
        let totalConsistency = 0;
        
        osTypes.forEach(osType => {
            const os = results[osType];
            if (!os || !os.baguaEnergies) {
                totalConsistency += 0.5;
                return;
            }
            
            const values = Object.values(os.baguaEnergies);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
            
            // 変動係数の逆数（低い分散 = 高い一貫性）
            const cv = variance > 0 ? Math.sqrt(variance) / mean : 0;
            totalConsistency += 1 / (1 + cv);
        });
        
        return totalConsistency / 3;
    }
    
    estimateTemporalStability(vectors) {
        // ベクトル間の安定性を推定
        const distances = [
            this.euclideanDistance(vectors.engine, vectors.interface),
            this.euclideanDistance(vectors.interface, vectors.safe),
            this.euclideanDistance(vectors.engine, vectors.safe)
        ];
        
        const avgDistance = distances.reduce((a, b) => a + b, 0) / 3;
        
        // 適度な距離が安定性を示す（近すぎず遠すぎず）
        const optimalDistance = 0.5;
        return Math.exp(-Math.pow(avgDistance - optimalDistance, 2) / 0.1);
    }
    
    calculateResponseNaturality(results) {
        // 応答パターンの自然性（極端な値の少なさ）
        let naturality = 1;
        const osTypes = ['engineOS', 'interfaceOS', 'safeModeOS'];
        
        osTypes.forEach(osType => {
            const os = results[osType];
            if (!os || !os.baguaEnergies) return;
            
            const values = Object.values(os.baguaEnergies);
            values.forEach(v => {
                if (v < 10 || v > 90) {
                    naturality *= 0.95; // 極端な値にペナルティ
                }
                if (v === 50) {
                    naturality *= 0.98; // 中間値の過多にも軽いペナルティ
                }
            });
        });
        
        return naturality;
    }
    
    calculateBarycenter(vectors) {
        // 重心座標の計算
        const weights = {
            engine: 0.33,
            interface: 0.33,
            safe: 0.34
        };
        
        const barycenter = [];
        for (let i = 0; i < 8; i++) {
            barycenter[i] = 
                vectors.engine[i] * weights.engine +
                vectors.interface[i] * weights.interface +
                vectors.safe[i] * weights.safe;
        }
        
        return barycenter;
    }
    
    calculateVariance(vectors, barycenter) {
        // 重心からの分散
        let variance = 0;
        
        ['engine', 'interface', 'safe'].forEach(os => {
            for (let i = 0; i < 8; i++) {
                variance += Math.pow(vectors[os][i] - barycenter[i], 2);
            }
        });
        
        return variance / 24; // 3 OS * 8 dimensions
    }
    
    detectDynamicPatterns(vectors, synergy, tension) {
        const patterns = [];
        
        // パターン1: 高シナジー・低テンション = 調和型
        if (synergy.global > 0.6 && tension.global < 0.3) {
            patterns.push({
                type: 'harmony',
                label: '調和型',
                description: '3つのOSが協調的に機能',
                strength: (synergy.global - tension.global) / 2
            });
        }
        
        // パターン2: 低シナジー・高テンション = 葛藤型
        if (synergy.global < 0.3 && tension.global > 0.6) {
            patterns.push({
                type: 'conflict',
                label: '葛藤型',
                description: 'OS間に創造的緊張が存在',
                strength: (tension.global - synergy.global) / 2
            });
        }
        
        // パターン3: Engine主導型
        const engineDominance = this.calculateDominance(vectors.engine, vectors);
        if (engineDominance > 0.5) {
            patterns.push({
                type: 'engine-led',
                label: 'Engine主導',
                description: '創造性と探求が支配的',
                strength: engineDominance
            });
        }
        
        // パターン4: バランス型
        const balance = this.calculateBalance(vectors);
        if (balance > 0.7) {
            patterns.push({
                type: 'balanced',
                label: 'バランス型',
                description: '全OSが均等に機能',
                strength: balance
            });
        }
        
        return patterns;
    }
    
    calculateDominance(vector, allVectors) {
        const totalEnergy = Object.values(allVectors)
            .flat()
            .reduce((sum, v) => sum + v, 0);
        
        const vectorEnergy = vector.reduce((sum, v) => sum + v, 0);
        
        return vectorEnergy / totalEnergy;
    }
    
    calculateBalance(vectors) {
        const energies = [
            vectors.engine.reduce((a, b) => a + b, 0),
            vectors.interface.reduce((a, b) => a + b, 0),
            vectors.safe.reduce((a, b) => a + b, 0)
        ];
        
        const mean = energies.reduce((a, b) => a + b, 0) / 3;
        const variance = energies.reduce((sum, e) => sum + Math.pow(e - mean, 2), 0) / 3;
        
        // 低い分散 = 高いバランス
        return Math.exp(-variance * 10);
    }
    
    // ユーティリティメソッド
    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        
        if (normA === 0 || normB === 0) return 0;
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    
    euclideanDistance(vecA, vecB) {
        let sum = 0;
        for (let i = 0; i < vecA.length; i++) {
            sum += Math.pow(vecA[i] - vecB[i], 2);
        }
        return Math.sqrt(sum);
    }
    
    calculateHerfindahl(vectors) {
        const allValues = [
            ...vectors.engine,
            ...vectors.interface,
            ...vectors.safe
        ];
        
        const sum = allValues.reduce((s, v) => s + v, 0);
        if (sum === 0) return 1/24; // 完全均等分布
        
        return allValues.reduce((h, v) => h + Math.pow(v / sum, 2), 0);
    }
    
    generateCacheKey(results) {
        // 簡易キャッシュキー生成
        const values = [];
        ['engineOS', 'interfaceOS', 'safeModeOS'].forEach(os => {
            if (results[os]?.baguaEnergies) {
                values.push(...Object.values(results[os].baguaEnergies));
            }
        });
        return values.join('_');
    }
}

/**
 * Zone B表示コンポーネント（詳細版）
 */
class EnhancedZoneBRenderer {
    constructor() {
        this.calculator = new EnhancedMetricsCalculator();
    }
    
    render(container, tripleOSResults) {
        const metrics = this.calculator.calculate(tripleOSResults);
        
        container.innerHTML = `
            <div class="zone-b-container">
                <h3 class="zone-title">力学ステートメント</h3>
                
                <div class="dynamics-grid">
                    ${this.renderSynergyCard(metrics.synergy_details)}
                    ${this.renderTensionCard(metrics.tension_details)}
                </div>
                
                <div class="pattern-insights">
                    ${this.renderPatterns(metrics.patterns)}
                </div>
                
                <div class="detailed-metrics">
                    ${this.renderDetailedMetrics(metrics)}
                </div>
                
                <div class="computation-info">
                    <small>計算時間: ${metrics.computation_time.toFixed(2)}ms</small>
                </div>
            </div>
        `;
        
        this.attachEventListeners(container, metrics);
    }
    
    renderSynergyCard(synergy) {
        const level = synergy.global > 0.6 ? 'high' : 
                     synergy.global > 0.3 ? 'medium' : 'low';
        
        return `
            <div class="dynamics-card synergy-card ${level}">
                <h4>シナジー: ${(synergy.global * 100).toFixed(1)}%</h4>
                <div class="edge-details">
                    ${this.renderEdgeDetail('E-I', synergy.edges.EI, synergy.details.EI)}
                    ${this.renderEdgeDetail('I-S', synergy.edges.IS, synergy.details.IS)}
                    ${this.renderEdgeDetail('E-S', synergy.edges.ES, synergy.details.ES)}
                </div>
                <p class="insight">
                    ${this.generateSynergyInsight(synergy)}
                </p>
            </div>
        `;
    }
    
    renderTensionCard(tension) {
        const level = tension.global > 0.6 ? 'high' : 
                     tension.global > 0.3 ? 'medium' : 'low';
        
        return `
            <div class="dynamics-card tension-card ${level}">
                <h4>テンション: ${(tension.global * 100).toFixed(1)}%</h4>
                <div class="edge-details">
                    ${this.renderEdgeDetail('E-I', tension.edges.EI, tension.details.EI)}
                    ${this.renderEdgeDetail('I-S', tension.edges.IS, tension.details.IS)}
                    ${this.renderEdgeDetail('E-S', tension.edges.ES, tension.details.ES)}
                </div>
                <p class="insight">
                    ${this.generateTensionInsight(tension)}
                </p>
            </div>
        `;
    }
    
    renderEdgeDetail(label, value, details) {
        const barWidth = value * 100;
        return `
            <div class="edge-detail" data-edge="${label}">
                <span class="edge-label">${label}</span>
                <div class="edge-bar">
                    <div class="edge-fill" style="width: ${barWidth}%"></div>
                </div>
                <span class="edge-value">${(value * 100).toFixed(0)}%</span>
            </div>
        `;
    }
    
    renderPatterns(patterns) {
        if (!patterns || patterns.length === 0) {
            return '<p class="no-patterns">特定のパターンは検出されませんでした</p>';
        }
        
        return patterns.map(pattern => `
            <div class="pattern-badge ${pattern.type}">
                <span class="pattern-label">${pattern.label}</span>
                <span class="pattern-strength">${(pattern.strength * 100).toFixed(0)}%</span>
                <div class="pattern-description">${pattern.description}</div>
            </div>
        `).join('');
    }
    
    renderDetailedMetrics(metrics) {
        return `
            <details class="metrics-details">
                <summary>詳細メトリクス</summary>
                <div class="metrics-grid">
                    <div class="metric-item">
                        <span>Confidence</span>
                        <span>${(metrics.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div class="metric-item">
                        <span>重心分散</span>
                        <span>${metrics.variance.toFixed(3)}</span>
                    </div>
                    <div class="metric-item">
                        <span>三角形歪度</span>
                        <span>${(metrics.tension_details.elongation * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </details>
        `;
    }
    
    generateSynergyInsight(synergy) {
        if (synergy.global > 0.7) {
            return '非常に高い協調性。3つのOSが統合的に機能しています。';
        } else if (synergy.global > 0.4) {
            return '適度な協調性。状況に応じた柔軟な切り替えが可能です。';
        } else {
            return '独立性が高い状態。各OSが個別に機能する傾向があります。';
        }
    }
    
    generateTensionInsight(tension) {
        if (tension.global > 0.7) {
            return '高い内的葛藤。創造的な緊張が成長の機会となります。';
        } else if (tension.global > 0.4) {
            return '健全な緊張状態。バランスを保ちながら発展可能です。';
        } else {
            return '安定した状態。変化への準備が整っています。';
        }
    }
    
    attachEventListeners(container, metrics) {
        // エッジ詳細のホバー表示
        container.querySelectorAll('.edge-detail').forEach(edge => {
            edge.addEventListener('mouseenter', (e) => {
                const edgeKey = e.currentTarget.dataset.edge.replace('-', '');
                this.showEdgeTooltip(e.currentTarget, metrics, edgeKey);
            });
            
            edge.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }
    
    showEdgeTooltip(element, metrics, edgeKey) {
        // ツールチップ表示の実装
        const tooltip = document.createElement('div');
        tooltip.className = 'edge-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>${edgeKey}詳細</strong>
                <div>コサイン類似度: ${(metrics.synergy_details.details[edgeKey]?.cosine * 100).toFixed(1)}%</div>
                <div>五行相生: ${(metrics.synergy_details.details[edgeKey]?.wuxing * 100).toFixed(1)}%</div>
                <div>共鳴度: ${(metrics.synergy_details.details[edgeKey]?.resonance * 100).toFixed(1)}%</div>
            </div>
        `;
        
        element.appendChild(tooltip);
    }
    
    hideTooltip() {
        const tooltips = document.querySelectorAll('.edge-tooltip');
        tooltips.forEach(t => t.remove());
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnhancedMetricsCalculator,
        EnhancedZoneBRenderer
    };
}