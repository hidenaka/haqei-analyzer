import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import toml from 'toml';

const wranglerTomlPath = path.resolve(process.cwd(), 'wrangler.toml');
const wranglerConfig = toml.parse(fs.readFileSync(wranglerTomlPath, 'utf-8'));
const dbName = wranglerConfig.d1_databases[0].database_name;

const dataPath = path.resolve(process.cwd(), 'data', 'yaoci_31-63.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const BATCH_SIZE = 10;

function safeReplace(str) {
    if (str === null || str === undefined) {
        return '';
    }
    return String(str).replace(/'/g, "''");
}

async function seed() {
    console.log(`Seeding yaoci_lines table in database: ${dbName}`);

    let statements = [];
    for (const [hexagramId, lines] of Object.entries(data)) {
        for (const [lineNumber, text] of Object.entries(lines)) {
            const safeText = safeReplace(text);
            const values = `(${hexagramId}, ${lineNumber}, '${safeText}')`;
            statements.push(`INSERT INTO yaoci_lines (hexagram_id, line_number, yaoci_text) VALUES ${values};`);
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

    console.log('Finished seeding yaoci_lines table.');
}

seed();