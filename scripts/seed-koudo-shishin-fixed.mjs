import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import toml from 'toml';

const wranglerTomlPath = path.resolve(process.cwd(), 'wrangler.toml');
const wranglerConfig = toml.parse(fs.readFileSync(wranglerTomlPath, 'utf-8'));
const dbName = wranglerConfig.d1_databases[0].database_name;

const dataPath = path.resolve(process.cwd(), 'data', 'koudo_shishin.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const BATCH_SIZE = 100;

async function seed() {
    console.log(`Seeding koudo_shishin table in database: ${dbName}`);
    console.log(`Found ${data.length} items in koudo_shishin.json`);

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        const statements = batch
            .filter(item => {
                // データ構造を確認
                if (!item.id) {
                    console.warn(`Skipping item without id:`, item);
                    return false;
                }
                return true;
            })
            .map(item => {
                // 実際のデータ構造に合わせてマッピング
                const shishin_id = item.id;
                const title = item.name || '';
                const description = item.shin || '';
                const category = item.hen || '';
                
                // SQLインジェクション対策
                const safeTitle = title.replace(/'/g, "''");
                const safeDescription = description.replace(/'/g, "''");
                const safeCategory = category.replace(/'/g, "''");
                
                return `INSERT INTO koudo_shishin (shishin_id, title, description, category) VALUES (${shishin_id}, '${safeTitle}', '${safeDescription}', '${safeCategory}');`;
            });

        if (statements.length === 0) {
            console.log(`Batch ${i / BATCH_SIZE + 1} has no valid data, skipping...`);
            continue;
        }

        const sql = statements.join('\n');
        const command = `wrangler d1 execute ${dbName} --local --command="${sql}"`;

        try {
            console.log(`Executing batch ${i / BATCH_SIZE + 1} (${statements.length} records)...`);
            execSync(command, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Error seeding batch ${i / BATCH_SIZE + 1}:`, error);
            // Continue with next batch instead of exiting
            console.log('Continuing with next batch...');
        }
    }

    console.log('Finished seeding koudo_shishin table.');
}

seed();