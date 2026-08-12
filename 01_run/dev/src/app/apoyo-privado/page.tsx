import type { Metadata } from "next";
import { apoyoPrivado } from "@/lib/data";
import type { ApoyoPrivado } from "@/lib/types";

export const metadata: Metadata = {
  title: "Apoyo externo y del sector privado",
};

function Grupo({ tipo, items }: { tipo: string; items: ApoyoPrivado[] }) {
  if (items.length === 0) return null;
  return (
    <section className="seccion">
      <h2 className="rotulo">{tipo}</h2>
      <table>
        <tbody>
          {items.map((a) => (
            <tr key={a.organizacion}>
              <td style={{ fontWeight: 600 }}>{a.organizacion}</td>
              <td style={{ paddingLeft: 12 }}>{a.aporte}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function ApoyoPrivadoPage() {
  const internacional = apoyoPrivado.filter((a) => a.tipo === "Cooperación internacional");
  const privado = apoyoPrivado.filter((a) => a.tipo === "Sector privado");
  const interinstitucional = apoyoPrivado.filter((a) => a.tipo === "Cooperación interinstitucional");

  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Apoyo externo y del sector privado</h1>
        <p className="sub">
          Países, empresas e instituciones que ya están aportando a la respuesta. Reconocerlos también sirve para
          que más se sumen.
        </p>
      </div>

      <Grupo tipo="Cooperación internacional" items={internacional} />
      <Grupo tipo="Sector privado" items={privado} />
      <Grupo tipo="Cooperación interinstitucional" items={interinstitucional} />

      <p className="nota">
        Solo se listan aportes anunciados públicamente o confirmados por la entidad receptora. ¿Tu empresa u
        organización quiere sumarse? Escríbenos a través del formulario de{" "}
        <a href="/voluntariado">voluntariado</a>.
      </p>
    </main>
  );
}
