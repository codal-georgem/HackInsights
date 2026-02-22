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

async function clearTeams() {
    console.log('Fetching all teams to delete...');
    try {
        const teams = await client.fetch(`*[_type == "team"]._id`);
        console.log(`Found ${teams.length} teams. Deleting...`);

        const transaction = client.transaction();
        teams.forEach(id => transaction.delete(id));

        const result = await transaction.commit();
        console.log('Successfully deleted all teams!');
    } catch (err) {
        console.error('Deletion failed:', err.message);
    }
}

clearTeams();
