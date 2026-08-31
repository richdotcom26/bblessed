"use client";

import { useEffect, useState } from "react";

// Die Adresse wird erst im Browser zusammengesetzt. Im ausgelieferten HTML
// steht nur "kontakt [ät] bblessed.de" – das lesen Menschen problemlos, aber
// die üblichen Spam-Harvester (die nach "…@….…" suchen) greifen ins Leere.
// Die vollständige, klar lesbare Adresse steht zusätzlich im Impressum.
const USER = "kontakt";
const DOMAIN = "bblessed.de";

export function EmailLink({ className = "" }: { className?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) {
    return (
      <span className={className}>
        {USER}&#8202;[ät]&#8202;{DOMAIN}
      </span>
    );
  }
  const addr = `${USER}@${DOMAIN}`;
  return (
    <a href={`mailto:${addr}`} className={className}>
      {addr}
    </a>
  );
}
