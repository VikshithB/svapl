import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product (Products Page)",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Product Name", type: "string" }),
    defineField({ name: "slug", title: "Slug / ID", type: "slug", options: { source: "name" } }),
    defineField({ name: "num", title: "Display Number (e.g. 01)", type: "string" }),
    defineField({
      name: "programme",
      title: "Programme",
      type: "string",
      options: { list: ["ISRO", "DRDO", "HSFC"] },
    }),
    defineField({ name: "image", title: "Image URL", type: "url" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "specs",
      title: "Specs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "key", title: "Key (e.g. DIAMETER)", type: "string" }),
            defineField({ name: "val", title: "Value (e.g. 4200 MM)", type: "string" }),
          ],
        },
      ],
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
