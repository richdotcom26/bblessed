// Einmaliges Import-Skript fuer die BBLESSED-Homepage.
//
// Die alte WordPress-Seite (bblessed.de) wurde 2018 durch einen Spam-/Malware-
// Angriff beschaedigt; im DB-Backup stecken in einzelnen Beitraegen noch
// injizierte Script-Fragmente. Deshalb wird der Beitrags-FLIESSTEXT hier NICHT
// aus der DB uebernommen, sondern unten in GIGS von Hand sauber hinterlegt
// (kurze, verifizierte Originaltexte). Aus der DB kommen nur noch die
// unkritischen Struktur-Daten: Titel, Datum, sowie - ueber scripts/wp-import/
// data/bb-attachments.json - die Zuordnung der Fotos (Galerie-IDs bzw.
// post_parent) zu den echten Originaldateien im lokalen Backup-Ordner.
//
// Fotos werden mit sharp fuers Web verkleinert (max 1920px + 480px-Thumb) und
// nach public/images/ geschrieben; die fertigen Content-JSONs nach content/.
//
// Aufruf:  node scripts/wp-import/extract-db.mjs   (einmalig, erzeugt data/)
//          node scripts/wp-import/import.mjs
//
// Kuenftige Textaenderungen: direkt in content/*.json, nicht hier.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const DATA_DIR = path.join(import.meta.dirname, "data");
const UPLOADS_ROOT =
  "D:/8 BACKUPS/10 Eigene Homepages/2023-09-01 1und1 Webspace vor Löschung/BBWP/wp-content/uploads";
// Zusaetzliche lokale Quellen (nur auf Rainers Rechner):
const PHOTO_ROOT = "P:/4 PHOTO/Eigene Camera/Bands/Band Bblessed"; // Foto-Archiv nach Events
const POSTER_ROOT =
  "C:/Users/RainerWülbeck/OneDrive - dWERK GmbH & Co KG/Claude Code 1/BBlessed/Plakate"; // HBJ-Plakate
const PUBLIC_IMAGES = path.join(ROOT, "public", "images");
const PUBLIC_MEDIA = path.join(ROOT, "public", "media");
const CONTENT_DIR = path.join(ROOT, "content");

const attachments = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "bb-attachments.json"), "utf-8"));
const attById = new Map(attachments.map((a) => [a.id, a]));
const attByParent = new Map();
for (const a of attachments) {
  if (!attByParent.has(a.parent)) attByParent.set(a.parent, []);
  attByParent.get(a.parent).push(a);
}

// ---------------------------------------------------------------------------
// Kuratierter Inhalt. Reihenfolge = chronologisch. `body` ist fertiges,
// sauberes HTML (oder ""). `poster` = Attachment-ID fuers Vorschaubild.
// `gallery` = explizite Attachment-IDs; fehlt sie, werden die dem Beitrag
// zugeordneten Bilder (post_parent) genommen. `posterOnly` = grosses
// Plakat statt Foto-Raster (Happy-Birthday-Jesus-Ankuendigungen).
// ---------------------------------------------------------------------------

// Standardtext fuer die jaehrliche "Happy Birthday Jesus"-Reihe ab 2022
// (kein Material im alten Backup) - bei Bedarf pro Jahr ueberschreiben.
const HBJ_BODY =
  "<p>Wie in jedem Jahr am 23. Dezember um 23:30 Uhr: der besondere Gottesdienst in der evangelischen Kirche in Herbede – mit viel Musik und der Weihnachtsgeschichte feiern wir in Jesus’ Geburtstag hinein.</p>";

