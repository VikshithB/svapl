import { defineField, defineType } from "sanity";

export const programme = defineType({
  name: "programme",
  title: "Programme",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Name", type: "string" }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
      options: { list: ["ISRO", "DRDO", "HAL"] },
    }),
    defineField({ name: "tag", title: "Programme Tag (e.g. PSLV, Agni I–V)", type: "string" }),
    defineField({ name: "size", title: "Size / Dimensions", type: "string" }),
    defineField({ name: "material", title: "Material", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Image URL", type: "url" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
