import { defineField, defineType } from "sanity";

export const capabilitySlide = defineType({
  name: "capabilitySlide",
  title: "Capability Slide",
  type: "document",
  fields: [
    defineField({ name: "id", title: "ID (slug)", type: "slug", options: { source: "title" } }),
    defineField({ name: "order", title: "Slide Order", type: "number" }),
    defineField({ name: "code", title: "Code Label (e.g. 01 // CAPABILITY)", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "image", title: "Image URL (S3 or CDN)", type: "url" }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
    defineField({
      name: "specs",
      title: "Specs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", title: "Key", type: "string" },
            { name: "value", title: "Value", type: "string" },
          ],
        },
      ],
    }),
  ],
  orderings: [{ title: "Slide Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
