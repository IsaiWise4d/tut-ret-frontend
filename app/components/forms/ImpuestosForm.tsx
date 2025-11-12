"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";

interface FechaPactada {
  id: number;
  fecha: Date | null;
}

export default function ImpuestosForm() {
  // Estado para Impuestos a pagar
  const [impuestosTexto, setImpuestosTexto] = useState("");

  // Estados para Respaldo de Reaseguro
  const [retencionCedente, setRetencionCedente] = useState("");
  const [respaldoReaseguro, setRespaldoReaseguro] = useState("");

  // Estados para Intermediario de Seguro
  const [intermediario, setIntermediario] = useState("");
  const [intermediarioNit, setIntermediarioNit] = useState("");

  // Estados para Fechas Pactadas (comienza con 1 fila)
  const [fechasPactadas, setFechasPactadas] = useState<FechaPactada[]>([
    {
      id: 1,
      fecha: null,
    },
  ]);
  const [removingIds, setRemovingIds] = useState<number[]>([]);

  // Estados para Garantía de Pago
  const [garantiaPagoTexto1, setGarantiaPagoTexto1] = useState("");
  const [garantiaPagoTexto2, setGarantiaPagoTexto2] = useState("");
  const [garantiaPagoTexto3, setGarantiaPagoTexto3] = useState("");
  const [garantiaPagoTexto4, setGarantiaPagoTexto4] = useState("");

  // Actualizar fecha pactada
  const actualizarFechaPactada = (id: number, fecha: Date | null) => {
    setFechasPactadas(
      fechasPactadas.map((f) => (f.id === id ? { ...f, fecha: fecha } : f))
    );
  };

  // Agregar nueva fecha pactada
  const agregarFechaPactada = () => {
    const nuevaFecha: FechaPactada = {
      id: fechasPactadas.length + 1,
      fecha: null,
    };
    setFechasPactadas([...fechasPactadas, nuevaFecha]);
  };

  // Eliminar fecha pactada
  const eliminarFechaPactada = (id: number) => {
    if (fechasPactadas.length > 1 && !removingIds.includes(id)) {
      setRemovingIds((prev) => [...prev, id]);
      setTimeout(() => {
        setFechasPactadas((prev) => prev.filter((f) => f.id !== id));
        setRemovingIds((prev) => prev.filter((i) => i !== id));
      }, 200);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sección Impuestos a Pagar por Reaseguradores */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900">
          Impuestos a Pagar por Reaseguradores
        </h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Impuestos a pagar
          </label>
          <textarea
            value={impuestosTexto}
            onChange={(e) => setImpuestosTexto(e.target.value)}
            rows={6}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid con dos secciones */}
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-up will-change-transform">
        {/* Sección Respaldo de Reaseguro */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-zinc-900">
            Respaldo de Reaseguro
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Retención Cedente
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={retencionCedente}
                  onChange={(e) => setRetencionCedente(e.target.value)}
                  className="w-32 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-center text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-zinc-600">
                  p/d 100%
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Respaldo Reaseguro
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={respaldoReaseguro}
                  onChange={(e) => setRespaldoReaseguro(e.target.value)}
                  className="w-32 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-center text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-zinc-600">
                  p/d 100%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Intermediario de Seguro */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-zinc-900">
            Intermediario de Seguro
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Intermediario
              </label>
              <select
                value={intermediario}
                onChange={(e) => setIntermediario(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar intermediario</option>
                <option value="intermediario1">Intermediario 1</option>
                <option value="intermediario2">Intermediario 2</option>
                <option value="intermediario3">Intermediario 3</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Nit
              </label>
              <input
                type="text"
                value={intermediarioNit}
                onChange={(e) => setIntermediarioNit(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección Fechas Pactadas */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">
            Fechas Pactadas
          </h3>
          <button
            onClick={agregarFechaPactada}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Agregar Fecha
          </button>
        </div>

        <div className="space-y-3">
          {/* Filas de fechas */}
          {fechasPactadas.map((fecha, index) => (
            <div
              key={fecha.id}
              className={
                `flex items-center gap-4 will-change-transform ${
                  removingIds.includes(fecha.id) ? 'animate-pop-out' : 'animate-pop'
                }`
              }
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 text-sm font-semibold text-blue-600">
                {index + 1}
              </div>

              <div className="datepicker-wrapper relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <DatePicker
                  selected={fecha.fecha}
                  onChange={(date) => actualizarFechaPactada(fecha.id, date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Seleccionar fecha pactada"
                  className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  wrapperClassName="w-full"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>

              {fechasPactadas.length > 1 && (
                <button
                  onClick={() => eliminarFechaPactada(fecha.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-red-500 text-red-500 transition-all hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  title="Eliminar fecha"
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
        </div>
      </div>

      {/* Sección Garantía de Pago de Prima por Póliza */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900">
          Garantía de Pago de Prima por Póliza
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              (a)
            </label>
            <textarea
              value={garantiaPagoTexto1}
              onChange={(e) => setGarantiaPagoTexto1(e.target.value)}
              rows={2}
              placeholder="(a) Las primas serán pagaderas a más tardar dentro de los 90 días consecutivos al inicio de la vigencia por póliza."
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              (b)
            </label>
            <textarea
              value={garantiaPagoTexto2}
              onChange={(e) => setGarantiaPagoTexto2(e.target.value)}
              rows={2}
              placeholder="(b)    La falta de cumplimiento con esta condición causará la cancelación automática de este respaldo al inicio de su vigencia."
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              (c)
            </label>
            <textarea
              value={garantiaPagoTexto3}
              onChange={(e) => setGarantiaPagoTexto3(e.target.value)}
              rows={2}
              placeholder="(c)    El Reasegurador no estará obligado a enviar Nota de Cancelación por el no pago de la prima."
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <textarea
              value={garantiaPagoTexto4}
              onChange={(e) => setGarantiaPagoTexto4(e.target.value)}
              rows={3}
              placeholder="La garantía de pago debe cumplirse en tiempo y forma independientemente de la oportunidad en la entrega de la documentación al Reasegurado."
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
