import { defineField, defineType } from "sanity";

export const jobPosition = defineType({
  name: "jobPosition",
  title: "Job Position",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Job Title", type: "string" }),
    defineField({ name: "dept", title: "Department", type: "string" }),
    defineField({ name: "type", title: "Type (e.g. Full-time)", type: "string" }),
    defineField({ name: "exp", title: "Experience Range", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "desc", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "skills", title: "Key Skills", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "active", title: "Active / Visible", type: "boolean" }),
  ],
});
