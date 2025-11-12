"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";

export default function VigenciaForm() {
  // Obtener fecha actual del sistema
  const fechaActual = new Date();
  const fechaActualConHora = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), 12, 0);
  
  // Calcular fecha un año después
  const fechaUnAnoDespues = new Date(fechaActual);
  fechaUnAnoDespues.setFullYear(fechaUnAnoDespues.getFullYear() + 1);
  const fechaUnAnoDespuesConHora = new Date(fechaUnAnoDespues.getFullYear(), fechaUnAnoDespues.getMonth(), fechaUnAnoDespues.getDate(), 12, 0);

  // Estados para Vigencia - Usando Date objects para react-datepicker con hora
  const [desdeDate, setDesdeDate] = useState<Date | null>(fechaActualConHora);
  const [desdeTime, setDesdeTime] = useState<Date | null>(fechaActualConHora);
  
  const [hastaDate, setHastaDate] = useState<Date | null>(fechaUnAnoDespuesConHora);
  const [hastaTime, setHastaTime] = useState<Date | null>(fechaUnAnoDespuesConHora);
  
  const [dias, setDias] = useState("365");
  const [vigenciaTexto, setVigenciaTexto] = useState("Renovable automáticamente 60 días antes de vencimiento.");

  // Función para calcular días entre dos fechas
  const calcularDiasEntreFechas = (desde: Date, hasta: Date): number => {
    const diffTime = Math.abs(hasta.getTime() - desde.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para agregar días a una fecha
  const agregarDias = (fecha: Date, dias: number): Date => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    return nuevaFecha;
  };

  // Handler para cuando cambia la fecha Desde
  const handleDesdeChange = (date: Date | null) => {
    setDesdeDate(date);
    
    // Si hay fecha Hasta, recalcular días
    if (date && hastaDate) {
      if (date <= hastaDate) {
        const nuevosDias = calcularDiasEntreFechas(date, hastaDate);
        setDias(nuevosDias.toString());
      } else {
        // Si Desde es mayor que Hasta, limpiar Hasta y días
        setHastaDate(null);
        setDias("");
      }
    }
  };

  // Handler para cuando cambia la fecha Hasta
  const handleHastaChange = (date: Date | null) => {
    setHastaDate(date);
    
    // Si hay fecha Desde, recalcular días
    if (desdeDate && date) {
      if (desdeDate <= date) {
        const nuevosDias = calcularDiasEntreFechas(desdeDate, date);
        setDias(nuevosDias.toString());
      }
    }
  };

  // Handler para cuando cambia el campo Días
  const handleDiasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    
    // Permitir solo números
    if (valor === "" || /^\d+$/.test(valor)) {
      setDias(valor);
      
      // Si hay fecha Desde y un número válido, calcular Hasta
      if (desdeDate && valor && parseInt(valor) > 0) {
        const diasNum = parseInt(valor);
        const nuevaFechaHasta = agregarDias(desdeDate, diasNum);
        setHastaDate(nuevaFechaHasta);
      } else if (valor === "") {
        // Si se borra el campo días, limpiar Hasta
        setHastaDate(null);
      }
    }
  };

  // Estados para Periodo de Prórroga
  const [prorrogaDias, setProrrogaDias] = useState("");
  const [prorrogaDenunciaTexto, setProrrogaDenunciaTexto] = useState("");

  // Estados para Límites Territoriales
  const [paisOrigen, setPaisOrigen] = useState("");
  const [limiteTerritorial, setLimiteTerritorial] = useState("");
  const [jurisdiccion, setJurisdiccion] = useState("");
  const [moneda, setMoneda] = useState("");
  const [trm, setTrm] = useState("");

  // Estados para Descuentos de Reaseguros
  const [comisionCompania, setComisionCompania] = useState("");
  const [comisionCompaniaPorc, setComisionCompaniaPorc] = useState("");
  const [comisionReaSeguros, setComisionReaSeguros] = useState("");
  const [comisionReaSegurosPorc, setComisionReaSegurosPorc] = useState("");
  const [total, setTotal] = useState("");
  const [totalPorc, setTotalPorc] = useState("");

  // Estados para Reserva de primas e intereses
  const [reservaPrimas, setReservaPrimas] = useState("20");
  const [reservaPrimasPorc, setReservaPrimasPorc] = useState("");
  const [reservaDias, setReservaDias] = useState("60");
  const [reservaVigencia, setReservaVigencia] = useState("02-Oct-1899");
  const [reservaTexto, setReservaTexto] = useState("a ser liberadas y pagadas (N) días después de finalizada la vigencia del presente contrato de reaseguro.");

  // Estados para Elección del Derecho Aplicable y Jurisdicción
  const [derechoAplicable, setDerechoAplicable] = useState("El presente contrato de reaseguro será regido por las leyes de (PAÍS)");

  // Estados para Sede Arbitraje
  const [sedeArbitraje, setSedeArbitraje] = useState("");

  return (
    <div className="space-y-6">
      {/* Sección Vigencia */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
          Vigencia
        </h3>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Columna Izquierda - Fechas */}
          <div className="space-y-4">
            {/* Desde */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Desde
              </label>
              <div className="space-y-2">
                {/* Date Picker */}
                <div className="datepicker-wrapper relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
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
                    selected={desdeDate}
                    onChange={handleDesdeChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Seleccionar fecha"
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    wrapperClassName="w-full"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
                {/* Time Picker */}
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Hora
                  </label>
                  <div className="datepicker-wrapper relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <DatePicker
                      selected={desdeTime}
                      onChange={(date) => setDesdeTime(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={60}
                      timeCaption="Hora"
                      dateFormat="h aa"
                      placeholderText="Seleccionar hora"
                      className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hasta */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Hasta
              </label>
              <div className="space-y-2">
                {/* Date Picker */}
                <div className="datepicker-wrapper relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
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
                    selected={hastaDate}
                    onChange={handleHastaChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Seleccionar fecha"
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    wrapperClassName="w-full"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    minDate={desdeDate || undefined}
                  />
                </div>
                {/* Time Picker */}
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Hora
                  </label>
                  <div className="datepicker-wrapper relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <DatePicker
                      selected={hastaTime}
                      onChange={(date) => setHastaTime(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={60}
                      timeCaption="Hora"
                      dateFormat="h aa"
                      placeholderText="Seleccionar hora"
                      className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Días */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Días
              </label>
              <input
                type="text"
                value={dias}
                onChange={handleDiasChange}
                placeholder="Ingrese días o seleccione fechas"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              {dias && (
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {dias} {parseInt(dias) === 1 ? 'día' : 'días'} de vigencia
                </p>
              )}
            </div>
          </div>

          {/* Columna Derecha - Vigencia Texto */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Vigencia
            </label>
            <textarea
              value={vigenciaTexto}
              onChange={(e) => setVigenciaTexto(e.target.value)}
              rows={8}
              placeholder="Renovable automáticamente 60 días antes de vencimiento."
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Sección Periodo de Prórroga */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
          Periodo de Prórroga
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Periodo de Prórroga
            </label>
            <input
              type="number"
              value={prorrogaDias}
              onChange={(e) => setProrrogaDias(e.target.value)}
              placeholder="Días"
              className="w-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Periodo de Prórroga para denuncia de reclamos
            </label>
            <textarea
              value={prorrogaDenunciaTexto}
              onChange={(e) => setProrrogaDenunciaTexto(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Sección Límites Territoriales */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
          Límites Territoriales
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              País de origen
            </label>
            <select
              value={paisOrigen}
              onChange={(e) => setPaisOrigen(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="">Seleccione...</option>
              <option value="colombia">Colombia</option>
              <option value="usa">Estados Unidos</option>
              <option value="mexico">México</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Límite Territorial
            </label>
            <select
              value={limiteTerritorial}
              onChange={(e) => setLimiteTerritorial(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="">Seleccione...</option>
              <option value="nacional">Nacional</option>
              <option value="internacional">Internacional</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Jurisdicción
            </label>
            <select
              value={jurisdiccion}
              onChange={(e) => setJurisdiccion(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="">Seleccione...</option>
              <option value="local">Local</option>
              <option value="internacional">Internacional</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Moneda
            </label>
            <select
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="">Seleccione...</option>
              <option value="usd">USD</option>
              <option value="cop">COP</option>
              <option value="eur">EUR</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              TRM (1 USD)
            </label>
            <input
              type="text"
              value={trm}
              onChange={(e) => setTrm(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Sección Descuentos de Reaseguros */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
          Descuentos de Reaseguros
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Comisión Compañía Seguros
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={comisionCompania}
                onChange={(e) => setComisionCompania(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">%</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Comisión Compañía ReaSeguros
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={comisionReaSeguros}
                onChange={(e) => setComisionReaSeguros(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">%</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Total
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Reserva de primas e intereses */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-6 text-sm font-semibold text-zinc-900 dark:text-white">
          Reserva de primas e intereses
        </h3>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Inputs en fila */}
          <div className="flex flex-wrap items-end gap-4">
            {/* Reserva de primas e intereses */}
            <div className="w-32">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Reserva de primas e intereses
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={reservaPrimas}
                  onChange={(e) => setReservaPrimas(e.target.value)}
                  placeholder="20"
                  className="w-20 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-center text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">%</span>
              </div>
            </div>

            {/* Días */}
            <div className="w-28">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Días
              </label>
              <input
                type="text"
                value={reservaDias}
                onChange={(e) => setReservaDias(e.target.value)}
                placeholder="60"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-center text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            {/* Vigencia */}
            <div className="w-48">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Vigencia
              </label>
              <input
                type="text"
                value={reservaVigencia}
                onChange={(e) => setReservaVigencia(e.target.value)}
                placeholder="02-Oct-1899"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {/* Textarea */}
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Descripción
            </label>
            <textarea
              value={reservaTexto}
              onChange={(e) => setReservaTexto(e.target.value)}
              rows={3}
              placeholder="a ser liberadas y pagadas (N) días después de finalizada la vigencia del presente contrato de reaseguro."
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Sección Elección del Derecho Aplicable y Jurisdicción */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
          Elección del Derecho Aplicable y Jurisdicción
        </h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Elección del Derecho Aplicable y Jurisdicción
          </label>
          <textarea
            value={derechoAplicable}
            onChange={(e) => setDerechoAplicable(e.target.value)}
            rows={3}
            placeholder="El presente contrato de reaseguro será regido por las leyes de (PAÍS)"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>
      </div>

      {/* Sección Sede Arbitraje */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
          Sede Arbitraje
        </h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Sede Arbitraje
          </label>
          <input
            type="text"
            value={sedeArbitraje}
            onChange={(e) => setSedeArbitraje(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}
