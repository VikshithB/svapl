import { defineField, defineType } from "sanity";

export const product3D = defineType({
  name: "product3D",
  title: "3D Product (Interactive Schematics)",
  type: "document",
  fields: [
    defineField({ name: "id", title: "Model ID (shroud | fin | rcs | canister)", type: "string" }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({ name: "label", title: "Tab Label (e.g. 01 // LVM3 CORE BASE SHROUD)", type: "string" }),
    defineField({ name: "title", title: "Full Title", type: "string" }),
    defineField({ name: "desc", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "specs",
      title: "Specs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", title: "Key", type: "string" },
            { name: "val", title: "Value", type: "string" },
          ],
        },
      ],
    }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
