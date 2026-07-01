import { defineField, defineType } from "sanity";

export const processStep = defineType({
  name: "processStep",
  title: "Process Step (How We Build)",
  type: "document",
  fields: [
    defineField({ name: "step", title: "Step Number (e.g. 01)", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "desc", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "detail", title: "Detail / Callout", type: "text", rows: 2 }),
    defineField({ name: "image", title: "Image URL", type: "url" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
