"use client";

import { useState } from "react";

export default function CoberturaForm() {
  const [coberturaTitulo, setCoberturaTitulo] = useState("");
  const [coberturaTexto, setCoberturaTexto] = useState("");
  const [clausuladoAplicable, setClausuladoAplicable] = useState("");

  const [anos, setAnos] = useState(0);
  const [actosPrevios, setActosPrevios] = useState("");

  const incrementarAnos = () => {
    setAnos((prev) => prev + 1);
  };

  const decrementarAnos = () => {
    setAnos((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const [baseType, setBaseType] = useState<"claims-made" | "ocurrencia" | "hibrida">("claims-made");
  const [claimsMadeTexto, setClaimsMadeTexto] = useState("");
  const [ocurrenciaTexto, setOcurrenciaTexto] = useState("");
  const [notasTexto, setNotasTexto] = useState("");

  const [retroactividadClaimsTexto, setRetroactividadClaimsTexto] = useState("");
  const [retroactividadOcurrenciaTexto, setRetroactividadOcurrenciaTexto] = useState("");

  return (
    <div className="space-y-6">
      {/* Cobertura */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-white">
          Cobertura
        </label>
        <input
          type="text"
          value={coberturaTitulo}
          onChange={(e) => setCoberturaTitulo(e.target.value)}
          placeholder="COBERTURA DE RESPONSABILIDAD CIVIL PARA INSTITUCIONES MÉDICAS"
          className="mb-4 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium uppercase text-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
        />
        <textarea
          value={coberturaTexto}
          onChange={(e) => setCoberturaTexto(e.target.value)}
          rows={8}
          placeholder="Por la presente el asegurador indemnizará en exceso del deducible y hasta el límite de Responsabilidad, los daños y/o gastos legales a cargo del asegurado..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
      </div>

      {/* Clausulado Aplicable */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-white">
          Clausulado Aplicable
        </label>
        <input
          type="text"
          value={clausuladoAplicable}
          onChange={(e) => setClausuladoAplicable(e.target.value)}
          placeholder="Según texto póliza original."
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
      </div>

      {/* Base de la cobertura */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
          Base de la cobertura
        </h3>

        {/* Primera fila: Años y Radio buttons */}
        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Años */}
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Años
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={anos}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setAnos(val >= 0 ? val : 0);
                }}
                min="0"
                className="w-16 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={incrementarAnos}
                  className="rounded-t border border-zinc-300 bg-white px-1.5 py-0.5 text-xs leading-none hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={decrementarAnos}
                  className="rounded-b border border-t-0 border-zinc-300 bg-white px-1.5 py-0.5 text-xs leading-none hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          {/* Radio buttons horizontales */}
          <div className="flex items-end gap-6 lg:col-span-7">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="claims-made"
                name="baseType"
                checked={baseType === "claims-made"}
                onChange={() => setBaseType("claims-made")}
                className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="claims-made"
                className="text-sm font-medium text-zinc-900 dark:text-white"
              >
                Claims Made
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="ocurrencia"
                name="baseType"
                checked={baseType === "ocurrencia"}
                onChange={() => setBaseType("ocurrencia")}
                className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="ocurrencia"
                className="text-sm font-medium text-zinc-900 dark:text-white"
              >
                Ocurrencia
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="hibrida"
                name="baseType"
                checked={baseType === "hibrida"}
                onChange={() => setBaseType("hibrida")}
                className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="hibrida"
                className="text-sm font-medium text-zinc-900 dark:text-white"
              >
                Híbrida
              </label>
            </div>
          </div>

          {/* Notas label */}
          <div className="lg:col-span-3">
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Notas
            </label>
          </div>
        </div>

        {/* Segunda fila: Textareas principales */}
        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Base Cobertura - Solo label */}
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Base Cobertura
            </label>
          </div>

          {/* Claims Made / Ocurrencia texto */}
          <div className="lg:col-span-7">
            <textarea
              value={baseType === "claims-made" ? claimsMadeTexto : ocurrenciaTexto}
              onChange={(e) => {
                if (baseType === "claims-made") {
                  setClaimsMadeTexto(e.target.value);
                } else {
                  setOcurrenciaTexto(e.target.value);
                }
              }}
              rows={4}
              placeholder={
                baseType === "claims-made"
                  ? "Siniestros ocurridos dentro de la vigencia del presente contrato de reaseguro o dentro de su periodo de retroactividad acordado..."
                  : "Ocurrencia: Siniestros ocurridos dentro de la vigencia de póliza y reclamados dentro del período de prescripción..."
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Notas */}
          <div className="lg:col-span-3">
            <textarea
              value={notasTexto}
              onChange={(e) => setNotasTexto(e.target.value)}
              rows={4}
              placeholder="La totalidad de las reclamaciones derivadas de siniestros que tengan la misma causa será considerada como un solo siniestro..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>

        {/* Tercera fila: Actos Previos */}
        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Actos Previos
            </label>
          </div>
        </div>
        <div className="mb-4">
          <textarea
            value={actosPrevios}
            onChange={(e) => setActosPrevios(e.target.value)}
            rows={3}
            placeholder="Esta cobertura incluye la responsabilidad civil imputable al asegurado como consecuencia de las acciones y omisiones profesionales..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {/* Cuarta fila: Retroactividad */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Retroactividad Claims
            </label>
            <textarea
              value={retroactividadClaimsTexto}
              onChange={(e) => setRetroactividadClaimsTexto(e.target.value)}
              rows={8}
              placeholder="Claims Made: hasta (N) años con anterioridad a la fecha de inicio de vigencia a ser acordada para esta cobertura..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Retroactividad Ocurrencia
            </label>
            <textarea
              value={retroactividadOcurrenciaTexto}
              onChange={(e) => setRetroactividadOcurrenciaTexto(e.target.value)}
              rows={8}
              placeholder="Ocurrencia: Siniestros ocurridos dentro de la vigencia de póliza y reclamados dentro del período de prescripción..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
