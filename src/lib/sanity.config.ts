import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-02-21";
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
