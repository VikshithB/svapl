import { defineField, defineType } from "sanity";

export const machine = defineType({
  name: "machine",
  title: "Machine (How We Build)",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Machine Name", type: "string" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["milling", "turning", "metrology"] },
    }),
    defineField({ name: "image", title: "Image URL", type: "url" }),
    defineField({
      name: "specs",
      title: "Specs",
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
      name: "schematics",
      title: "Telemetry Schematics",
      type: "object",
      fields: [
        defineField({ name: "origin", title: "Integration Origin", type: "string" }),
        defineField({ name: "travelRatio", title: "Travel Speed Ratio", type: "string" }),
        defineField({ name: "laserCalib", title: "Calibration Constant", type: "string" }),
        defineField({ name: "axisEngaged", title: "Axis Engaged", type: "string" }),
      ],
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
