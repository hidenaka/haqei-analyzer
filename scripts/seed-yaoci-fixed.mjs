import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const dataFilePath = path.resolve(__dirname, '../data/yaoci_31-63.json');
const dbName = 'haqei-analyzer-db';
const tableName = 'yaoci_lines';
const batchSize = 50; // 適切なバッチサイズに設定

// 安全にreplaceするための関数
function safeReplace(str) {
    if (typeof str !== 'string') {
        return '';
    }
    return str.replace(/'/g, "''");
}

async function seed() {
    try {
        console.log(`Reading data from ${dataFilePath}...`);
        const fileContent = await fs.readFile(dataFilePath, 'utf8');
        const data = JSON.parse(fileContent);

        // data.hexagrams が存在するか確認
        if (!data.hexagrams) {
            console.error('Error: hexagrams not found in the JSON file.');
            return;
        }
        const hexagramsData = data.hexagrams;
        const hexagramIds = Object.keys(hexagramsData);
        let totalStatements = 0;

        console.log(`Found ${hexagramIds.length} hexagrams. Seeding to ${tableName}...`);

        for (let i = 0; i < hexagramIds.length; i += batchSize) {
            const batchIds = hexagramIds.slice(i, i + batchSize);
            let statements = [];

            for (const hexagramId of batchIds) {
                // メタデータ（数値でないID）をスキップ
                if (isNaN(parseInt(hexagramId, 10))) {
                    console.log(`Skipping non-numeric hexagram ID: ${hexagramId}`);
                    continue;
                }

                const hexagramData = hexagramsData[hexagramId];
                if (!hexagramData || !hexagramData.lines) {
                    console.warn(`Warning: No lines data for hexagram ${hexagramId}`);
                    continue;
                }

                const lines = hexagramData.lines;
                for (const [lineNumberStr, lineData] of Object.entries(lines)) {
                    const lineNumber = parseInt(lineNumberStr, 10);

                    if (!lineData || isNaN(lineNumber)) continue;

                    // text, interpretation, adviceを結合
                    const text = safeReplace(lineData.text);
                    const interpretation = safeReplace(lineData.interpretation);
                    const advice = safeReplace(lineData.advice);
                    const yaociText = `${text}\n【解釈】${interpretation}\n【アドバイス】${advice}`;

                    statements.push(`(${parseInt(hexagramId, 10)}, ${lineNumber}, '${yaociText}')`);
                }
            }

            if (statements.length > 0) {
                const values = statements.join(', ');
                const query = `INSERT INTO ${tableName} (hexagram_id, line_number, yaoci_text) VALUES ${values};`;

                totalStatements += statements.length;

                await new Promise((resolve, reject) => {
                    exec(`wrangler d1 execute ${dbName} --command="${query}"`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`);
                            console.error(`Error: ${error.message}`);
                            console.error(`Stderr: ${stderr}`);
                            // エラーが発生しても処理を続ける
                            resolve();
                            return;
                        }
                        if (stderr) {
                            console.warn(`Batch ${Math.floor(i / batchSize) + 1} stderr:`);
                            console.warn(stderr);
                        }
                        console.log(`Batch ${Math.floor(i / batchSize) + 1} seeded successfully.`);
                        console.log(stdout);
                        resolve();
                    });
                });
            } else {
                console.log(`Batch ${Math.floor(i / batchSize) + 1}: No valid statements, skipping.`);
            }
        }

        console.log(`
Seeding for ${tableName} complete.`);
        console.log(`Total statements executed: ${totalStatements}`);

    } catch (error) {
        console.error('An unexpected error occurred during the seeding process:');
        console.error(error);
    }
}

seed();