import type { Metadata } from "next";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotesServer } from "@/lib/api/serverApi";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] === "all" ? "all" : slug?.[0];
  return {
    title: `Filter by category: ${tag}`,
    description: `Notes by filter: ${tag}`,
    openGraph: {
      title: `Filter by category: ${tag}`,
      description: `Notes by filter: ${tag}`,
      url: `https://08-zustand-livid.vercel.app/notes/filter/${slug}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Filter by category: ${tag}`,
        },
      ],
      type: "website",
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0] === "all" ? undefined : slug?.[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotesServer("", 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag ?? ""} />
    </HydrationBoundary>
  );
}
