"use client";

import { useState } from "react";

export default function CondicionesEspecialesForm() {
  const [condicionesEspeciales, setCondicionesEspeciales] = useState("");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
  {/* Sección Condiciones Especiales */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <h3 className="mb-6 text-sm font-semibold text-zinc-900">
          Condiciones Especiales
        </h3>

        <textarea
          value={condicionesEspeciales}
          onChange={(e) => setCondicionesEspeciales(e.target.value)}
          placeholder="Condiciones Especiales"
          rows={20}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
