"use client";

import { useState, type FormEvent } from "react";
import { useCrisisForm } from "@/lib/useCrisisForm";
import { zonas } from "@/lib/data";

const PERFILES = [
  "Médico / salud",
  "Rescatista / USAR",
  "Transporte / logística",
  "Psicosocial / salud mental",
  "Traducción / comunicación",
  "Otro",
];

export default function VoluntariadoPage() {
  const { status, errorMsg, submit, isFirebaseConfigured } = useCrisisForm("voluntariado");
  const [perfil, setPerfil] = useState(PERFILES[0]);
  const [zona, setZona] = useState(zonas[0]?.id ?? "");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    submit({
      perfil,
      zona,
      disponibilidad: form.get("disponibilidad"),
      contacto: form.get("contacto"),
      nombre: form.get("nombre"),
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Voluntariado</h1>
      <p className="text-slate-600 mb-6">
        Regístrate para ofrecer ayuda. Recuerda que la coordinación oficial
        de voluntarios la lideran Cruz Roja, Bomberos y la Alcaldía; este
        registro alimenta esa coordinación.
      </p>

      {status === "success" ? (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 p-5">
          Gracias por ofrecerte como voluntario. El equipo coordinador se
          pondrá en contacto si tu perfil encaja con una necesidad activa.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="perfil">Tipo de ayuda que puedes ofrecer</label>
            <select
              id="perfil"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              {PERFILES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="zona">Zona donde puedes ayudar</label>
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
            <label className="block text-sm font-medium mb-1" htmlFor="disponibilidad">Disponibilidad</label>
            <input
              id="disponibilidad"
              name="disponibilidad"
              type="text"
              placeholder="Ej: fines de semana, tiempo completo esta semana…"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="contacto">Contacto</label>
            <input
              id="contacto"
              name="contacto"
              type="text"
              required
              placeholder="Teléfono o correo"
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
            className="w-full sm:w-auto rounded-md bg-slate-900 text-white font-medium px-5 py-2.5 hover:bg-slate-800 disabled:opacity-60"
          >
            {status === "submitting" ? "Enviando…" : "Registrarme"}
          </button>
        </form>
      )}
    </div>
  );
}
