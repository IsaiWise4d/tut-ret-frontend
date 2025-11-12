"use client";

import { useState } from "react";

interface Condicion {
  id: number;
  texto: string;
}

export default function CondicionesForm() {
  // Textos de placeholder para cada condición (12 condiciones fijas)
  const placeholders = [
    "Cláusula de responsabilidad individual de los reaseguradores LSW1001. Texto adjunto",
    "Anexo de exclusión de Terrorismo NMA2921. Texto adjunto.",
    "Cláusula de exclusión y limitación por sanciones LMA3100. Texto adjunto.",
    "Cláusula de Comunidad de Suerte. Texto adjunto",
    "Todas las extensiones de cobertura y coberturas forman parte del límite de indemnización y no son en adición a éste. La suma de ellas nunca superará el límite general de indemnización acordado bajo el presente contrato de reaseguro.",
    "Cobertura para el suministro, prescripción o administración de medicamentos.",
    "Cobertura para la utilización y posesión de instrumentos propios de la medicina.",
    "Cobertura para daños extra patrimoniales al 100% del límite asegurado.",
    "Cobertura de responsabilidad civil extracontractual Local, Predios y Operaciones (PLO).",
    "Cláusula de Reaseguro Completo.",
    "Cláusula de Jurisdicción Local.",
    "Cláusula Compromisoria.",
  ];

  // Estados para las 12 condiciones fijas
  const [condiciones, setCondiciones] = useState<Condicion[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      texto: "",
    }))
  );

  // Actualizar condición
  const actualizarCondicion = (id: number, texto: string) => {
    setCondiciones(
      condiciones.map((cond) => (cond.id === id ? { ...cond, texto } : cond))
    );
  };

  return (
    <div className="space-y-6">
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
