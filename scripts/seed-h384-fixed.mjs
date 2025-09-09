import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const dataFilePath = path.resolve(__dirname, '../data/h384.json');
const dbName = 'haqei-analyzer-db';
const tableName = 'hexagram_details';
const batchSize = 50;

function safeReplace(str) {
    if (typeof str !== 'string') {
        return '';
    }
    return str.replace(/'/g, "''");
}

async function seed() {
    try {
        console.log(`Cleaning ${tableName} table...`);
        await new Promise((resolve, reject) => {
            exec(`wrangler d1 execute ${dbName} --local --command="DELETE FROM ${tableName};"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error cleaning ${tableName}:`, stderr);
                    reject(error);
                } else {
                    console.log(`${tableName} cleaned successfully.`);
                    resolve();
                }
            });
        });

        console.log(`Reading data from ${dataFilePath}...`);
        const fileContent = await fs.readFile(dataFilePath, 'utf8');
        const data = JSON.parse(fileContent).hexagrams;

        let totalStatements = 0;

        console.log(`Found ${data.length} entries. Seeding to ${tableName}...`);

        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            let statements = [];

            for (const item of batch) {
                const hexagramId = item.id;
                if (isNaN(hexagramId)) {
                    console.log(`Skipping invalid ID: ${hexagramId}`);
                    continue;
                }

                for (const [detailType, detailText] of Object.entries(item)) {
                    if (detailType !== 'id' && detailText != null) {
                        let text = typeof detailText === 'object' ? JSON.stringify(detailText) : detailText;
                        const values = `(${hexagramId}, '${safeReplace(detailType)}', '${safeReplace(text)}')`;
                        statements.push(values);
                    }
                }
            }

            if (statements.length > 0) {
                const values = statements.join(', ');
                const query = `INSERT INTO ${tableName} (hexagram_id, detail_type, detail_text) VALUES ${values};`;

                totalStatements += statements.length;

                await new Promise((resolve) => {
                    exec(`wrangler d1 execute ${dbName} --command="${query}"`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`);
                            console.error(`Error: ${error.message}`);
                            console.error(`Stderr: ${stderr}`);
                            resolve(); // Continue with the next batch
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

        console.log(`\nSeeding for ${tableName} complete.`);
        console.log(`Total statements executed: ${totalStatements}`);

    } catch (error) {
        console.error('An unexpected error occurred during the seeding process:');
        console.error(error);
    }
}

seed();