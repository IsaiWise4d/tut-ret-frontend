"use client";

import { useState } from "react";
import CotizacionForm from "../components/forms/CotizacionForm";
import CoberturaForm from "../components/forms/CoberturaForm";
import CoberturasAdicionalesForm from "../components/forms/CoberturasAdicionalesForm";
import VigenciaForm from "../components/forms/VigenciaForm";
import LimitesForm from "../components/forms/LimitesForm";
import DeduciblesForm from "../components/forms/DeduciblesForm";
import ImpuestosForm from "../components/forms/ImpuestosForm";
import CondicionesForm from "../components/forms/CondicionesForm";
import CondicionesEspecialesForm from "../components/forms/CondicionesEspecialesForm";
import TerminosGeneralesForm from "../components/forms/TerminosGeneralesForm";
import TerminosEspecificosForm from "../components/forms/TerminosEspecificosForm";
import ClausulasForm from "../components/forms/ClausulasForm";

type Tab = 
  | "cotizacion"
  | "cobertura"
  | "coberturas-adicionales"
  | "vigencia"
  | "limites"
  | "deducibles"
  | "impuestos"
  | "condiciones"
  | "condiciones-especiales"
  | "terminos-generales"
  | "terminos-especificos"
  | "clausulas";

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("cotizacion");

  const tabs: { id: Tab; label: string }[] = [
    { id: "cotizacion", label: "Cotización" },
    { id: "cobertura", label: "Cobertura" },
    { id: "coberturas-adicionales", label: "Coberturas Adicionales" },
    { id: "vigencia", label: "Vigencia" },
    { id: "limites", label: "Límites" },
    { id: "deducibles", label: "Deducibles" },
    { id: "impuestos", label: "Impuestos" },
    { id: "condiciones", label: "Condiciones" },
    { id: "condiciones-especiales", label: "Condiciones Especiales" },
    { id: "terminos-generales", label: "Términos Generales" },
    { id: "terminos-especificos", label: "Términos Específicos" },
    { id: "clausulas", label: "Cláusulas" },
  ];

  const handleSave = () => {
    console.log("Guardando formulario...");
    // Lógica para guardar
  };

  const handleCancel = () => {
    console.log("Cancelando...");
    // Lógica para cancelar
  };

  const handleGenerateSplit = () => {
    console.log("Generando Split...");
    // Lógica para generar split
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">
            Split de Reaseguro
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Complete los datos del formulario en cada pestaña
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="flex w-full rounded-lg border border-zinc-200 bg-white">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 px-2 py-3 text-xs font-medium transition-all lg:text-sm
                    ${index !== 0 ? "border-l border-zinc-200" : ""}
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }
                  ${index === 0 ? "rounded-l-lg" : ""}
                  ${index === tabs.length - 1 ? "rounded-r-lg" : ""}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content Area */}
      <div className="mb-6">
          {activeTab === "cotizacion" && <CotizacionForm />}
          {activeTab === "cobertura" && <CoberturaForm />}
          {activeTab === "coberturas-adicionales" && <CoberturasAdicionalesForm />}
          {activeTab === "vigencia" && <VigenciaForm />}
          {activeTab === "limites" && <LimitesForm />}
          {activeTab === "deducibles" && <DeduciblesForm />}
          {activeTab === "impuestos" && <ImpuestosForm />}
          {activeTab === "condiciones" && <CondicionesForm />}
          {activeTab === "condiciones-especiales" && <CondicionesEspecialesForm />}
          {activeTab === "terminos-generales" && <TerminosGeneralesForm />}
          {activeTab === "terminos-especificos" && <TerminosEspecificosForm />}
          {activeTab === "clausulas" && <ClausulasForm />}
          {activeTab !== "cotizacion" && activeTab !== "cobertura" && activeTab !== "coberturas-adicionales" && activeTab !== "vigencia" && activeTab !== "limites" && activeTab !== "deducibles" && activeTab !== "impuestos" && activeTab !== "condiciones" && activeTab !== "condiciones-especiales" && activeTab !== "terminos-generales" && activeTab !== "terminos-especificos" && activeTab !== "clausulas" && (
      <div className="min-h-[500px] rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
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
                  <h3 className="mb-2 text-lg font-semibold text-zinc-900">
                    Formulario: {tabs.find((t) => t.id === activeTab)?.label}
                  </h3>
                  <p className="text-sm text-zinc-600">
                    El contenido de este formulario se cargará aquí
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
          {/* Botón Guardar */}
          <button
            onClick={handleSave}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg border-2 border-blue-600 bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Guardar
          </button>

          {/* Botón Cancelar */}
          <button
            onClick={handleCancel}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all duration-300 hover:border-zinc-400 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
          >
            <svg
              className="mr-2 h-5 w-5"
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
            Cancelar
          </button>

          {/* Botón Generar Split */}
          <button
            onClick={handleGenerateSplit}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/70 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <svg
              className="mr-2 h-5 w-5"
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
            Generar Split
            <svg
              className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
