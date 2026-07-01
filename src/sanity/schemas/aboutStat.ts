import { defineField, defineType } from "sanity";

export const aboutStat = defineType({
  name: "aboutStat",
  title: "About Stat (About Page)",
  type: "document",
  fields: [
    defineField({ name: "value", title: "Value (e.g. 25+)", type: "string" }),
    defineField({ name: "label", title: "Label (e.g. Years in Service)", type: "string" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
