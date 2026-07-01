import { defineField, defineType } from "sanity";

export const newsArticle = defineType({
  name: "newsArticle",
  title: "News Article",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "readTime", title: "Read Time (e.g. 4 MIN READ)", type: "string" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Cover Image URL", type: "url" }),
    defineField({ name: "featured", title: "Featured Article", type: "boolean" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  orderings: [{ title: "Date (newest)", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
});
