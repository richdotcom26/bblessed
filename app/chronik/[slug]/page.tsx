import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { gigs, gigBySlug, formatGigDate } from "@/lib/content";
import { Gallery } from "@/components/Gallery";
import { YouTube } from "@/components/YouTube";

export function generateStaticParams() {
  return gigs.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gig = gigBySlug(slug);
  if (!gig) return { title: "Chronik" };

  const text = gig.bodyHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const description =
    (text ? `${text} · ` : "") +
    `BBLESSED – worship band aus Witten-Herbede. Aus der Chronik: ${gig.title} (${gig.year}).`;
  const image = gig.poster?.src ?? gig.images[0]?.src;

  return {
    title: `${gig.title} (${gig.year})`,
    description: description.slice(0, 300),
    alternates: { canonical: `/chronik/${gig.slug}` },
    openGraph: {
      type: "article",
      title: `${gig.title} – BBLESSED`,
      description: description.slice(0, 300),
      url: `https://www.bblessed.de/chronik/${gig.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function GigPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gig = gigBySlug(slug);
  if (!gig) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/chronik"
        className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-accent)]"
      >
        ← Zurück zur Chronik
      </Link>

      <p className="mt-6 text-sm text-[var(--color-fg-muted)]">{formatGigDate(gig.date)}</p>
      <h1 className="mt-1 font-display-upper text-3xl text-[var(--color-fg)] sm:text-5xl">
        {gig.title}
      </h1>

      {gig.posterOnly && gig.poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={gig.poster.src}
          alt={gig.poster.alt || gig.title}
          width={gig.poster.w}
          height={gig.poster.h}
          className="mt-8 h-auto w-full max-w-md rounded-lg ring-1 ring-[var(--color-border)]"
        />
      )}

      {gig.bodyHtml && (
        <div className="prose-bb mt-8" dangerouslySetInnerHTML={{ __html: gig.bodyHtml }} />
      )}

      {gig.youtube && (
        <div className="mt-8">
          <YouTube id={gig.youtube} title={gig.title} />
        </div>
      )}

      {gig.pdf && (
        <p className="mt-8">
          <a
            href={gig.pdf.url}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)] px-5 py-2 text-sm font-medium text-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-white"
          >
            ↓ {gig.pdf.label}
          </a>
        </p>
      )}

      {!gig.posterOnly && gig.images.length > 0 && (
        <div className="mt-10">
          <Gallery images={gig.images} />
        </div>
      )}
    </article>
  );
}
