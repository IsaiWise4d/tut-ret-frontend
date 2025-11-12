"use client";

import { useState } from "react";

interface Reasegurador {
  id: number;
  nombre: string;
  nit: string;
  porcentaje: string;
}

interface ReaseguradoItem {
  id: number;
  nombre: string;
  nit: string;
  porcentaje: string;
}

export default function CotizacionForm() {
  const [formData, setFormData] = useState({
    correo: "",
    cotizacion: "",
    negocio: "",
    estado: "COTIZACIÓN",
    tipo: "",
    brokerReaseguro: "",
    brokerNit: "",
  });

  const [reaseguradores, setReaseguradores] = useState<Reasegurador[]>([
    { id: 1, nombre: "", nit: "", porcentaje: "" },
  ]);

  const [reasegurados, setReasegurados] = useState<ReaseguradoItem[]>([
    { id: 1, nombre: "", nit: "", porcentaje: "" },
  ]);

  // IDs en proceso de eliminación (para animación)
  const [removingReaseguradores, setRemovingReaseguradores] = useState<number[]>([]);
  const [removingReasegurados, setRemovingReasegurados] = useState<number[]>([]);

  const [coverholder, setCoverholder] = useState("");
  const [asegurado, setAsegurado] = useState("");
  const [aseguradoNit, setAseguradoNit] = useState("");
  const [totalReaseguradores, setTotalReaseguradores] = useState("");
  const [nroReaseguradores, setNroReaseguradores] = useState("");
  const [totalReasegurados, setTotalReasegurados] = useState("");
  const [nroReasegurados, setNroReasegurados] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addReasegurador = () => {
    setReaseguradores([
      ...reaseguradores,
      { id: reaseguradores.length + 1, nombre: "", nit: "", porcentaje: "" },
    ]);
  };

  const removeReasegurador = (id: number) => {
    if (reaseguradores.length > 1) {
      // marcar como en eliminación para aplicar la animación
      setRemovingReaseguradores((prev) => [...prev, id]);
      // esperar al final de la animación antes de eliminar del estado
      setTimeout(() => {
        setReaseguradores((prev) => prev.filter((r) => r.id !== id));
        setRemovingReaseguradores((prev) => prev.filter((v) => v !== id));
      }, 200);
    }
  };

  const updateReasegurador = (id: number, field: keyof Reasegurador, value: string) => {
    setReaseguradores(
      reaseguradores.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const addReasegurado = () => {
    setReasegurados([
      ...reasegurados,
      { id: reasegurados.length + 1, nombre: "", nit: "", porcentaje: "" },
    ]);
  };

  const removeReasegurado = (id: number) => {
    if (reasegurados.length > 1) {
      // marcar como en eliminación para aplicar la animación
      setRemovingReasegurados((prev) => [...prev, id]);
      setTimeout(() => {
        setReasegurados((prev) => prev.filter((r) => r.id !== id));
        setRemovingReasegurados((prev) => prev.filter((v) => v !== id));
      }, 200);
    }
  };

  const updateReasegurado = (id: number, field: keyof ReaseguradoItem, value: string) => {
    setReasegurados(
      reasegurados.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Información Principal */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Correo */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              Correo
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              placeholder="megavas@invise4d.co"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cotización */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              Cotización
            </label>
            <input
              type="text"
              name="cotizacion"
              value={formData.cotizacion}
              onChange={handleInputChange}
              placeholder="2025_0008"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Negocio */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              Negocio
            </label>
            <input
              type="text"
              name="negocio"
              value={formData.negocio}
              onChange={handleInputChange}
              placeholder="Prueba1"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="COTIZACIÓN">COTIZACIÓN</option>
              <option value="APROBADO">APROBADO</option>
              <option value="RECHAZADO">RECHAZADO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tipo */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <label className="mb-2 block text-sm font-semibold text-zinc-700">
          Tipo
        </label>
        <textarea
          name="tipo"
          value={formData.tipo}
          onChange={handleInputChange}
          rows={3}
          placeholder="Reaseguro Facultativo de Responsabilidad Civil Profesional Médica, en forma Proporcional, cubriendo las actividades del asegurado como propietario y operador de las instituciones médicas nombradas como asegurados."
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Broker */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900">
          Broker
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Broker de Reaseguro
            </label>
            <select
              name="brokerReaseguro"
              value={formData.brokerReaseguro}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione...</option>
              <option value="broker1">Broker 1</option>
              <option value="broker2">Broker 2</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Nit
            </label>
            <input
              type="text"
              name="brokerNit"
              value={formData.brokerNit}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

  {/* Reasegurador */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">
            Reasegurador
          </h3>
          <button
            type="button"
            onClick={addReasegurador}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
            Añadir Reasegurador
          </button>
        </div>

        <div className="space-y-4">
          {reaseguradores.map((reasegurador, index) => (
            <div
              key={reasegurador.id}
              className={
                `grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 p-4 md:grid-cols-12 will-change-transform ${
                  removingReaseguradores.includes(reasegurador.id) ? "animate-pop-out" : "animate-pop"
                }`
              }
            >
              <div className="md:col-span-1">
                <label className="mb-2 block text-xs font-medium text-zinc-700">
                  #
                </label>
                <input
                  type="text"
                  value={index + 1}
                  disabled
                  className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900"
                />
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-xs font-medium text-zinc-700">
                  Nombre
                </label>
                <select
                  value={reasegurador.nombre}
                  onChange={(e) => updateReasegurador(reasegurador.id, "nombre", e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione...</option>
                  <option value="reasegurador1">Reasegurador 1</option>
                  <option value="reasegurador2">Reasegurador 2</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="mb-2 block text-xs font-medium text-zinc-700">
                  Nit
                </label>
                <input
                  type="text"
                  value={reasegurador.nit}
                  onChange={(e) => updateReasegurador(reasegurador.id, "nit", e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-medium text-zinc-700">
                  %
                </label>
                <input
                  type="text"
                  value={reasegurador.porcentaje}
                  onChange={(e) => updateReasegurador(reasegurador.id, "porcentaje", e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end md:col-span-2">
                <button
                  type="button"
                  onClick={() => removeReasegurador(reasegurador.id)}
                  disabled={reaseguradores.length === 1}
                  className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Total %
            </label>
            <input
              type="text"
              value={totalReaseguradores}
              onChange={(e) => setTotalReaseguradores(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Nro Reaseguradores
            </label>
            <input
              type="text"
              value={nroReaseguradores}
              onChange={(e) => setNroReaseguradores(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Coverholder */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Coverholder
        </label>
        <input
          type="text"
          value={coverholder}
          onChange={(e) => setCoverholder(e.target.value)}
          placeholder="The Underwriting Team"
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

  {/* Reasegurado */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">
            Reasegurado
          </h3>
          <button
            type="button"
            onClick={addReasegurado}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
            Añadir Reasegurado
          </button>
        </div>

        <div className="space-y-4">
          {reasegurados.map((reasegurado, index) => (
            <div
              key={reasegurado.id}
              className={
                `grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 p-4 md:grid-cols-12 will-change-transform ${
                  removingReasegurados.includes(reasegurado.id) ? "animate-pop-out" : "animate-pop"
                }`
              }
            >
              <div className="md:col-span-1">
                <label className="mb-2 block text-xs font-medium text-zinc-700">
                  #
                </label>
                <input
                  type="text"
                  value={index + 1}
                  disabled
                  className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900"
                />
              </div>
              <div className="md:col-span-4">
                <label className="mb-2 block text-xs font-medium text-zinc-700">
                  Nombre
                </label>
                <select
                  value={reasegurado.nombre}
                  onChange={(e) => updateReasegurado(reasegurado.id, "nombre", e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione...</option>
                  <option value="reasegurado1">Reasegurado 1</option>
                  <option value="reasegurado2">Reasegurado 2</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="mb-2 block text-xs font-medium text-zinc-700">
                  Nit
                </label>
                <input
                  type="text"
                  value={reasegurado.nit}
                  onChange={(e) => updateReasegurado(reasegurado.id, "nit", e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-medium text-zinc-700">
                  %
                </label>
                <input
                  type="text"
                  value={reasegurado.porcentaje}
                  onChange={(e) => updateReasegurado(reasegurado.id, "porcentaje", e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end md:col-span-2">
                <button
                  type="button"
                  onClick={() => removeReasegurado(reasegurado.id)}
                  disabled={reasegurados.length === 1}
                  className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Total %
            </label>
            <input
              type="text"
              value={totalReasegurados}
              onChange={(e) => setTotalReasegurados(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Nro Reasegurados
            </label>
            <input
              type="text"
              value={nroReasegurados}
              onChange={(e) => setNroReasegurados(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

  {/* Asegurado */}
  <div className="rounded-lg border border-zinc-200 bg-white p-6 animate-fade-up will-change-transform">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900">
          Asegurado
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Asegurado
            </label>
            <select
              value={asegurado}
              onChange={(e) => setAsegurado(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione...</option>
              <option value="asegurado1">Asegurado 1</option>
              <option value="asegurado2">Asegurado 2</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Nit
            </label>
            <input
              type="text"
              value={aseguradoNit}
              onChange={(e) => setAseguradoNit(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <button
            type="button"
            className="rounded-lg border-2 border-blue-600 bg-white px-6 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Crear Asegurado...
          </button>
          <button
            type="button"
            className="rounded-lg border-2 border-blue-600 bg-white px-6 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Riesgos del Asegurado...
          </button>
        </div>
      </div>
    </div>
  );
}
