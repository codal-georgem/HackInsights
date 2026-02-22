import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { feedback } from "./sanity/schemas/feedback";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "hackinsights",
  title: "HackInsights",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: [feedback],
  },
});
