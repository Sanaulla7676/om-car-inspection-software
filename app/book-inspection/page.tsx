import type { Metadata } from "next";
import { BookingPage } from "@/components/booking-page";

export const metadata: Metadata = {
  title: "Book a Vehicle Inspection",
  description: "Request a used-car inspection, new-car PDI, used-vehicle PDI or condition review. Confirm scope, availability and fees before booking.",
  alternates: { canonical: "/book-inspection" },
  robots: { index: false, follow: true }
};

export default function BookInspectionPage() {
  return <BookingPage type="inspection" />;
}
