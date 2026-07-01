import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "svapl",
  title: "SVAPL CMS",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "4uk16xhr",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("SVAPL Content")
          .items([
            S.documentTypeListItem("siteSettings").title("Site Settings"),
            S.divider(),
            S.documentTypeListItem("stat").title("Verification Stats"),
            S.documentTypeListItem("capabilitySlide").title("Capability Slides"),
            S.documentTypeListItem("insight").title("Homepage Insights"),
            S.divider(),
            S.documentTypeListItem("newsArticle").title("News Articles"),
            S.documentTypeListItem("product3D").title("3D Products"),
            S.documentTypeListItem("product").title("Products"),
            S.documentTypeListItem("programme").title("Programmes"),
            S.documentTypeListItem("jobPosition").title("Job Positions"),
            S.documentTypeListItem("capability").title("Capabilities"),
            S.documentTypeListItem("infrastructure").title("Infrastructure"),
            S.divider(),
            S.documentTypeListItem("processStep").title("Process Steps (How We Build)"),
            S.documentTypeListItem("machine").title("Machines (How We Build)"),
            S.divider(),
            S.documentTypeListItem("aboutStat").title("About Stats"),
            S.documentTypeListItem("timelineEntry").title("Timeline"),
            S.documentTypeListItem("plant").title("Plants / Facilities"),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
