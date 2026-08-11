"use client";

import { useState, type FormEvent } from "react";
import EmergencyFormNotice from "@/components/EmergencyFormNotice";
import { useCrisisForm } from "@/lib/useCrisisForm";
import { zonas } from "@/lib/data";

const TIPOS = [
  "Persona atrapada / desaparecida",
  "Edificio en riesgo",
  "Necesidad médica urgente",
  "Otro",
];

export default function ReportarPage() {
  const { status, errorMsg, submit, isFirebaseConfigured } = useCrisisForm("reportes");
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [zona, setZona] = useState(zonas[0]?.id ?? "");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    submit({
      tipo,
      zona,
      descripcion: form.get("descripcion"),
      ubicacion: form.get("ubicacion"),
      contacto: form.get("contacto"),
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Reportar</h1>
      <p className="text-slate-600 mb-6">
        Reporta una persona atrapada o desaparecida, un edificio en riesgo, o
        una necesidad médica urgente. El equipo coordinador revisa cada
        reporte.
      </p>

      <EmergencyFormNotice />

      {status === "success" ? (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 p-5">
          Reporte enviado. Gracias — recuerda que para riesgo de vida
          inmediato debes llamar también a 119 o 123.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="tipo">Tipo de reporte</label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="zona">Zona</label>
            <select
              id="zona"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              {zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              required
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Describe la situación con el mayor detalle posible"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="ubicacion">Ubicación (dirección, barrio o punto de referencia)</label>
            <input
              id="ubicacion"
              name="ubicacion"
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="contacto">Contacto (opcional)</label>
            <input
              id="contacto"
              name="contacto"
              type="text"
              placeholder="Teléfono o correo, si quieres que te contactemos"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>

          {!isFirebaseConfigured && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-300 rounded-md p-3">
              Este formulario aún no está conectado a la base de datos del
              proyecto (falta configurar Firebase). Ver README.md para
              activarlo.
            </p>
          )}

          {status === "error" && (
            <p className="text-sm text-red-700">No se pudo enviar: {errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto rounded-md bg-red-600 text-white font-medium px-5 py-2.5 hover:bg-red-700 disabled:opacity-60"
          >
            {status === "submitting" ? "Enviando…" : "Enviar reporte"}
          </button>
        </form>
      )}
    </div>
  );
}
