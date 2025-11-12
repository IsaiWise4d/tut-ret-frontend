"use client";

import { useState } from "react";

interface Condicion {
  id: number;
  texto: string;
}

export default function TerminosEspecificosForm() {
  // Placeholders para las 8 condiciones específicas
  const placeholders = [
    "Cláusula de Cooperación de Reclamos.",
    "Renovación de Pólizas 60 días.",
    "Definición de Siniestro.",
    "Definición de Reclamo.",
    "Peticiones Extrajudiciales.",
    "Pluralidad de Reclamos.",
    "Gastos de defensa: Honorarios de Abogados y Gastos Judiciales: Hasta COP 25.000.000 por evento y COP 100.000.000 por vigencia",
    "Transacción.",
  ];

  // Inicializar con 8 condiciones vacías
  const [condiciones, setCondiciones] = useState<Condicion[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      texto: "",
    }))
  );

  const [exclusiones, setExclusiones] = useState("");

  const actualizarCondicion = (id: number, texto: string) => {
    setCondiciones((prev) =>
      prev.map((c) => (c.id === id ? { ...c, texto } : c))
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
  {/* Sección Términos y Condiciones Específicas */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <h3 className="mb-6 text-sm font-semibold text-zinc-900">
          Términos y Condiciones Específicas
        </h3>

        <div className="space-y-4">
          {condiciones.map((condicion, index) => (
            <div key={condicion.id} className="flex items-start gap-4">
              {/* Número */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 text-sm font-semibold text-blue-600">
                {index + 1}.
              </div>

              {/* Input de texto */}
              <div className="flex-1">
                <input
                  type="text"
                  value={condicion.texto}
                  onChange={(e) =>
                    actualizarCondicion(condicion.id, e.target.value)
                  }
                  placeholder={placeholders[index]}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

  {/* Sección Exclusiones */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <h3 className="mb-6 text-sm font-semibold text-zinc-900">
          Exclusiones
        </h3>

        <input
          type="text"
          value={exclusiones}
          onChange={(e) => setExclusiones(e.target.value)}
          placeholder="Según póliza original."
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
