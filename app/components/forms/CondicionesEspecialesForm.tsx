"use client";

import { useState } from "react";

export default function CondicionesEspecialesForm() {
  const [condicionesEspeciales, setCondicionesEspeciales] = useState("");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Sección Condiciones Especiales */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-6 text-sm font-semibold text-zinc-900 dark:text-white">
          Condiciones Especiales
        </h3>

        <textarea
          value={condicionesEspeciales}
          onChange={(e) => setCondicionesEspeciales(e.target.value)}
          placeholder="Condiciones Especiales"
          rows={20}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
      </div>
    </div>
  );
}
