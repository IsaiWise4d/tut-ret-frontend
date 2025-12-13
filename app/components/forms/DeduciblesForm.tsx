"use client";

import { useState } from "react";

interface Alternativa {
  id: number;
  porcentajePerdida: string;
  minimoDeducible: string;
  texto1: string;
  texto2: string;
  porcentajeGastosDefensa: string;
  textoGastosDefensa: string;
}

export default function DeduciblesForm() {
  // Estado para el texto principal de Deducibles
  const [deduciblesTexto, setDeduciblesTexto] = useState("");

  // Estado para No aplica Deducible
  const [noAplicaDeducibleTexto, setNoAplicaDeducibleTexto] = useState("");

  // Estados para las alternativas
  const [alternativas, setAlternativas] = useState<Alternativa[]>([
    {
      id: 1,
      porcentajePerdida: "",
      minimoDeducible: "",
      texto1: "",
      texto2: "",
      porcentajeGastosDefensa: "",
      textoGastosDefensa: "",
    },
  ]);
  const [removingIds, setRemovingIds] = useState<number[]>([]);

  const normalizePercentInput = (rawValue: string): string | null => {
    if (!/^\d*(\.\d*)?$/.test(rawValue)) return null;
    if (rawValue === "" || rawValue === "." || rawValue.endsWith(".")) return rawValue;

    const parsed = Number(rawValue);
    if (Number.isNaN(parsed)) return null;
    const clamped = Math.min(100, Math.max(0, parsed));
    return String(clamped);
  };

  const preventInvalidNumberKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
      e.preventDefault();
    }
  };

  // Agregar nueva alternativa
  const agregarAlternativa = () => {
    const nuevaAlternativa: Alternativa = {
      id: alternativas.length + 1,
      porcentajePerdida: "",
      minimoDeducible: "",
      texto1: "",
      texto2: "",
      porcentajeGastosDefensa: "",
      textoGastosDefensa: "",
    };
    setAlternativas([...alternativas, nuevaAlternativa]);
  };

  // Eliminar alternativa
  const eliminarAlternativa = (id: number) => {
    if (alternativas.length > 1 && !removingIds.includes(id)) {
      setRemovingIds((prev) => [...prev, id]);
      setTimeout(() => {
        setAlternativas((prev) => prev.filter((alt) => alt.id !== id));
        setRemovingIds((prev) => prev.filter((i) => i !== id));
      }, 200);
    }
  };

  // Actualizar campo de alternativa
  const actualizarAlternativa = (
    id: number,
    campo: keyof Alternativa,
    valor: string
  ) => {
    if (campo === "porcentajePerdida" || campo === "porcentajeGastosDefensa") {
      const normalized = normalizePercentInput(valor);
      if (normalized === null) return;
      valor = normalized;
    }
    setAlternativas(
      alternativas.map((alt) =>
        alt.id === id ? { ...alt, [campo]: valor } : alt
      )
    );
  };

  return (
    <div className="space-y-6">
  {/* Sección Principal - Deducibles */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900">
          Deducibles
        </h3>

        <div>
          <textarea
            value={deduciblesTexto}
            onChange={(e) => setDeduciblesTexto(e.target.value)}
            rows={2}
            placeholder="Por toda y cada pérdida"
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Alternativas */}
      {alternativas.map((alternativa, index) => (
        <div
          key={alternativa.id}
          className={
            `rounded-lg border border-zinc-200 bg-white p-6 will-change-transform ${
              removingIds.includes(alternativa.id) ? 'animate-pop-out' : 'animate-pop'
            }`
          }
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">
              Deducibles - Alternativa {alternativa.id}
            </h3>
            <div className="flex gap-2">
              {index === alternativas.length - 1 && (
                <button
                  onClick={agregarAlternativa}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  + Agregar Alternativa
                </button>
              )}
              {alternativas.length > 1 && (
                <button
                  onClick={() => eliminarAlternativa(alternativa.id)}
                  className="rounded-lg border-2 border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>

          {/* Campos de porcentaje y mínimo */}
          <div className="mb-4 flex flex-wrap items-end gap-4">
            <div className="w-40">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                % sobre pérdida
              </label>
              <div className="flex items-center gap-2">
                <input
                  inputMode="decimal"
                  value={alternativa.porcentajePerdida}
                  onChange={(e) =>
                    actualizarAlternativa(
                      alternativa.id,
                      "porcentajePerdida",
                      e.target.value
                    )
                  }
                  onKeyDown={preventInvalidNumberKeys}
                  className="w-24 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-center text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-zinc-600">
                  %
                </span>
              </div>
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Con un mínimo de
              </label>
              <input
                type="text"
                value={alternativa.minimoDeducible}
                onChange={(e) =>
                  actualizarAlternativa(
                    alternativa.id,
                    "minimoDeducible",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Textareas de descripción */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Alternativa {alternativa.id}
              </label>
              <textarea
                value={alternativa.texto1}
                onChange={(e) =>
                  actualizarAlternativa(
                    alternativa.id,
                    "texto1",
                    e.target.value
                  )
                }
                rows={2}
                placeholder={`Alt ${alternativa.id}. (PORC PERD) sobre el valor de la pérdida un mínimo de COP (MINIMO), cualquiera que se sea la suma mayor que aplique.`}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <textarea
                value={alternativa.texto2}
                onChange={(e) =>
                  actualizarAlternativa(
                    alternativa.id,
                    "texto2",
                    e.target.value
                  )
                }
                rows={2}
                placeholder="Gastos médicos provenientes Local, Predios y Operaciones (PLO): Sin deducible."
                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sección % de gastos de defensa */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-4 flex flex-wrap items-end gap-4">
              <div className="w-40">
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  % de gastos de defensa
                </label>
                <div className="flex items-center gap-2">
                  <input
                    inputMode="decimal"
                    value={alternativa.porcentajeGastosDefensa}
                    onChange={(e) =>
                      actualizarAlternativa(
                        alternativa.id,
                        "porcentajeGastosDefensa",
                        e.target.value
                      )
                    }
                    onKeyDown={preventInvalidNumberKeys}
                    className="w-24 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-center text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-zinc-600">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div>
              <textarea
                value={alternativa.textoGastosDefensa}
                onChange={(e) =>
                  actualizarAlternativa(
                    alternativa.id,
                    "textoGastosDefensa",
                    e.target.value
                  )
                }
                rows={2}
                placeholder="Gastos de defensa (PORC GASTOS) de los gastos para todo y cada reclamo."
                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Sección No aplica Deducible */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900">
          No aplica Deducible
        </h3>

        <div>
          <textarea
            value={noAplicaDeducibleTexto}
            onChange={(e) => setNoAplicaDeducibleTexto(e.target.value)}
            rows={8}
            placeholder={`•    Arbitrajes.
•    Conciliaciones.
•    Transacciones extrajudiciales.
•    Gastos médicos provenientes de Local, Predios y Operaciones (PLO).
•    Beneficios Adicionales.`}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 font-mono text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
