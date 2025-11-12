"use client";

import { useState } from "react";

interface Alternativa {
  id: number;
  limiteClaimsMade: string;
  limiteOcurrencia: string;
  limiteClaimsUSD: string;
  limiteOcurrenciaUSD: string;
  primaBrutaSinIVA: string;
  texto1: string;
  texto2: string;
}

export default function LimitesForm() {
  // Estados para Límite de Indemnización
  const [limiteIndemnizacion, setLimiteIndemnizacion] = useState("");
  const [trm, setTrm] = useState("");
  const [alternativasTexto, setAlternativasTexto] = useState("");

  // Estados para las alternativas
  const [alternativas, setAlternativas] = useState<Alternativa[]>([
    {
      id: 1,
      limiteClaimsMade: "",
      limiteOcurrencia: "",
      limiteClaimsUSD: "",
      limiteOcurrenciaUSD: "",
      primaBrutaSinIVA: "",
      texto1: "",
      texto2: "",
    },
  ]);
  const [removingIds, setRemovingIds] = useState<number[]>([]);

  // Agregar nueva alternativa
  const agregarAlternativa = () => {
    const nuevaAlternativa: Alternativa = {
      id: alternativas.length + 1,
      limiteClaimsMade: "",
      limiteOcurrencia: "",
      limiteClaimsUSD: "",
      limiteOcurrenciaUSD: "",
      primaBrutaSinIVA: "",
      texto1: "",
      texto2: "",
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
    setAlternativas(
      alternativas.map((alt) =>
        alt.id === id ? { ...alt, [campo]: valor } : alt
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Sección Límite de Indemnización */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <h3 className="mb-6 text-sm font-semibold text-zinc-900">
          Límite de Indemnización
        </h3>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Límite único y combinado
            </label>
            <input
              type="text"
              value={limiteIndemnizacion}
              onChange={(e) => setLimiteIndemnizacion(e.target.value)}
              placeholder="Límite único y combinado."
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-48">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              TRM (1 USD)
            </label>
            <input
              type="text"
              value={trm}
              onChange={(e) => setTrm(e.target.value)}
              placeholder="TRM"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Alternativas Texto */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Alternativas
          </label>
          <textarea
            value={alternativasTexto}
            onChange={(e) => setAlternativasTexto(e.target.value)}
            rows={2}
            placeholder="La responsabilidad máxima del Asegurador por dichos Daños y/o Gastos Legales, no excederá el límite responsabilidad establecido."
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
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">
              Alternativa {alternativa.id}
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

          {/* Campos en grid */}
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Límite Claims Made
              </label>
              <input
                type="text"
                value={alternativa.limiteClaimsMade}
                onChange={(e) =>
                  actualizarAlternativa(
                    alternativa.id,
                    "limiteClaimsMade",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Límite Ocurrencia
              </label>
              <input
                type="text"
                value={alternativa.limiteOcurrencia}
                onChange={(e) =>
                  actualizarAlternativa(
                    alternativa.id,
                    "limiteOcurrencia",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Límite Claims USD
              </label>
              <input
                type="text"
                value={alternativa.limiteClaimsUSD}
                onChange={(e) =>
                  actualizarAlternativa(
                    alternativa.id,
                    "limiteClaimsUSD",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Límite Ocurrencia USD
              </label>
              <input
                type="text"
                value={alternativa.limiteOcurrenciaUSD}
                onChange={(e) =>
                  actualizarAlternativa(
                    alternativa.id,
                    "limiteOcurrenciaUSD",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Prima Bruta sin IVA
              </label>
              <input
                type="text"
                value={alternativa.primaBrutaSinIVA}
                onChange={(e) =>
                  actualizarAlternativa(
                    alternativa.id,
                    "primaBrutaSinIVA",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Textareas */}
          <div className="space-y-4">
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
                placeholder={`Alt. ${alternativa.id} COP (VR OCURRENCIA) por evento y en el agregado anual para ocurrencia`}
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
                placeholder="pero sublimitado a COP (VR CLAIMS) para retroactividad (Claims Made)"
                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
