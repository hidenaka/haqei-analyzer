import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import toml from 'toml';

const wranglerTomlPath = path.resolve(process.cwd(), 'wrangler.toml');
const wranglerConfig = toml.parse(fs.readFileSync(wranglerTomlPath, 'utf-8'));
const dbName = wranglerConfig.d1_databases[0].database_name;

const dataPath = path.resolve(process.cwd(), 'data', 'h384.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const BATCH_SIZE = 10;

async function seed() {
    console.log(`Seeding hexagram_details table in database: ${dbName}`);

    let statements = [];
    for (const [hexagramId, details] of Object.entries(data)) {
        for (const [detailType, detailText] of Object.entries(details)) {
            const safeReplace = (str) => (str ? String(str).replace(/'/g, "''") : '');
            if (detailText != null) {
                const values = `(${hexagramId}, '${safeReplace(detailType)}', '${safeReplace(detailText)}')`;
                statements.push(`INSERT INTO hexagram_details (hexagram_id, detail_type, detail_text) VALUES ${values};`);
            }
        }
    }

    for (let i = 0; i < statements.length; i += BATCH_SIZE) {
        const batch = statements.slice(i, i + BATCH_SIZE);
        const sql = batch.join('\n');
        const command = `wrangler d1 execute ${dbName} --local --command="${sql}"`;

        try {
            console.log(`Executing batch ${i / BATCH_SIZE + 1}...`);
            execSync(command, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Error seeding batch ${i / BATCH_SIZE + 1}:`, error);
            return;
        }
    }

    console.log('Finished seeding hexagram_details table.');
}

seed();