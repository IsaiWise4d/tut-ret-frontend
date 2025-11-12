"use client";

import { useState } from "react";

interface Condicion {
  id: number;
  texto: string;
}

export default function TerminosGeneralesForm() {
  // Placeholders para las 8 condiciones
  const placeholders = [
    "Amparo automático para nuevas operaciones con aviso no mayor a sesenta (60) días.",
    "El Asegurado declara observar las prescripciones y reglamentos exigidos para el ejercicio de esta actividad, incluyendo, pero no limitándose a lo estipulado por el Código de Ética Médica y el Código Civil.",
    "Revocación de la póliza en sesenta (60) días.",
    "Si existe(n) otro(s) seguro que aplique(n) a un reclamo cubierto bajo esta póliza, queda entendido y acordado que esta póliza será considerada como seguro de EXCESO sobre la Límite de Indemnización de la(s) otra(s) póliza(s), la(s) cual(es) deberá(n) ser considerada(s) como póliza(s) primaria(s).",
    "El Reasegurador no estará obligado a enviar Nota de Cancelación.",
    "Texto de póliza según original.",
    "Sujeto A:",
    "Entrega antes del inicio de vigencia del formulario de RC Medica, firmado por el representante legal, incluyendo, pero no limitado a la confirmación de la no existencia de situación alguna que pudiese generar un reclamo contra esta póliza en el futuro y diferentes de los ya reportados al Asegurador/Reasegurador para su evaluación, de conformidad al texto que se provee más abajo.",
  ];

  // Inicializar con 8 condiciones vacías
  const [condiciones, setCondiciones] = useState<Condicion[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      texto: "",
    }))
  );

  const actualizarCondicion = (id: number, texto: string) => {
    setCondiciones((prev) =>
      prev.map((c) => (c.id === id ? { ...c, texto } : c))
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
  {/* Sección Condiciones de Reaseguro */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <h3 className="mb-6 text-sm font-semibold text-zinc-900">
          Condiciones de Reaseguro
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
    </div>
  );
}
