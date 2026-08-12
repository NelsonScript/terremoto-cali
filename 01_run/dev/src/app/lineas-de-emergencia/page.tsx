import type { Metadata } from "next";
import { lineas } from "@/lib/data";
import LineaEmergenciaCard from "@/components/LineaEmergenciaCard";

export const metadata: Metadata = {
  title: "Líneas de emergencia",
};

export default function LineasPage() {
  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Líneas de emergencia</h1>
        <p className="sub">Toca el número para llamar. Guarda estos contactos antes de usar cualquier formulario en esta web.</p>
      </div>
      <div className="pila">
        {lineas.map((l) => (
          <div key={l.nombre}>
            <LineaEmergenciaCard
              nombre={l.nombre.split(" (")[0]}
              descripcion={l.nombre.includes("(") ? l.nombre.slice(l.nombre.indexOf("(") + 1, -1) : l.cobertura}
              numero={l.numero}
              nivel={l.numero.match(/^\d+$/) ? "critico" : "neutro"}
            />
            {l.nota && <p className="nota" style={{ marginTop: 4 }}>{l.nota}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
