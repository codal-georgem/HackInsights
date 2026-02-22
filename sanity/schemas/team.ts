import { defineField, defineType } from "sanity";

export const team = defineType({
    name: "team",
    title: "Hackathon Teams",
    type: "document",
    fields: [
        defineField({
            name: "projectName",
            title: "Project Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "members",
            title: "Members",
            type: "array",
            of: [{ type: "string" }],
        }),
        defineField({
            name: "winner",
            title: "Is Winner?",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "rank",
            title: "Rank",
            type: "number",
            validation: (Rule) => Rule.min(1),
        }),
    ],
    preview: {
        select: {
            title: "projectName",
            winner: "winner",
            rank: "rank",
        },
        prepare({ title, winner, rank }) {
            return {
                title: title,
                subtitle: `${winner ? "🏆 Winner" : "Participant"}${rank ? ` - Rank ${rank}` : ""}`,
            };
        },
    },
});