const GIGS = [
  {
    slug: "gruendung-2004",
    date: "2004-08-20",
    title: "Gründung 2004",
    body: "<p>Aus einer Gitarrentruppe bei Jugendandachten rund um den Billardtisch wird eine Band – jede Menge Gottesdienste, später als fester Bestandteil von <em>Jesus Inside</em> in Herbede.</p>",
  },
  {
    slug: "gig-beblessed-2006",
    date: "2006-11-24",
    title: "Gig (Be Blessed)",
    body: "<p>Ein früher Auftritt – damals noch als „Be Blessed“.</p>",
    photoDir: "2006_11_24 Gig BeBlessed",
    photoLimit: 24,
  },
  {
    slug: "biker-gottesdienst-herbede-2007",
    date: "2007-05-19",
    title: "Biker-Gottesdienst Herbede",
    body: "",
  },
  {
    slug: "kirchentag-koeln-2007",
    date: "2007-06-07",
    title: "Ev. Kirchentag Köln 2007",
    body: "<p>Unser erster Kirchentag mit dem Jesus-Inside-Team, bei dem wir als Band fester Bestandteil waren.</p>",
    poster: 2469,
  },
  {
    slug: "jogodi-2007",
    date: "2007-11-11",
    title: "JoGoDi – Jugendgottesdienst",
    body: "<p>Musik beim Jugendgottesdienst.</p>",
    photoDir: "2007_11_11 Jogodi",
  },
  {
    slug: "thanks-mlk-witten-2008",
    date: "2008-02-08",
    title: "„Thanks“ – MLK Witten",
    body: "",
    photoDir: "2008_02_08 Thanx",
    photoLimit: 36,
  },
  {
    slug: "konficamp-hamm-2008",
    date: "2008-06-19",
    title: "KonfiCamp in Hamm",
    body: "<p>Der Tag war perfekt: Sonne, wunderschöne Bühne, bestgelaunte Konfis. Doch dann die unverhoffte Unwetterwarnung – Sturzbäche kamen vom Himmel. Alles half nichts. Wir haben mit den verbliebenen Konfis unter Regenschirmen, Plastiktüten und Bierzelttischen ein grandioses Konzert gefeiert. Sensationell!</p>",
    photoDir: "2008_06_09 BBLESSED Hamm",
    photoLimit: 40,
  },
  {
    slug: "sponsoren-dankeschoen-2008",
    date: "2008-07-06",
    title: "Sponsoren-Dankeschön-Gottesdienst",
    body: "<p>Unser Dank an alle Sponsoren, die den Umbau unserer Kirche ermöglicht haben!</p>",
  },
  {
    slug: "nuerburgring-2009",
    date: "2009-05-30",
    title: "„Anlassen“ am Nürburgring 2009",
    body: "<p>Bikergottesdienst am Ring – ein erster Vorgeschmack auf das Jahr darauf.</p>",
    photoDir: "2009_05_30 BB Nürburgring",
  },
  {
    slug: "kirchentag-bremen-2009",
    date: "2009-06-02",
    title: "Ev. Kirchentag Bremen 2009",
    body: "",
  },
  {
    slug: "anlassen-nuerburgring-2010",
    date: "2010-04-18",
    title: "„Anlassen“ am Nürburgring",
    body: "<p>Sicher eins der Erlebnis-Highlights unserer Band: 10.000 Biker am Ring – und wir sind mittendrin.</p>",
    poster: 2536,
  },
  {
    slug: "kirchentag-dresden-2011",
    date: "2011-06-02",
    title: "Ev. Kirchentag Dresden 2011",
    body: "<p>Mit dem Jesus-Inside-Team beim Deutschen Evangelischen Kirchentag in Dresden – Auftritt, Stadt und ein paar Tage on the road.</p>",
    photoDir: "P:/4 PHOTO/Eigene Camera/2011/2011-06-xx Kirchentag",
    photoLimit: 30,
  },
  {
    slug: "shelter-from-the-rain-2011",
    date: "2011-10-01",
    title: "Shelter From The Rain",
    body: "<p>Gemeinsames Benefizkonzert von BBlessed und dem Chor Efharisto in der evangelischen Kirche in Herbede – der Erlös hilft bei der Refinanzierung des Kirchendachs. Der Auftakt, dem 2012 „Shelter From The Rain – II“ folgte.</p>",
    photoDir: "2011",
    photoLimit: 15,
  },
  {
    slug: "biker-gottesdienst-halver-april-2012",
    date: "2012-04-03",
    title: "Biker-Gottesdienst in Halver",
    body: "<p>Halb 12 in Halver – Bikergottesdienst für die ganze Gemeinde.</p>",
  },
  {
    slug: "erster-biker-gottesdienst-ruedinghausen-2012",
    date: "2012-05-27",
    title: "1. Biker-Gottesdienst in Rüdinghausen",
    body:
      "<p>Die ev. Kirchengemeinde Rüdinghausen veranstaltete ihren ersten Biker-Gottesdienst – und Pfarrerin Elke Helmerich predigte entsprechend.</p>" +
      "<blockquote><p>„Willi? Du sammelst. Aber denk’ dran, nicht im Klingelbeutel, sondern im Helm wird gesammelt.“ … Für die entsprechende Lockerheit sorgt die Band „BBlessed“, die mit zwei Akustik-Gitarren, Bass und Schlagzeug poppige Songs über Gott und die Welt zum Besten gibt. Neben dem Altar steht ein Motorrad, rund um den Altar haben die anwesenden Biker ihre Helme platziert. … Mit dem Segen von Elke Helmerich und Musik von BBlessed werden die Biker nach einer Dreiviertelstunde zu ihren Maschinen entlassen.</p><p>— Walter Demtröder, WAZ</p></blockquote>",
  },
  {
    slug: "jugendtag-bochum-2012",
    date: "2012-06-07",
    title: "Jugendtag Bochum",
    body: "<p>Jugendtag des Jugend-Pfarramts in Bochum. Den ganzen Tag über Aktionen für Jung und Alt, anschließend an das Konzert ein JumpIn-Gottesdienst.</p>",
  },
  {
    slug: "bikergottesdienst-neuenrade-christleben-dortmund-2012",
    date: "2012-06-17",
    title: "Bikergottesdienst Neuenrade & Christleben Dortmund",
    body:
      "<p>Der 17. Juni war für uns mit zwei Auftritten ein Highlight. In aller Herrgottsfrühe sind wir aufgebrochen, um um 10 Uhr beim Bikergottesdienst in Neuenrade zu sein. Über ein paar Ecken hatte sich herumgesprochen, dass BBlessed die richtige Band für solche Anlässe ist – so haben wir uns sehr über die Einladung gefreut. Der MoGo in Neuenrade hat Tradition, und so kamen bei bestem Bikerwetter rund 150 Mopedfahrer und viele Besucher. Auf einer tollen Bühne mit fetter Anlage und unserem extra aus Wien eingeflogenen Tontech Karsten hatten wir richtig viel Spaß, ein paar rockige Worshipsongs über den Schulplatz zu schicken und anschließend einen schönen Gottesdienst zu begleiten.</p>" +
      "<p>Danach ging es nach dem Einpacken in den Dortmunder Süden, wo eine grandiose Bühne beim Straßenfest Christleben auf uns wartete. Das erste von drei Gemeinden veranstaltete Fest war dank Wettersegen und vieler Besucher ein voller Erfolg. Mit einem eineinhalbstündigen Konzertprogramm zum Abschluss des Tages gelang es uns, die Leute zu begeistern und auf unsere Weise Glaubenszeugnis abzulegen. Im nächsten Jahr sind wir gerne wieder dabei!</p>",
    poster: 2297,
  },
  {
    slug: "christleben-dortmund-2012",
    date: "2012-06-17",
    title: "Christleben Dortmund",
    body: "<p>Straßenfest Christleben im Dortmunder Süden – eineinhalb Stunden Konzertprogramm zum Abschluss des Tages.</p>",
    poster: 2276,
  },
  {
    slug: "bikergottesdienst-ruedinghausen-juni-2012",
    date: "2012-06-24",
    title: "Bikergottesdienst Rüdinghausen",
    body: "<p>Erster Biker-Gottesdienst der Ev. KG Witten-Rüdinghausen. Natürlich ist BBlessed dabei – diesmal unplugged!</p>",
  },
  {
    slug: "biker-gottesdienst-feg-halver-2012",
    date: "2012-07-08",
    title: "Biker-Gottesdienst FEG Halver",
    body: "<p>Gottesdienst mit der FEG Halver.</p>",
  },
  {
    slug: "shelter-from-the-rain-2-2012",
    date: "2012-09-28",
    title: "Shelter From The Rain – II",
    body:
      "<p><em>Er hält seine Hand schützend über mir …</em> Gemeinsames Benefiz-Konzert der Band BBlessed und des Chores Efharisto. Special Guest: Rise Up.</p>" +
      "<p>Nach einem erfolgreichen Auftakt im Jahr 2011 wollen wir im 20. Chorjahr des Efharisto nahtlos daran anschließen. Die Zusammenarbeit zwischen Chor und Band hat sich immer weiter vertieft, so dass sich der Zuhörer auf ein abwechslungsreiches Programm freuen darf, das dennoch Zeit zum Klönen lässt. Der gesamte Erlös hilft bei der Refinanzierung des Kirchendachs. Einlass 19:30 Uhr, Beginn 20:00 Uhr.</p>",
    poster: 2591,
  },
  {
    slug: "joyn-worship-festival-2012",
    date: "2012-11-02",
    title: "JoYn – Worship-Festival",
    body: "",
    poster: 2582,
  },
  {
    slug: "happy-birthday-jesus-2012",
    date: "2012-12-23",
    title: "Happy Birthday Jesus 2012",
    body: "<p>Der besondere Gottesdienst am 23. Dezember um 23:30 Uhr in der evangelischen Kirche in Herbede.</p>",
    posterFile: "HBJ-2012.jpg",
    posterOnly: true,
  },
  {
    slug: "gemeindefest-ickern-2013",
    date: "2013-07-06",
    title: "Gemeindefest Ickern",
    body: "<p>Wir spielen zunächst im Meeting und anschließend noch ein Konzert.</p>",
  },
  {
    slug: "herbeder-oktoberfest-2013",
    date: "2013-10-07",
    title: "Herbeder Oktoberfest",
    body: "<p>Gottesdienst und Konzert.</p>",
  },
  {
    slug: "happy-birthday-jesus-2013",
    date: "2013-12-23",
    title: "Happy Birthday Jesus 2013",
    body: "",
    posterFile: "HBJ-2013.jpg",
    posterOnly: true,
  },
  {
    slug: "10-jahre-bblessed-2014",
    date: "2014-09-21",
    title: "10 Jahre BBLESSED",
    body: "<p>Zehn Jahre BBLESSED – gefeiert mit einer Worship-Session.</p>",
    poster: 406,
  },
  {
    slug: "happy-birthday-jesus-2014",
    date: "2014-12-23",
    title: "Happy Birthday Jesus 2014",
    body: "",
    posterFile: "HBJ-2014.JPG",
    posterOnly: true,
  },
  {
    slug: "happy-birthday-jesus-2015",
    date: "2015-12-23",
    title: "Happy Birthday Jesus 2015",
    body: "",
    posterFile: "HBJ-2015.jpg",
    posterOnly: true,
  },
  {
    slug: "psalm-23-2016",
    date: "2016-09-26",
    title: "Psalm 23",
    body:
      "<blockquote><p>Der HERR ist mein Hirte, mir wird nichts mangeln. Er weidet mich auf einer grünen Aue und führet mich zum frischen Wasser. Er erquicket meine Seele; er führet mich auf rechter Straße um seines Namens willen. Und ob ich schon wanderte im finstern Tal, fürchte ich kein Unglück; denn du bist bei mir, dein Stecken und Stab trösten mich. Du bereitest vor mir einen Tisch im Angesicht meiner Feinde. Du salbest mein Haupt mit Öl und schenkest mir voll ein. Gutes und Barmherzigkeit werden mir folgen mein Leben lang, und ich werde bleiben im Hause des HERRN immerdar.</p><p>— Psalm 23</p></blockquote>",
    poster: 2612,
  },
  {
    slug: "happy-birthday-jesus-2016",
    date: "2016-12-23",
    title: "Happy Birthday Jesus 2016",
    body: "",
    posterFile: "HBJ-2016.jpg",
    posterOnly: true,
  },
  {
    slug: "kirchentag-berlin-wittenberg-2017",
    date: "2017-05-25",
    title: "Ev. Kirchentag Berlin / Wittenberg 2017",
    body: "<p>Wir sind dabei: Donnerstag, 25.05.2017, 11 Uhr, Kirche zum Heilsbronnen (U-Bahn-Station Bayerischer Platz).</p>",
    poster: 2260,
  },
  {
    slug: "happy-birthday-jesus-2017",
    date: "2017-12-23",
    title: "Happy Birthday Jesus 2017",
    body: "",
    posterFile: "HBJ-2017.jpg",
    posterOnly: true,
  },
  {
    slug: "neue-homepage-2018",
    date: "2018-09-21",
    title: "Neue Homepage",
    body:
      "<p>Hallo zusammen! Unsere alte Homepage ist leider durch einen Spam-Angriff geschrottet worden. Mit ihr sind viele Bilder und Beiträge vergangener Gottesdienste, Kirchentage und anderer Feiern ins Internet-Nirvana geschickt worden. Manche Beiträge konnten gerettet werden, sehen nur ein wenig komisch aus :-) Damit wir wieder eine Visitenkarte unserer Musik und unserer Band im Netz haben, bauen wir unsere Seite nach und nach wieder auf.</p><p>Bis bald!</p>",
  },
  {
    slug: "kirchentag-dortmund-2019-anmeldung",
    date: "2018-09-26",
    title: "Kirchentag Dortmund 2019",
    body: "<p>Unsere Anmeldung für den Kirchentag in Dortmund ist raus (-: Hoffen wir mal, dass wir dabei sein dürfen.</p>",
    poster: 2605,
  },
  {
    slug: "happy-birthday-jesus-2018",
    date: "2018-12-23",
    title: "Happy Birthday Jesus 2018",
    body: "<p>Am 23. Dezember feiern wir wieder in Jesus’ Geburtstag hinein. Viel Musik, die Weihnachtsgeschichte und eine Ansprache von Thorsten Schröder.</p>",
    posterFile: "HBJ-2018.jpg",
    posterOnly: true,
  },
  {
    slug: "dekt-dortmund-2019",
    date: "2019-06-17",
    title: "Wir sind beim DEKT in Dortmund",
    body: "<p>BBlessed beim Deutschen Evangelischen Kirchentag 2019 in Dortmund.</p>",
    poster: 2665,
  },
  {
    slug: "happy-birthday-jesus-2019",
    date: "2019-12-23",
    title: "Happy Birthday Jesus 2019",
    body: HBJ_BODY,
    posterFile: "HBJ-2019.JPG",
    posterOnly: true,
  },
  {
    slug: "happy-birthday-jesus-livestream-2020",
    date: "2020-12-23",
    title: "Happy Birthday Jesus – Livestream 2020",
    body:
      "<p>Unter normalen Umständen findet dieser besondere Gottesdienst traditionell am 23. Dezember um 23:30 Uhr in der evangelischen Kirche in Herbede statt. In diesem Jahr ist das leider nicht realisierbar. Trotzdem möchten wir diesen musikalischen Gottesdienst unter Einhaltung der Hygienemaßnahmen mit Euch feiern – live und in Farbe. Also, schaltet ein!</p>",
    youtube: "o4lYBMF1FvY",
    poster: 2783,
  },
  {
    slug: "happy-birthday-jesus-2021-trailer",
    date: "2021-11-25",
    title: "Happy Birthday Jesus 2021 – Trailer",
    body: "<p>Vorab-Trailer zum Livestream am 23. Dezember.</p>",
    youtube: "2ywa21AwTyE",
    poster: 2742,
  },
  {
    slug: "happy-birthday-jesus-livestream-2021",
    date: "2021-12-23",
    title: "Happy Birthday Jesus – Livestream 2021",
    body:
      "<p>Auch in diesem Jahr findet dieser besondere Gottesdienst wieder am 23. Dezember um 23:30 Uhr statt – nicht in der evangelischen Kirche in Herbede, sondern direkt live aus dem Tonstudio in Euer Wohnzimmer. Also, schaltet ein!</p>",
    pdf: 2777,
    pdfLabel: "Songbook zum Livestream (PDF)",
    posterFile: "HBJ-2021.jpg",
  },
  // Ab 2022: Plakate aus dem Ordner "BBlessed/Plakate". 2026 noch ohne Plakat.
  {
    slug: "happy-birthday-jesus-2022",
    date: "2022-12-23",
    title: "Happy Birthday Jesus 2022",
    body: HBJ_BODY,
    posterFile: "HBJ-2022.jpeg",
    posterOnly: true,
  },
  {
    slug: "happy-birthday-jesus-2023",
    date: "2023-12-23",
    title: "Happy Birthday Jesus 2023",
    body: HBJ_BODY,
    posterFile: "HBJ-2023.jpg",
    posterOnly: true,
  },
  {
    slug: "happy-birthday-jesus-2024",
    date: "2024-12-23",
    title: "Happy Birthday Jesus 2024",
    body: HBJ_BODY,
    posterFile: "HBJ-2024.jpg",
    posterOnly: true,
  },
  {
    slug: "happy-birthday-jesus-2025",
    date: "2025-12-23",
    title: "Happy Birthday Jesus 2025",
    body: HBJ_BODY,
    posterFile: "HBJ-2025.JPG",
    posterOnly: true,
  },
  // Kuenftige Termine (auch HBJ 2026) stehen in content/termine.json und
  // rutschen automatisch in die Chronik, sobald ihr Datum vergangen ist.
];

