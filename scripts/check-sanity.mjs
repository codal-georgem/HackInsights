import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
});

async function checkTeams() {
    try {
        const count = await client.fetch(`count(*[_type == "team"])`);
        console.log(`Total teams in Sanity (${process.env.NEXT_PUBLIC_SANITY_DATASET}): ${count}`);
        const samples = await client.fetch(`*[_type == "team"] | order(projectName asc) [0...3].projectName`);
        console.log(`Sample teams: ${samples.join(", ")}`);
    } catch (err) {
        console.error('Check failed:', err.message);
    }
}

checkTeams();
