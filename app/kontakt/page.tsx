import type { Metadata } from "next";
import { kontakt } from "@/lib/content";
import { EmailLink } from "@/components/EmailLink";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakt und Impressum von BBLESSED – Anfragen für Gottesdienste, Kirchentage und Konzerte per E-Mail.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display-upper text-4xl text-[var(--color-fg)] sm:text-6xl">
        <span className="text-[var(--color-accent)]">/</span> Kontakt
      </h1>

      <p className="mt-8 text-lg">
        Anfragen für Gottesdienste, Kirchentage oder Konzerte gerne an{" "}
        <EmailLink className="text-[var(--color-accent)] underline underline-offset-2" />.
      </p>

      <hr className="my-10 border-[var(--color-border)]" />

      <h2 className="font-display text-2xl font-semibold text-[var(--color-fg)]">Impressum</h2>
      <p className="mt-4 leading-relaxed">
        {kontakt.impressum.name}
        <br />
        {kontakt.impressum.address}
        <br />
        E-Mail:{" "}
        <a
          href={`mailto:${kontakt.email}`}
          className="text-[var(--color-accent)] underline underline-offset-2"
        >
          {kontakt.email}
        </a>
      </p>

      <h3 className="mt-8 font-display text-lg font-semibold text-[var(--color-fg)]">
        Haftung für Inhalte
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach
        den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
        jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
        oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
      </p>
      <h3 className="mt-6 font-display text-lg font-semibold text-[var(--color-fg)]">
        Haftung für Links
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
        Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
        Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
        Seiten verantwortlich.
      </p>
      <h3 className="mt-6 font-display text-lg font-semibold text-[var(--color-fg)]">Urheberrecht</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
        deutschen Urheberrecht. Downloads und Kopien dieser Seite sind nur für den privaten, nicht
        kommerziellen Gebrauch gestattet.
      </p>
    </div>
  );
}
