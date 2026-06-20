import { redirect } from "next/navigation";

// Entry point: send visitors to the marketing landing page. Authenticated
// areas redirect to /login themselves when no valid session cookie is present.
export default function Home() {
  redirect("/landing");
}
