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

const teams = [
    {
        "projectName": "The Prod Bois",
        "members": [
            "Arpit Upadhyay",
            "Ravi Chauhan",
            "Akshay Panchal"
        ],
        "winner": false,
        "rank": null
    },
    {
        "projectName": "The Catalysts",
        "members": [
            "Niket Dave",
            "Raj Shah",
            "Ratan Kumawat"
        ],
        "winner": false,
        "rank": 3
    },
    {
        "projectName": "Undefined",
        "members": [
            "Kevin Colaco",
            "Jayesh Bharadva",
            "Bhavya Shah"
        ],
        "winner": false,
        "rank": 2
    },
    {
        "projectName": "Team-404",
        "members": [
            "Umang Mistry",
            "Rushik Rathod",
            "Viraj Patoliya"
        ],
        "winner": false,
        "rank": null
    },
    {
        "projectName": "Team Infinity",
        "members": [
            "Meshw Gajjar",
            "Tiya Mehta",
            "Tirth Shah"
        ],
        "winner": true,
        "rank": 1
    },
    {
        "projectName": "dotENV",
        "members": [
            "Parva Lunawat",
            "Harsh Sonegra",
            "Nikhil Chapadiya"
        ],
        "winner": false,
        "rank": null
    },
    {
        "projectName": "Vibe Coders",
        "members": [
            "Mamta Desai",
            "Shubham Bhavsar",
            "Salonee Bhavsar",
            "Krupali"
        ],
        "winner": false,
        "rank": null
    },
    {
        "projectName": "Prompt-Ops",
        "members": [
            "Ravi Gupta",
            "Vijayprasad Sharma",
            "Himen Patel",
            "Krupalsinh Chavda"
        ],
        "winner": false,
        "rank": null
    },
    {
        "projectName": "The Query Crew",
        "members": [
            "Rahul Raval",
            "Raj Rathore",
            "Dhaval Pithwa",
            "Het Rachh"
        ],
        "winner": false,
        "rank": null
    },
    {
        "projectName": "No Head No Problem",
        "members": [
            "Aman Mecvan",
            "Krutik Mandaviya",
            "Anil Prajapati"
        ],
        "winner": false,
        "rank": null
    },
    {
        "projectName": "Think+Ship",
        "members": [
            "Akash Thakar",
            "Nirav Jethva"
        ],
        "winner": false,
        "rank": null
    },
    {
        "projectName": "Lone Vanguard",
        "members": [],
        "winner": false,
        "rank": null
    },
    {
        "projectName": "Limitless",
        "members": [
            "Jatin Parate",
            "George Macwan"
        ],
        "winner": false,
        "rank": null
    },
    {
        "projectName": "Pied Piper",
        "members": [
            "Het Patel"
        ],
        "winner": false,
        "rank": null
    }
];

async function seedTeams() {
    console.log('Starting seeding teams...');
    try {
        for (const team of teams) {
            console.log(`Creating team: ${team.projectName}`);
            await client.create({
                _type: 'team',
                projectName: team.projectName,
                members: team.members,
                winner: team.winner,
                rank: team.rank,
            });
        }
        console.log('Seeding completed successfully!');
    } catch (err) {
        console.error('Seeding failed:', err.message);
    }
}

seedTeams();
