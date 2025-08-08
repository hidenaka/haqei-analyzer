# HAQEI I Ching 専門家: 卦7-30の完全爻辞データ作成

## 作業概要
ユーザーの要請により、HAQEI analyzerプロジェクトに易経第7番から第30番までの卦（24卦）について、完全な爻辞データをJSON形式で作成する。

## 対象の卦一覧（24卦）
7. 地水師 (ちすいし) - 組織統率
8. 水地比 (すいちひ) - 協調親密  
9. 風天小畜 (ふうてんしょうちく) - 小蓄積
10. 天沢履 (てんたくり) - 礼節慎重
11. 地天泰 (ちてんたい) - 平和調和
12. 天地否 (てんちひ) - 閉塞停滞
13. 天火同人 (てんかどうじん) - 大同団結
14. 火天大有 (かてんたいゆう) - 豊富繁栄
15. 地山謙 (ちさんけん) - 謙虚有能
16. 雷地豫 (らいちよ) - 準備快楽
17. 沢雷随 (たくらいずい) - 適応追随
18. 山風蠱 (さんぷうこ) - 腐敗改革
19. 地沢臨 (ちたくりん) - 接近成長
20. 風地観 (ふうちかん) - 観察洞察
21. 火雷噬嗑 (からいぜいごう) - 障害排除
22. 山火賁 (さんかひ) - 装飾美化
23. 山地剝 (さんちはく) - 衰退剥離
24. 地雷復 (ちらいふく) - 回復復活
25. 天雷无妄 (てんらいむぼう) - 無垢自然
26. 山天大畜 (さんてんたいちく) - 大蓄積
27. 山雷頤 (さんらいい) - 養育保養
28. 沢風大過 (たくふうたいか) - 異常超過

注意: 29番坎為水、30番離為火は既存データがあるため除外

## データ構造要件
既存のenhanced_hexagrams_orthodoxy.jsonの構造に従い：
- hexagram_id, name_jp, name_classical, reading
- binary (6桁), upper_trigram_id, lower_trigram_id  
- time_concept, virtue, emotion
- gua_ci (卦辞), da_xiang (大象)
- six_lines (6爻) - position, name, text, meaning, personality_trait, transformation_potential
- relationships (関係性データ)
- triple_os_application
- keywords, catchphrase, description

## 易経専門知識の重点
1. 各爻辞の原文正確性
2. 伝統的解釈の忠実性
3. 現代的応用の適切性
4. HaQei philosophyとの整合性
5. 序卦伝論理の維持

## 次のアクション
enhanced_hexagrams_orthodoxy.jsonファイルに7番から28番までの卦データを追加作成する。