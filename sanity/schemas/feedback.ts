import { defineField, defineType } from "sanity";

export const feedback = defineType({
  name: "feedback",
  title: "Hackathon Feedback",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Participant", value: "participant" },
          { title: "Mentor", value: "mentor" },
          { title: "Organizer", value: "organizer" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(500),
    }),
    defineField({
      name: "rating",
      title: "Star Rating",
      type: "number",
      options: {
        list: [1, 2, 3, 4, 5],
      },
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      // Auto-set on creation via the write client — not shown in Studio form
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      rating: "rating",
    },
    prepare({ title, subtitle, rating }) {
      return {
        title,
        subtitle: `${subtitle} · ${"★".repeat(rating ?? 0)}`,
      };
    },
  },
});
