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

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        const statements = batch.filter(item => item.shishin_id !== null && item.shishin_id !== undefined).map(item => {
              const { shishin_id, title, description, category } = item;
             const safeTitle = title ? title.replace(/'/g, "''") : '';
     const safeDescription = description ? description.replace(/'/g, "''") : '';
     const safeCategory = category ? category.replace(/'/g, "''") : '';
     const values = `(${shishin_id}, '${safeTitle}', '${safeDescription}', '${safeCategory}')`;
              return `INSERT INTO koudo_shishin (shishin_id, title, description, category) VALUES ${values};`;
          });

        const sql = statements.join('\n');
        const command = `wrangler d1 execute ${dbName} --local --command="${sql}"`;

        try {
            console.log(`Executing batch ${i / BATCH_SIZE + 1}...`);
            execSync(command, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Error seeding batch ${i / BATCH_SIZE + 1}:`, error);
            // Exit if a batch fails
            return;
        }
    }

    console.log('Finished seeding koudo_shishin table.');
}

seed();