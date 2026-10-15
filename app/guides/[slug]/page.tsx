import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/marketing-page";
import { guidePages } from "@/lib/marketing-content";

export function generateStaticParams() {
  return guidePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = guidePages.find((item) => item.slug === slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: "/guides/" + page.slug },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url: "/guides/" + page.slug, type: "article" },
    twitter: { card: "summary_large_image", title: page.metaTitle, description: page.metaDescription }
  };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = guidePages.find((item) => item.slug === slug);
  if (!page) notFound();
  return <MarketingPage content={page} />;
}
