import { defineField, defineType } from "sanity";

export const plant = defineType({
  name: "plant",
  title: "Plant / Facility (About Page)",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name (e.g. Unit I)", type: "string" }),
    defineField({ name: "area", title: "Covered Area (e.g. 60,000 SQ.FT)", type: "string" }),
    defineField({ name: "plot", title: "Plot Size (e.g. 20,370 SQ.YARDS)", type: "string" }),
    defineField({ name: "highlights", title: "Highlights", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "image", title: "Image URL", type: "url" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
