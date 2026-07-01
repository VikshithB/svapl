import { defineField, defineType } from "sanity";

export const insight = defineType({
  name: "insight",
  title: "Homepage Insight",
  type: "document",
  fields: [
    defineField({ name: "date", title: "Date Label (e.g. JUN 2026)", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "desc", title: "Description", type: "string" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
