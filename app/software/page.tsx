import { redirect } from "next/navigation";

export const metadata = {
  title: "OMCAR Inspection Software",
  description: "Open the original OMCAR vehicle inspection workspace.",
  robots: { index: false, follow: false },
};

export default function SoftwarePage(): never {
  redirect("/omcar-inspection.html" as never);
}
