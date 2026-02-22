import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { feedback } from "./sanity/schemas/feedback";

const projectId = "ju3lehw0";
const dataset = "production";

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
