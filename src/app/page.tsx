import { client } from "@/lib/sanity.config";
import FeedbackPageClient from "@/components/FeedbackPageClient";
import type { FeedbackItem } from "@/components/FeedbackWall";

const QUERY = `*[_type == "feedback"] | order(submittedAt desc) {
  _id,
  message,
  name,
  submittedAt,
  reactions
}`;

export const revalidate = 30;

export default async function Home() {
  const items: FeedbackItem[] = await client.fetch(QUERY);

  return (
    <main className="min-h-screen bg-brand-bg">
      <FeedbackPageClient initialItems={items} />
    </main>
  );
}
