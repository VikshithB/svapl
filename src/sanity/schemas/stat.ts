import { defineField, defineType } from "sanity";

export const stat = defineType({
  name: "stat",
  title: "Verification Stat",
  type: "document",
  fields: [
    defineField({ name: "value", title: "Value", type: "string" }),
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "code", title: "Code / Sub-label", type: "string" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
