import { client } from "@/lib/sanity.config";
import FeedbackPageClient from "@/components/FeedbackPageClient";
import type { FeedbackItem } from "@/components/FeedbackWall";

const QUERY = `*[_type == "feedback"] | order(submittedAt desc) {
  _id,
  message,
  name,
  rating,
  submittedAt
}`;

export const revalidate = 30; // ISR: re-fetch from Sanity every 30 seconds

export default async function Home() {
  const items: FeedbackItem[] = await client.fetch(QUERY);

  return (
    <main className="min-h-screen bg-brand-bg">
      <FeedbackPageClient initialItems={items} />
    </main>
  );
}