// Bandmitglieder (aus der Seite „Über uns“).
const MEMBERS = [
  { name: "Marco Gibis", role: "Gesang, Akustik- und E-Gitarre", file: "2012/05/Marco.jpg", position: "center 20%" },
  { name: "Rainer Wülbeck", role: "E-Gitarre und Akustikgitarre", file: "2012/06/1-IMG_01179.jpg" },
  { name: "Thomas Post", role: "Schlagzeug und Background-Gesang", file: "2015/04/ToPo.jpg" },
  { name: "Frank Nelle", role: "E-Bass und Kontrabass", file: "2013/07/FrankKopie.jpg" },
  { name: "Mandy Rohr", role: "Percussion und Multitalent", file: "2015/04/Mandy.jpg" },
];

// „Medien“: Audio-Samples 2017 (Playlist der alten Seite) + Imagevideo 2009.
const TRACKS = [
  { id: 2553, title: "How Great Is Our God", artist: "Chris Tomlin" },
  { id: 2552, title: "Näher zu dir", artist: "Lothar Kosse" },
  { id: 2551, title: "Oceans", artist: "Hillsong" },
  { id: 2550, title: "Wer weiß wohin", artist: "Johannes Falk" },
  { id: 2549, title: "Hear My Prayer", artist: "BBlessed" },
  { id: 287, title: "You Never Let Go", artist: "Matt Redman" },
  { id: 192, title: "Gott allmächtig", artist: "BBlessed" },
];
const IMAGE_VIDEO_YOUTUBE = "v6B3Izo2Shk"; // Imagevideo 2009

