import { redirect } from "next/navigation";

export default function SignupDisabledPage() {
  redirect("/login?reason=invite-only");
}
