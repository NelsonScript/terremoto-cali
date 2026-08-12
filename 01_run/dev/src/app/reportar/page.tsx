"use client";

import { useState, type FormEvent } from "react";
import BannerAlerta from "@/components/AlertBanner";
import { useCrisisForm } from "@/lib/useCrisisForm";
import { departamentos } from "@/lib/data";

const TIPOS = [
  { id: "desaparecido", texto: "Persona atrapada o desaparecida" },
  { id: "estructura", texto: "Edificio o estructura en riesgo" },
  { id: "medica", texto: "Necesidad médica urgente" },
  { id: "otro", texto: "Otro" },
];

export default function ReportarPage() {
  const { status, errorMsg, submit, isFirebaseConfigured } = useCrisisForm("reportes");
  const [tipo, setTipo] = useState(TIPOS[0].id);
  const [departamento, setDepartamento] = useState(departamentos[0]?.id ?? "");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    submit({
      tipo: TIPOS.find((t) => t.id === tipo)?.texto,
      departamento,
      municipio: form.get("municipio"),
      descripcion: form.get("descripcion"),
      ubicacion: form.get("ubicacion"),
      contacto: form.get("contacto"),
    });
  }

  return (
    <>
      <BannerAlerta nivel="critico" titulo="Si hay una vida en riesgo, llama primero">
        Este formulario complementa la llamada, no la reemplaza.
        <span style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <a href="tel:119" style={{ flex: 1, background: "#fff", color: "var(--critico)", textDecoration: "none", padding: 14, textAlign: "center", fontSize: 20, fontWeight: 700 }}>
            119<span style={{ display: "block", fontSize: 12 }}>Bomberos</span>
          </a>
          <a href="tel:123" style={{ flex: 1, background: "#fff", color: "var(--critico)", textDecoration: "none", padding: 14, textAlign: "center", fontSize: 20, fontWeight: 700 }}>
            123<span style={{ display: "block", fontSize: 12 }}>Policía</span>
          </a>
        </span>
      </BannerAlerta>

      <main className="contenedor">
        <div className="seccion">
          <h1>Reportar</h1>
          <p className="sub">Los reportes los revisa el equipo coordinador. Para riesgo de vida inmediato, llama también a 119 o 123.</p>
        </div>

        {status === "success" ? (
          <section className="seccion" role="status">
            <div style={{ borderLeft: "5px solid var(--operativo)", background: "var(--fondo-2)", padding: 16 }}>
              <h2>Reporte recibido</h2>
              <p style={{ fontSize: 15 }}>Queda en la cola del equipo coordinador. Si la situación es de vida en riesgo, llama ahora.</p>
              <a href="tel:119" className="boton principal" style={{ background: "var(--critico)" }}>Llamar al 119</a>
            </div>
          </section>
        ) : (
          <form className="seccion" onSubmit={handleSubmit}>
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend className="etiqueta-campo" style={{ marginTop: 0 }}>Tipo de reporte</legend>
              <div className="pila">
                {TIPOS.map((t) => (
                  <label key={t.id} className={"opcion" + (tipo === t.id ? " activa" : "")}>
                    <input type="radio" name="tipo" value={t.id} checked={tipo === t.id} onChange={() => setTipo(t.id)} />
                    {t.texto}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="etiqueta-campo" htmlFor="departamento">Departamento</label>
            <select id="departamento" name="departamento" className="campo" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
              {departamentos.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>

            <label className="etiqueta-campo" htmlFor="municipio">Municipio</label>
            <input id="municipio" name="municipio" className="campo" placeholder="Ej: Cali, Quibdó, Dosquebradas…" />

            <label className="etiqueta-campo" htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" className="campo" required placeholder="Nombre, dirección o punto de referencia, y desde cuándo." />

            <label className="etiqueta-campo" htmlFor="ubicacion">Ubicación <span style={{ fontWeight: 400, color: "var(--gris)", fontSize: 14 }}>(dirección, barrio o punto de referencia)</span></label>
            <input id="ubicacion" name="ubicacion" className="campo" />

            <label className="etiqueta-campo" htmlFor="contacto">Contacto <span style={{ fontWeight: 400, color: "var(--gris)", fontSize: 14 }}>(opcional)</span></label>
            <input id="contacto" name="contacto" className="campo" placeholder="Teléfono o correo, si quieres que te contactemos" />

            {!isFirebaseConfigured && (
              <p className="nota" style={{ marginTop: 14, border: "1px solid var(--evaluacion)", background: "var(--evaluacion-suave)", color: "var(--tinta)", padding: 10 }}>
                Este formulario aún no está conectado a la base de datos del proyecto (falta configurar Firebase). Ver README.md para activarlo.
              </p>
            )}

            {status === "error" && (
              <p style={{ color: "var(--critico)", fontWeight: 600, fontSize: 15, marginTop: 12 }}>No se pudo enviar: {errorMsg}</p>
            )}

            <button type="submit" disabled={status === "submitting"} className="boton principal" style={{ marginTop: 16 }}>
              {status === "submitting" ? "Enviando…" : "Enviar reporte"}
            </button>
            <p className="nota">Al enviar verás la confirmación. El equipo coordinador revisa cada reporte.</p>
          </form>
        )}
      </main>
    </>
  );
}