// ---------------------------------------------------------------------------
// Bild-/Datei-Aufloesung
// ---------------------------------------------------------------------------
function localFileForRel(rel) {
  const full = path.join(UPLOADS_ROOT, ...rel.split("/"));
  return fs.existsSync(full) ? full : null;
}
function localFileForAtt(att) {
  if (!att) return null;
  if (att.file) return fs.existsSync(att.file) ? att.file : null; // direkter Pfad (Plakate/Fotos)
  if (att.attachedFile) {
    const f = localFileForRel(att.attachedFile);
    if (f) return f;
  }
  const m = String(att.guid || "").match(/\/wp-content\/uploads\/(.+)$/);
  if (m) return localFileForRel(decodeURIComponent(m[1]));
  return null;
}

// Bilddateien (jpg/jpeg/png) eines Ordners, sortiert; .picasaoriginals raus.
function listPhotos(absDir, limit) {
  if (!fs.existsSync(absDir)) {
    console.warn("  ! Foto-Ordner fehlt:", absDir);
    return [];
  }
  let files = fs
    .readdirSync(absDir)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, "de", { numeric: true }));
  if (limit && files.length > limit) {
    // gleichmaessig ueber den Ordner verteilt auswaehlen statt nur die ersten N
    const step = files.length / limit;
    files = Array.from({ length: limit }, (_, i) => files[Math.floor(i * step)]);
  }
  return files.map((f) => ({ file: path.join(absDir, f), title: "" }));
}

