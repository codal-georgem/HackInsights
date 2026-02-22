import { defineField, defineType } from "sanity";

export const feedback = defineType({
  name: "feedback",
  title: "Hackathon Feedback",
  type: "document",
  fields: [
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(1).max(300),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Optional (Anonymous if empty)",
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      // Set server-side on creation — not shown in Studio form
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "message",
      subtitle: "submittedAt",
    },
    prepare({ title, subtitle }) {
      return {
        title: title ?? "—",
        subtitle: subtitle
          ? new Date(subtitle).toLocaleString()
          : "No date",
      };
    },
  },
});
