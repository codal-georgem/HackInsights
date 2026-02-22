import { redirect } from "next/navigation";
import Studio from "./Studio";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  // Disable embedded studio in production to favor the hosted studio
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    redirect("/");
  }

  return <Studio />;
}
