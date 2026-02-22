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

async function queryTeams() {
    try {
        console.log('--- Fetching Teams from Sanity ---');
        const teams = await client.fetch(`*[_type == "team"] | order(projectName asc) {
      projectName,
      winner,
      rank,
      members
    }`);

        if (teams.length === 0) {
            console.log('No teams found in Sanity.');
        } else {
            console.table(teams.map(t => ({
                Project: t.projectName,
                Winner: t.winner ? '🏆 Yes' : 'No',
                Rank: t.rank || '-',
                Members: t.members?.join(', ') || 'None'
            })));
        }
    } catch (err) {
        console.error('Query failed:', err.message);
    }
}

queryTeams();
