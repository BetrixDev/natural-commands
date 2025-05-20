import { source } from "@/lib/source";
import { generateOGImage } from "fumadocs-ui/og";
import { BotMessageSquareIcon } from "lucide-react";
import { notFound } from "next/navigation";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: "Natural Commands",
    icon: <BotMessageSquareIcon />,
    primaryColor: "#000000",
    primaryTextColor: "#ffffff",
  });
}

export function generateStaticParams() {
  return source.generateParams().map((page) => ({
    ...page,
    slug: [...page.slug, "image.png"],
  }));
}
