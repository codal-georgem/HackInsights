import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity.config";

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  interface FeedbackBody {
    message?: string;
    name?: string;
    rating?: number;
  }

  const typedBody = body as FeedbackBody;
  const message = typedBody.message;
  const name = typedBody.name;
  const rating = typedBody.rating;

  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const trimmedMessage = message.trim();
  const trimmedName = typeof name === "string" ? name.trim().slice(0, 20) : undefined;

  if (trimmedMessage.length > 300) {
    return NextResponse.json(
      { error: "Message must be 300 characters or fewer." },
      { status: 400 }
    );
  }

  const numericRating = typeof rating === "number" ? rating : Number.NaN;
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    return NextResponse.json(
      { error: "Rating must be a number between 1 and 5." },
      { status: 400 }
    );
  }

  try {
    const doc = await writeClient.create({
      _type: "feedback",
      message: trimmedMessage,
      name: trimmedName,
      rating: numericRating,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: doc._id }, { status: 201 });
  } catch (err) {
    console.error("[/api/feedback] Sanity write error:", err);

    if (err instanceof Error && err.message.includes("Session does not match project host")) {
      console.error("Check your SANITY_API_TOKEN in .env.local — it must belong to project:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    }

    return NextResponse.json(
      { error: "Failed to save feedback. Please try again." },
      { status: 500 }
    );
  }
}

