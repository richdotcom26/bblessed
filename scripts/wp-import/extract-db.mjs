// Einmaliger DB-Extrakt: liest den mysqldump der alten BBLESSED-WordPress-Datenbank
// (D:\8 BACKUPS\...\_DATENBANKEN\WP_BBlessed\db406155465.sql) ohne echten MySQL-Server,
// parst die relevanten INSERTs und schreibt schlanke JSON-Zwischendateien nach data/.
// Diese data/*.json sind NICHT im Repo (siehe .gitignore) - sie sind nur die Brücke
// zwischen Backup und dem eigentlichen Import (import.mjs).
//
// Aufruf:  node scripts/wp-import/extract-db.mjs

import fs from "node:fs";
import path from "node:path";

const SQL =
  "D:/8 BACKUPS/10 Eigene Homepages/2023-09-01 1und1 Webspace vor Löschung/_DATENBANKEN/WP_BBlessed/db406155465.sql";
const OUT = path.join(import.meta.dirname, "data");

const raw = fs.readFileSync(SQL, "utf-8");

// ---- mysqldump INSERT-Parser ---------------------------------------------------
// Verarbeitet  INSERT INTO `t` (`a`,`b`,...) VALUES (..),(..),...;
// inkl. der Standard-mysqldump-Escapes  \n \r \t \\ \' \" \0 \Z  in Strings.
const UNESCAPE = { n: "\n", r: "\r", t: "\t", "0": "\0", Z: "\x1a", b: "\b", "\\": "\\", "'": "'", '"': '"' };

