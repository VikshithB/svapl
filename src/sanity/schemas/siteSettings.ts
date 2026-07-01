import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "companyName", title: "Company Name", type: "string" }),
    defineField({ name: "tagline", title: "Hero Tagline", type: "string" }),
    defineField({ name: "heroSubtext", title: "Hero Subtext", type: "text", rows: 2 }),
    defineField({
      name: "contactEmail",
      title: "Contact / General Email",
      type: "string",
    }),
    defineField({ name: "contractsEmail", title: "Contracts Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        { name: "line1", title: "Line 1", type: "string" },
        { name: "line2", title: "Line 2", type: "string" },
        { name: "city", title: "City", type: "string" },
        { name: "state", title: "State", type: "string" },
        { name: "pin", title: "PIN", type: "string" },
      ],
    }),
    defineField({
      name: "capabilitiesTicker",
      title: "Capabilities Ticker (homepage)",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: { select: { title: "companyName" } },
});
