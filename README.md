# BBLESSED – worship band

Statische Website der Band **BBLESSED** (Witten-Herbede), neu gebaut aus einem
alten WordPress-Backup (`bblessed.de`, Stand 2023). Kein CMS, kein Login –
Inhalte werden direkt in `content/*.json` bzw. in den Komponenten bearbeitet.

Schwesterprojekt zu `bandohneproben` (BOP) und `ben`.

## Stack

- Next.js 16 (App Router), `output: "export"` → rein statisch (`out/`)
- Tailwind CSS v4, `next/font` (Fraunces + Inter)
- Bilder mit `sharp` fürs Web verkleinert und **bewusst mitversioniert**
  (`public/images/`, `public/media/`), damit `git clone` + Vercel-Import ohne
  den lokalen Backup-Ordner funktioniert.

## Entwicklung

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # erzeugt out/  (kompletter statischer Export)
```

## Struktur

| Pfad | Inhalt |
|---|---|
| `content/about.json` | „Über uns“-Text, Zitat, Bandmitglieder |
| `content/gigs.json` | Chronik (36 Einträge, 2004–2021) – **hier Texte/Bilder pflegen** |
| `content/media.json` | Audio-Samples + Imagevideo (YouTube-ID) |
| `content/kontakt.json` | E-Mail + Impressum-Daten |
| `public/images/chronik/<slug>/` | Fotos je Chronik-Eintrag (Original + `-thumb`) |
| `public/media/audio/` | MP3-Samples · `public/media/chronik/` | PDFs |
| `app/` | Seiten: `/`, `/ueber-uns`, `/chronik` (+ `[slug]`), `/medien`, `/kontakt` |
| `components/` | `Nav`, `Footer`, `Gallery` (Lightbox), `YouTube` (Lite-Embed) |

## WordPress-Import (einmalig)

Die alte Seite wurde 2018 durch einen Spam-/Malware-Angriff beschädigt; im
DB-Dump stecken in einzelnen Beiträgen noch injizierte Script-Fragmente.
Deshalb wird der **Fließtext nicht aus der DB übernommen**, sondern in
`scripts/wp-import/import.mjs` von Hand sauber hinterlegt (kurze, verifizierte
Originaltexte). Aus der DB kommen nur Struktur-Daten (Titel, Datum) und die
Foto-Zuordnung.

```bash
node scripts/wp-import/extract-db.mjs   # DB-Dump -> scripts/wp-import/data/*.json  (nicht im Repo)
node scripts/wp-import/import.mjs        # -> content/*.json + public/images + public/media
node scripts/wp-import/make-icons.mjs    # app/icon.png, app/apple-icon.png
```

Backup-Quelle (nur lokal):
`D:\8 BACKUPS\10 Eigene Homepages\2023-09-01 1und1 Webspace vor Löschung\BBWP`
(+ `_DATENBANKEN\WP_BBlessed\db406155465.sql`).

Für laufende Textänderungen wird der Import **nicht** erneut ausgeführt –
einfach `content/*.json` direkt bearbeiten.

## Deploy

Wie BOP: GitHub-Repo → Vercel (mit GitHub verbunden), jeder Push auf `main`
deployt automatisch. `out/` wäre auch per reinem FTP lauffähig.
