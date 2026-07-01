import { defineField, defineType } from "sanity";

export const capability = defineType({
  name: "capability",
  title: "Capability (What We Build)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Label (Tab Name)", type: "string" }),
    defineField({ name: "slug", title: "ID / Slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "tag", title: "Client Tags (e.g. ISRO · DRDO)", type: "string" }),
    defineField({ name: "image", title: "Image URL", type: "url" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "specs",
      title: "Spec Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "materials",
      title: "Materials",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "products",
      title: "Key Products Delivered",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