const resizeCache = new Map();
// thumbFit:
//   "cover"  - quadratischer Ausschnitt 480x480 (Galerie-Raster)
//   "inside" - seitenverhaeltnis-treu in eine 640er-Box (Chronik-Vorschau:
//              A4-Plakate erscheinen hochkant, Fotos im Querformat)
async function copyResized(
  att,
  destDir,
  publicPrefix,
  { maxWidth = 1920, quality = 82, makeThumb = false, thumbFit = "cover" } = {}
) {
  const full = localFileForAtt(att);
  if (!full) {
    console.warn("  ! Datei fehlt fuer Attachment", att && att.id, att && att.attachedFile);
    return null;
  }
  const cacheKey = `${full}|${destDir}|${maxWidth}|${makeThumb}|${thumbFit}`;
  if (resizeCache.has(cacheKey)) return resizeCache.get(cacheKey);

  fs.mkdirSync(destDir, { recursive: true });
  const isPng = /\.png$/i.test(full);
  const ext = isPng ? "png" : "jpg";
  const baseName = path.basename(full).replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const outName = `${baseName}.${ext}`;
  const outPath = path.join(destDir, outName);

  if (!fs.existsSync(outPath)) {
    let img = sharp(full).rotate();
    const meta = await img.metadata();
    if (meta.width && meta.width > maxWidth) img = img.resize({ width: maxWidth });
    img = isPng ? img.png({ quality }) : img.jpeg({ quality, mozjpeg: true });
    await img.toFile(outPath);
  }
  const { width: w = null, height: h = null } = await sharp(outPath).metadata();

  let thumbName = null;
  let thumbW = w;
  let thumbH = h;
  if (makeThumb) {
    thumbName = `${baseName}-thumb.${ext}`;
    const thumbPath = path.join(destDir, thumbName);
    const resizeOpts =
      thumbFit === "inside"
        ? { width: 640, height: 640, fit: "inside", withoutEnlargement: true }
        : { width: 480, height: 480, fit: "cover", position: "attention" };
    if (!fs.existsSync(thumbPath)) {
      let t = sharp(full).rotate().resize(resizeOpts);
      t = isPng ? t.png({ quality: 78 }) : t.jpeg({ quality: 78, mozjpeg: true });
      await t.toFile(thumbPath);
    }
    const tm = await sharp(thumbPath).metadata();
    thumbW = tm.width ?? thumbW;
    thumbH = tm.height ?? thumbH;
  }

  const result = {
    src: `${publicPrefix}/${outName}`,
    thumb: thumbName ? `${publicPrefix}/${thumbName}` : `${publicPrefix}/${outName}`,
    w: thumbW,
    h: thumbH,
    alt: (att.title || "").replace(/SAMSUNG DIGITAL CAMERA/i, "").trim(),
  };
  resizeCache.set(cacheKey, result);
  return result;
}

