import type { Metadata } from "next";
import BannerAlerta from "@/components/AlertBanner";
import { departamentos, acopioBogota } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cómo donar",
};

export default function DonarPage() {
  const conNecesidades = departamentos.filter((d) => d.necesidades.length > 0);

  return (
    <>
      <BannerAlerta nivel="critico" titulo="Dinero: solo Cruz Roja Colombiana">
        Es el único canal autorizado para donaciones económicas de esta emergencia. Cualquier otra cuenta, link o
        recolecta que te contacten es un fraude.
        <a
          href="https://www.cruzrojacolombiana.org"
          rel="noopener noreferrer"
          target="_blank"
          style={{ display: "block", marginTop: 10, background: "#fff", color: "var(--critico)", textDecoration: "none", padding: 14, fontSize: 16, fontWeight: 700, textAlign: "center" }}
        >
          Ir al canal oficial de la Cruz Roja
        </a>
      </BannerAlerta>

      <main className="contenedor">
        <section className="seccion">
          <h2 className="rotulo">Qué se necesita hoy, por departamento</h2>
          <table>
            <tbody>
              {conNecesidades.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>{d.nombre}</div>
                    <div style={{ fontSize: 15 }}>{d.necesidades.join(" · ")}</div>
                    {d.puntos_acopio.length > 0 && (
                      <div className="nota" style={{ fontSize: 14 }}>Punto de acopio: {d.puntos_acopio.join(", ")}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="seccion">
          <h2 className="rotulo">Centros de acopio en Bogotá (Cruz Roja)</h2>
          <p className="sub">
            Si estás fuera de las zonas afectadas, estos puntos en Bogotá reciben donaciones en especie. Horario
            general: {acopioBogota.horario_general}.
          </p>
          <div className="pila" style={{ marginTop: 10 }}>
            {acopioBogota.puntos.map((p) => (
              <div key={p.nombre} style={{ border: "1px solid var(--linea-2)", padding: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{p.nombre}</div>
                <div style={{ fontSize: 14, color: "var(--tinta-3)" }}>
                  {p.direccion}
                  {p.nota ? " · " + p.nota : ""}
                </div>
              </div>
            ))}
          </div>
          <p className="nota">
            Si vas a donar en especie, lleva los insumos empacados y marcados. No se reciben alimentos preparados ni
            medicamentos sueltos.
          </p>
        </section>
      </main>
    </>
  );
}
