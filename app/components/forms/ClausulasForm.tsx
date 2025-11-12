"use client";

import { useState } from "react";

interface Clausula {
  id: number;
  texto: string;
}

export default function ClausulasForm() {
  // Placeholders para las primeras 8 cláusulas
  const placeholders = [
    "Definición de Siniestro.",
    "Definición de Reclamo.",
    "Peticiones Extrajudiciales.",
    "Pluralidad de Reclamos.",
    "Gastos de defensa: Honorarios de Abogados y Gastos Judiciales: Hasta COP 25.000.000 por evento y COP 100.000.000 por vigencia",
    "Transacción.",
    "Designación de Representación Legal",
    "Según póliza original.",
  ];

  // Inicializar con 8 cláusulas vacías
  const [clausulas, setClausulas] = useState<Clausula[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      texto: "",
    }))
  );

  const [dropdown, setDropdown] = useState("");
  const [removingIds, setRemovingIds] = useState<number[]>([]);

  const actualizarClausula = (id: number, texto: string) => {
    setClausulas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, texto } : c))
    );
  };

  const agregarClausula = () => {
    const nuevoId = Math.max(...clausulas.map((c) => c.id), 0) + 1;
    setClausulas([...clausulas, { id: nuevoId, texto: "" }]);
  };

  const eliminarClausula = (id: number) => {
    if (clausulas.length > 1 && !removingIds.includes(id)) {
      setRemovingIds((prev) => [...prev, id]);
      setTimeout(() => {
        setClausulas((prev) => prev.filter((c) => c.id !== id));
        setRemovingIds((prev) => prev.filter((i) => i !== id));
      }, 200);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Sección Cláusulas de Reaseguro */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">
            Cláusulas
          </h3>
          <button
            onClick={agregarClausula}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Agregar Cláusula
          </button>
        </div>

        <div className="space-y-4">
          {/* Cláusulas numeradas */}
          {clausulas.map((clausula, index) => (
            <div
              key={clausula.id}
              className={
                `flex items-start gap-4 will-change-transform ${
                  removingIds.includes(clausula.id) ? 'animate-pop-out' : 'animate-pop'
                }`
              }
            >
              {/* Número */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 text-sm font-semibold text-blue-600">
                {index + 1}.
              </div>

              {/* Input de texto */}
              <div className="flex-1">
                <input
                  type="text"
                  value={clausula.texto}
                  onChange={(e) =>
                    actualizarClausula(clausula.id, e.target.value)
                  }
                  placeholder={placeholders[index] || "Ingrese la cláusula"}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Botón Eliminar */}
              {clausulas.length > 1 && (
                <button
                  onClick={() => eliminarClausula(clausula.id)}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 border-red-500 text-red-500 transition-all hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  title="Eliminar cláusula"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {/* Dropdown */}
          <div className="mt-4">
            <select
              value={dropdown}
              onChange={(e) => setDropdown(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value=""></option>
              <option value="opcion1">Opción 1</option>
              <option value="opcion2">Opción 2</option>
              <option value="opcion3">Opción 3</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