function copyRaw(att, destDir, publicPrefix) {
  const full = localFileForAtt(att);
  if (!full) {
    console.warn("  ! Datei fehlt (raw) fuer", att && att.id);
    return null;
  }
  fs.mkdirSync(destDir, { recursive: true });
  const outName = path.basename(full).replace(/[^a-zA-Z0-9_.-]/g, "_");
  fs.copyFileSync(full, path.join(destDir, outName));
  return `${publicPrefix}/${outName}`;
}

// ---------------------------------------------------------------------------
async function main() {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });

  // ---- Chronik ----
  const gigs = [];
  for (const g of GIGS) {
    const destDir = path.join(PUBLIC_IMAGES, "chronik", g.slug);
    const publicPrefix = `/images/chronik/${g.slug}`;

    // Foto-Quelle: expliziter Ordner (photoDir) hat Vorrang, sonst WP-Galerie.
    // photoDir: relativ zu PHOTO_ROOT oder absoluter Pfad (Laufwerksbuchstabe).
    const resolvePhotoDir = (d) => (/^([A-Za-z]:[\\/]|\/)/.test(d) ? d : path.join(PHOTO_ROOT, d));
    const galleryAtts = g.photoDir
      ? listPhotos(resolvePhotoDir(g.photoDir), g.photoLimit)
      : (g.gallery || (attByParent.get(idFromSlug(g)) || []).map((a) => a.id))
          .map((id) => attById.get(id))
          .filter(Boolean);

    let poster = null;
    const posterSrc = g.posterFile
      ? { file: path.join(POSTER_ROOT, g.posterFile), title: g.title }
      : g.poster
        ? attById.get(g.poster)
        : null;
    if (posterSrc) {
      poster = await copyResized(posterSrc, destDir, publicPrefix, {
        maxWidth: 1600,
        makeThumb: true,
        thumbFit: "inside",
      });
    }

    let images = [];
    if (!g.posterOnly) {
      for (const att of galleryAtts) {
        const r = await copyResized(att, destDir, publicPrefix, { maxWidth: 1920, makeThumb: true });
        if (r) images.push(r);
      }
    }
    // Dubletten (gleiche Datei) raus
    const seen = new Set();
    images = images.filter((i) => (seen.has(i.src) ? false : seen.add(i.src)));

    if (!poster && images[0]) poster = images[0];

    let pdf = null;
    if (g.pdf) {
      const url = copyRaw(attById.get(g.pdf), path.join(PUBLIC_MEDIA, "chronik"), "/media/chronik");
      if (url) pdf = { url, label: g.pdfLabel || "PDF herunterladen" };
    }

    gigs.push({
      slug: g.slug,
      title: g.title,
      date: g.date,
      year: Number(g.date.slice(0, 4)),
      bodyHtml: g.body || "",
      poster,
      posterOnly: !!g.posterOnly,
      images: g.posterOnly ? [] : images,
      youtube: g.youtube || null,
      pdf,
    });
    console.log(`Chronik: ${g.date}  ${g.title}  (${images.length} Fotos${poster ? ", Poster" : ""})`);
  }
  fs.writeFileSync(path.join(CONTENT_DIR, "gigs.json"), JSON.stringify(gigs, null, 2));

  // ---- Ueber uns ----
  const members = [];
  for (const m of MEMBERS) {
    const destDir = path.join(PUBLIC_IMAGES, "band");
    const r = await copyResized(
      { id: `m-${m.name}`, title: m.name, attachedFile: m.file },
      destDir,
      "/images/band",
      { maxWidth: 700, makeThumb: false }
    );
    members.push({ name: m.name, role: m.role, photo: r ? r.src : null, position: m.position || "center" });
    console.log("Mitglied:", m.name, r ? "ok" : "OHNE FOTO");
  }
  const about = {
    intro:
      "2003 ist BBLESSED entstanden – in Witten-Herbede im Ruhrpott – aus einer Gitarrentruppe bei Jugendandachten rund um den Billardtisch. Die Idee war von Anfang an, Musik mit dem Glauben an Gott zu verbinden und die Reihe „Schock deine Nachbarn – geh in den Gottesdienst“ des Jesus-Inside-Teams aus Herbede musikalisch mitzugestalten. Wir verstehen uns nicht nur als Musiker, die christliche Musik machen, sondern als Christen, die Musik machen – jeder mit seiner eigenen Sicht und eigenen Aspekten. Genauso halten wir es mit den Songs. So treffen musikalisches Können und Ehrlichkeit im Umgang mit dem Glauben zusammen, bei der Mitgestaltung von Gottesdiensten ebenso wie bei Konzerten.",
    quote: "Wir sind nicht nur Musiker, die christliche Musik machen, sondern Christen, die Musik machen.",
    outro:
      "Erfahrung und Flexibilität haben sich durch unzählige Gottesdienste und größere Veranstaltungen auch außerhalb des eigenen Kirchenkreises eingestellt – durch die Mitwirkung bei JesusHouse Witten, den Ev. Kirchentagen 2007 in Köln, 2009 in Bremen und 2011 in Dresden, bei Bikergottesdiensten vom Nürburgring bis ins Sauerland. „Plugged“ oder „unplugged“, vor 30 oder 1.000 Leuten. Wir bewegen uns zwischen Rock, Pop und Folk, gecovert und selbst komponiert, auf Deutsch und auf Englisch … authentisch.",
    members,
  };
  fs.writeFileSync(path.join(CONTENT_DIR, "about.json"), JSON.stringify(about, null, 2));

  // ---- Medien ----
  const tracks = [];
  for (const t of TRACKS) {
    const url = copyRaw(attById.get(t.id), path.join(PUBLIC_MEDIA, "audio"), "/media/audio");
    if (url) tracks.push({ title: t.title, artist: t.artist, url });
    console.log("Track:", t.title, url ? "ok" : "FEHLT");
  }
  fs.writeFileSync(
    path.join(CONTENT_DIR, "media.json"),
    JSON.stringify({ tracks, imageVideoYoutube: IMAGE_VIDEO_YOUTUBE }, null, 2)
  );

  // ---- Kontakt / Impressum (neu, sauber) ----
  const kontakt = {
    email: "kontakt@bblessed.de",
    impressum: {
      name: "Rainer Wülbeck",
      address: "Kirchstr. 8, 58456 Witten",
    },
  };
  fs.writeFileSync(path.join(CONTENT_DIR, "kontakt.json"), JSON.stringify(kontakt, null, 2));

  console.log(`\nFertig. Chronik: ${gigs.length} Einträge, ${members.length} Mitglieder, ${tracks.length} Tracks.`);
}

