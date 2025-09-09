import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import toml from 'toml';

const wranglerTomlPath = path.resolve(process.cwd(), 'wrangler.toml');
const wranglerConfig = toml.parse(fs.readFileSync(wranglerTomlPath, 'utf-8'));
const dbName = wranglerConfig.d1_databases[0].database_name;

const dataPath = path.resolve(process.cwd(), 'data', 'enhanced_hexagrams_complete.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const BATCH_SIZE = 5;

async function seed() {
    console.log(`Seeding hexagrams and hexagram_lines tables in database: ${dbName}`);

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        let hexagramStatements = [];
        let lineStatements = [];

        for (const item of batch) {
            const { king_wen_number, english_name, chinese_name, pinyin_name, trigrams, character, binary, judgment, image, lines } = item;
            const safeReplace = (str) => (str ? str.replace(/'/g, "''") : '');

            const hexagramValues = `(${king_wen_number}, '${safeReplace(english_name)}', '${safeReplace(chinese_name)}', '${safeReplace(pinyin_name)}', '${safeReplace(trigrams.lower)}', '${safeReplace(trigrams.upper)}', '${safeReplace(character)}', '${binary}', '${safeReplace(judgment)}', '${safeReplace(image)}')`;
            hexagramStatements.push(`INSERT INTO hexagrams (king_wen_number, english_name, chinese_name, pinyin_name, lower_trigram, upper_trigram, character, binary_representation, judgment, image) VALUES ${hexagramValues};`);

            for (const line of lines) {
                const lineValues = `(${king_wen_number}, ${line.line}, '${line.text.replace(/'/g, "''")}', ${line.value})`;
                lineStatements.push(`INSERT INTO hexagram_lines (hexagram_id, line_number, line_text, line_value) VALUES ${lineValues};`);
            }
        }

        const hexagramSql = hexagramStatements.join('\n');
        const lineSql = lineStatements.join('\n');

        const hexagramCommand = `wrangler d1 execute ${dbName} --local --command="${hexagramSql}"`;
        const lineCommand = `wrangler d1 execute ${dbName} --local --command="${lineSql}"`;

        try {
            console.log(`Executing hexagrams batch ${i / BATCH_SIZE + 1}...`);
            execSync(hexagramCommand, { stdio: 'inherit' });
            console.log(`Executing hexagram_lines batch ${i / BATCH_SIZE + 1}...`);
            execSync(lineCommand, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Error seeding batch ${i / BATCH_SIZE + 1}:`, error);
            return;
        }
    }

    console.log('Finished seeding hexagrams and hexagram_lines tables.');
}

seed();