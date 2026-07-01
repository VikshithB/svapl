import { defineField, defineType } from "sanity";

export const timelineEntry = defineType({
  name: "timelineEntry",
  title: "Timeline Entry (About Page)",
  type: "document",
  fields: [
    defineField({ name: "year", title: "Year (e.g. 2000)", type: "string" }),
    defineField({ name: "text", title: "Milestone Text", type: "text", rows: 2 }),
    defineField({ name: "image", title: "Image URL", type: "url" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
