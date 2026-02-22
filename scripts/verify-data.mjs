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
    apiVersion: '2024-01-01',
});

async function verify() {
    console.log(`Checking Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
    console.log(`Checking Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);

    try {
        const teams = await client.fetch(`*[_type == "team"]{_id, projectName}`);
        console.log(`Found ${teams.length} teams.`);
        if (teams.length > 0) {
            console.log('Last 5 teams:');
            teams.slice(-5).forEach(t => console.log(`- ${t.projectName} (${t._id})`));
        }

        const feedback = await client.fetch(`*[_type == "feedback"]{_id}`);
        console.log(`Found ${feedback.length} feedback items.`);

    } catch (err) {
        console.error('Error during verification:', err.message);
    }
}

verify();
