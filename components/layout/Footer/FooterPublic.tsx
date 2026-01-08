"use client";

import { useMemo } from "react";

export function FooterPublic() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>
        Copyright © {year}{" "}
        <a
          href="https://www.diegozambrana.com"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Diego Zambrana
        </a>
      </p>
    </footer>
  );
}
