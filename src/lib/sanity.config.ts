import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

// Be extremely defensive about the API version string to prevent Vercel build failures
const rawVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim();
const apiVersion = (rawVersion && /^\d{4}-\d{2}-\d{2}$/.test(rawVersion))
  ? rawVersion
  : "2024-01-01";

const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in environment variables."
  );
}

if (!token) {
  console.warn("Missing SANITY_API_TOKEN. Writes will fail.");
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});
