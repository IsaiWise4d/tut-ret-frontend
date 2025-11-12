"use client";

import { useState } from "react";

interface CoberturaAdicional {
  id: number;
  texto: string;
  checked: boolean;
}

export default function CoberturasAdicionalesForm() {
  const [removingIds, setRemovingIds] = useState<number[]>([]);
  const [coberturas, setCoberturas] = useState<CoberturaAdicional[]>([
    {
      id: 1,
      texto: "Cobertura para cirugías reconstructivas.",
      checked: false,
    },
    {
      id: 2,
      texto: "Cobertura para el suministro, prescripción o administración de medicamentos.",
      checked: false,
    },
    {
      id: 3,
      texto: "Cobertura para la utilización y posesión de instrumentos propios de la medicina.",
      checked: false,
    },
    {
      id: 4,
      texto: "Cobertura para daños extra patrimoniales.",
      checked: false,
    },
    {
      id: 5,
      texto: "Cobertura Gastos de defensa: hasta el 10% del límite contratado y COP 25.000.000 por evento.",
      checked: false,
    },
  ]);

  const handleCheckboxChange = (id: number) => {
    setCoberturas(
      coberturas.map((cobertura) =>
        cobertura.id === id
          ? { ...cobertura, checked: !cobertura.checked }
          : cobertura
      )
    );
  };

  const handleTextoChange = (id: number, nuevoTexto: string) => {
    setCoberturas(
      coberturas.map((cobertura) =>
        cobertura.id === id ? { ...cobertura, texto: nuevoTexto } : cobertura
      )
    );
  };

  const agregarCobertura = () => {
    const nuevoId = Math.max(...coberturas.map((c) => c.id), 0) + 1;
    setCoberturas([
      ...coberturas,
      {
        id: nuevoId,
        texto: "",
        checked: false,
      },
    ]);
  };

  const eliminarCobertura = (id: number) => {
    if (coberturas.length > 1 && !removingIds.includes(id)) {
      setRemovingIds((prev) => [...prev, id]);
      setTimeout(() => {
        setCoberturas((prev) => prev.filter((c) => c.id !== id));
        setRemovingIds((prev) => prev.filter((i) => i !== id));
      }, 200);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">
            Coberturas Adicionales
          </h3>
          <button
            type="button"
            onClick={agregarCobertura}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Añadir Cobertura
          </button>
        </div>

        <div className="space-y-3">
          {coberturas.map((cobertura) => (
            <div
              key={cobertura.id}
              className={
                `group flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm will-change-transform ${
                  removingIds.includes(cobertura.id) ? 'animate-pop-out' : 'animate-pop'
                }`
              }
            >
              <input
                type="checkbox"
                id={`cobertura-${cobertura.id}`}
                checked={cobertura.checked}
                onChange={() => handleCheckboxChange(cobertura.id)}
                className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-zinc-300 text-blue-600 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={cobertura.texto}
                  onChange={(e) =>
                    handleTextoChange(cobertura.id, e.target.value)
                  }
                  placeholder="Descripción de la cobertura adicional..."
                  className="w-full border-0 bg-transparent px-0 py-0 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0"
                />
              </div>
              {coberturas.length > 1 && (
                <button
                  type="button"
                  onClick={() => eliminarCobertura(cobertura.id)}
                  className="flex-shrink-0 rounded-lg p-1.5 text-zinc-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  title="Eliminar cobertura"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {coberturas.length === 0 && (
            <div className="py-12 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-purple-50">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-zinc-500">
              No hay coberturas adicionales. Haz clic en &quot;Añadir Cobertura&quot; para comenzar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