// Die post_parent-Zuordnung braucht die urspruengliche Post-ID; wir mappen
// Slug -> ID ueber eine kleine Tabelle (nur fuer Beitraege ohne explizite
// gallery-Liste, die ihre Bilder per post_parent haben).
const SLUG_TO_POSTID = {
  "biker-gottesdienst-herbede-2007": 637,
  "kirchentag-koeln-2007": 2435,
  "thanks-mlk-witten-2008": 2415,
  "konficamp-hamm-2008": 2381,
  "sponsoren-dankeschoen-2008": 643,
  "anlassen-nuerburgring-2010": 2299,
  "bikergottesdienst-neuenrade-christleben-dortmund-2012": 313,
  "christleben-dortmund-2012": 592,
  "shelter-from-the-rain-2-2012": 597,
  "10-jahre-bblessed-2014": 2196,
  "psalm-23-2016": 2606,
  "kirchentag-berlin-wittenberg-2017": 2075,
  "kirchentag-dortmund-2019-anmeldung": 2594,
  "dekt-dortmund-2019": 2664,
  "happy-birthday-jesus-livestream-2020": 2668,
  "happy-birthday-jesus-2021-trailer": 2738,
  "happy-birthday-jesus-livestream-2021": 2785,
};
function idFromSlug(g) {
  return SLUG_TO_POSTID[g.slug] ?? -1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
