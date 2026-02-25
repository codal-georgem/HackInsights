import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity.config";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  interface ReactionBody {
    id: string;
    reaction: "likes" | "hearts" | "parties";
    amount?: number;
  }

  const { id, reaction, amount = 1 } = body as ReactionBody;

  if (!id) {
    return NextResponse.json({ error: "Document ID is required." }, { status: 400 });
  }

  if (!["likes", "hearts", "parties"].includes(reaction)) {
    return NextResponse.json({ error: "Invalid reaction type." }, { status: 400 });
  }

  try {
    // Sanity patch to increment the specific reaction counter
    await writeClient
      .patch(id)
      .setIfMissing({ reactions: { likes: 0, hearts: 0, parties: 0 } })
      .inc({ [`reactions.${reaction}`]: amount })
      .commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/reaction] Sanity patch error:", err);
    return NextResponse.json(
      { error: "Failed to update reaction." },
      { status: 500 }
    );
  }
}
