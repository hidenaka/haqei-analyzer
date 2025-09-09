import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import toml from 'toml';

const wranglerTomlPath = path.resolve(process.cwd(), 'wrangler.toml');
const wranglerConfig = toml.parse(fs.readFileSync(wranglerTomlPath, 'utf-8'));
const dbName = wranglerConfig.d1_databases[0].database_name;
const dataPath = path.resolve(process.cwd(), 'data', 'enhanced_hexagrams_complete.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const BATCH_SIZE = 10;

function safeReplace(str) {
    if (str === null || str === undefined) {
        return '';
    }
    return str.replace(/'/g, "''");
}

async function seed() {
    console.log(`Cleaning hexagrams table in database: ${dbName}`);
    try {
        execSync(`wrangler d1 execute ${dbName} --local --command="DELETE FROM hexagrams;"`, { stdio: 'inherit' });
        console.log('hexagrams table cleaned successfully.');
    } catch (error) {
        console.error('Error cleaning hexagrams table:', error.message);
        // Continue seeding even if cleaning fails, as the table might be empty
    }

    console.log(`Seeding hexagrams table in database: ${dbName}`);

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        console.log(`Executing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

        const statements = batch.map(item => {
            const king_wen_number = item.hexagram_id;
            const english_name = item.name_classical;
            const chinese_name = item.name_jp;
            const pinyin_name = item.reading;
            const character = item.name_classical;
            const judgment = item.gua_ci ? item.gua_ci.text : '';
            const image = item.da_xiang ? item.da_xiang.text : '';
            const lowerTrigram = item.lower_trigram_id ? String(item.lower_trigram_id) : '';
            const upperTrigram = item.upper_trigram_id ? String(item.upper_trigram_id) : '';

            const binary_representation = item.binary;

            const values = `(
                ${king_wen_number},
                '${safeReplace(english_name)}',
                '${safeReplace(chinese_name)}',
                '${safeReplace(pinyin_name)}',
                '${safeReplace(lowerTrigram)}',
                '${safeReplace(upperTrigram)}',
                '${safeReplace(character)}',
                '${safeReplace(judgment)}',
                '${safeReplace(image)}',
                '${safeReplace(binary_representation)}'
            )`;
            return `INSERT INTO hexagrams (king_wen_number, english_name, chinese_name, pinyin_name, lower_trigram, upper_trigram, character, judgment, image, binary_representation) VALUES ${values};`;
        }).filter(Boolean);

        if (statements.length === 0) {
            console.log("No valid statements in this batch, skipping.");
            continue;
        }

        const sql = statements.join('\n');
        const command = `wrangler d1 execute ${dbName} --local --command="${sql}"`;

        try {
            execSync(command, { stdio: 'inherit' });
            console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} seeded successfully.`);
        } catch (error) {
            console.error(`Error seeding batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message);
            console.error(`Failed SQL:\n${sql}`);
        }
    }

    console.log('Seeding hexagrams table complete.');
}

seed().catch(error => {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
});