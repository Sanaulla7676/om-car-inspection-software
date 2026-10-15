import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/marketing-page";
import { servicePages } from "@/lib/marketing-content";

export function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePages.find((item) => item.slug === slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: "/services/" + page.slug },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url: "/services/" + page.slug, type: "website" },
    twitter: { card: "summary_large_image", title: page.metaTitle, description: page.metaDescription }
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = servicePages.find((item) => item.slug === slug);
  if (!page) notFound();
  return <MarketingPage content={page} />;
}