function parseInserts(sql, table) {
  const rows = [];
  const re = new RegExp("INSERT INTO `" + table + "` \\(([^)]+)\\) VALUES", "g");
  let m;
  while ((m = re.exec(sql))) {
    const cols = m[1].split(",").map((c) => c.trim().replace(/`/g, ""));
    let i = re.lastIndex;
    while (i < sql.length) {
      while (i < sql.length && /[\s,]/.test(sql[i])) i++;
      if (sql[i] === ";") { i++; break; }
      if (sql[i] !== "(") { i++; continue; }
      i++;
      const vals = [];
      let cur = "";
      let inStr = false;
      let done = false;
      while (i < sql.length && !done) {
        const ch = sql[i];
        if (inStr) {
          if (ch === "\\") {
            const nx = sql[i + 1];
            cur += UNESCAPE[nx] ?? nx;
            i += 2;
            continue;
          }
          if (ch === "'") { inStr = false; i++; continue; }
          cur += ch; i++; continue;
        } else {
          if (ch === "'") { inStr = true; i++; continue; }
          if (ch === ",") { vals.push(cur); cur = ""; i++; continue; }
          if (ch === ")") { vals.push(cur); i++; done = true; break; }
          if (!/\s/.test(ch)) cur += ch;
          i++;
        }
      }
      const obj = {};
      cols.forEach((c, idx) => {
        let v = vals[idx];
        if (v === "NULL") v = null;
        obj[c] = v;
      });
      rows.push(obj);
      re.lastIndex = i;
    }
  }
  return rows;
}

const num = (v) => (v == null ? null : Number(v));

// ---- wp_posts ---------------------------------------------------------------
const posts = parseInserts(raw, "wp_posts").map((p) => ({
  id: num(p.ID),
  parent: num(p.post_parent),
  author: num(p.post_author),
  date: p.post_date,
  content: p.post_content ?? "",
  title: p.post_title ?? "",
  excerpt: p.post_excerpt ?? "",
  status: p.post_status,
  name: p.post_name ?? "",
  type: p.post_type,
  mime: p.post_mime_type ?? "",
  guid: p.guid ?? "",
  menuOrder: num(p.menu_order),
}));

// ---- wp_postmeta (fuer _thumbnail_id, _wp_attached_file, _wp_attachment_metadata) ----
const postmeta = parseInserts(raw, "wp_postmeta").map((r) => ({
  postId: num(r.post_id),
  key: r.meta_key,
  value: r.meta_value ?? "",
}));
const metaByPost = new Map();
for (const r of postmeta) {
  if (!metaByPost.has(r.postId)) metaByPost.set(r.postId, {});
  metaByPost.get(r.postId)[r.key] = r.value;
}

// ---- Attachments --------------------------------------------------------------
const attachments = posts
  .filter((p) => p.type === "attachment")
  .map((p) => {
    const meta = metaByPost.get(p.id) || {};
    return {
      id: p.id,
      parent: p.parent,
      title: p.title,
      mime: p.mime,
      guid: p.guid,
      attachedFile: meta._wp_attached_file || "",
      date: p.date,
    };
  });

// ---- Terms / Taxonomien (fuer Kategorie-Namen der Chronik) -------------------
const terms = parseInserts(raw, "wp_terms").map((t) => ({ id: num(t.term_id), name: t.name, slug: t.slug }));
const termTax = parseInserts(raw, "wp_term_taxonomy").map((t) => ({
  ttId: num(t.term_taxonomy_id),
  termId: num(t.term_id),
  taxonomy: t.taxonomy,
}));
const termRel = parseInserts(raw, "wp_term_relationships").map((t) => ({
  objectId: num(t.object_id),
  ttId: num(t.term_taxonomy_id),
}));
const termById = new Map(terms.map((t) => [t.id, t]));
const taxByTt = new Map(termTax.map((t) => [t.ttId, t]));
const termsByObject = new Map();
for (const r of termRel) {
  const tax = taxByTt.get(r.ttId);
  if (!tax) continue;
  const term = termById.get(tax.termId);
  if (!term) continue;
  if (!termsByObject.has(r.objectId)) termsByObject.set(r.objectId, []);
  termsByObject.get(r.objectId).push({ taxonomy: tax.taxonomy, name: term.name, slug: term.slug });
}

// ---- Menue ------------------------------------------------------------------
const navItems = posts
  .filter((p) => p.type === "nav_menu_item")
  .map((p) => {
    const meta = metaByPost.get(p.id) || {};
    return {
      id: p.id,
      order: p.menuOrder,
      status: p.status,
      objectType: meta._menu_item_object || "",
      objectId: num(meta._menu_item_object_id),
      url: meta._menu_item_url || "",
      title: p.title,
      parent: num(meta._menu_item_menu_item_parent),
    };
  })
  .sort((a, b) => a.order - b.order);

// ---- Content-Posts (pages + posts + discography), Attachments dranhaengen -----
const contentPosts = posts
  .filter((p) => ["page", "post", "discography"].includes(p.type))
  .map((p) => ({
    id: p.id,
    parent: p.parent,
    date: p.date,
    title: p.title,
    slug: p.name,
    type: p.type,
    status: p.status,
    excerpt: p.excerpt,
    content: p.content,
    thumbnailId: num((metaByPost.get(p.id) || {})._thumbnail_id) || null,
    terms: termsByObject.get(p.id) || [],
  }));

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "bb-content.json"), JSON.stringify(contentPosts, null, 2));
fs.writeFileSync(path.join(OUT, "bb-attachments.json"), JSON.stringify(attachments, null, 2));
fs.writeFileSync(path.join(OUT, "bb-menu.json"), JSON.stringify(navItems, null, 2));

console.log("Posts gesamt:", posts.length);
console.log("  Content (page/post/discography):", contentPosts.length);
console.log("  Attachments:", attachments.length);
console.log("  Menue-Eintraege:", navItems.length);
console.log("\nContent-Uebersicht:");
for (const p of contentPosts
  .filter((p) => p.status === "publish" || p.status === "private")
  .sort((a, b) => String(a.date).localeCompare(String(b.date)))) {
  console.log(
    `  ${String(p.date).slice(0, 10)}  ${String(p.type).padEnd(11)} ${String(p.status).padEnd(8)} #${p.id}  ${p.title}`
  );
}
