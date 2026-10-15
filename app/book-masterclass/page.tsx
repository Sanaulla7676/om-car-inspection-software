import type { Metadata } from "next";
import { BookingPage } from "@/components/booking-page";

export const metadata: Metadata = {
  title: "Request a Masterclass Slot",
  description: "Request current dates and details for the six-day practical car inspection masterclass. Enrollment, fees and venue are confirmed by the team.",
  alternates: { canonical: "/book-masterclass" },
  robots: { index: false, follow: true }
};

export default function BookMasterclassPage() {
  return <BookingPage type="masterclass" />;
}
