import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StatCard from "@/components/StatCard";
import SourceNote from "@/components/SourceNote";
import MunicipiosTable from "@/components/MunicipiosTable";
import DepartamentoSelector from "@/components/DepartamentoSelector";
import { departamentos, getDepartamento } from "@/lib/data";

export async function generateStaticParams() {
  return departamentos.map((d) => ({ depto: d.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/departamentos/[depto]">): Promise<Metadata> {
  const { depto: deptoId } = await params;
  const depto = getDepartamento(deptoId);
  return { title: depto ? depto.nombre : "Departamento" };
}

export default async function DepartamentoPage({ params }: PageProps<"/departamentos/[depto]">) {
  const { depto: deptoId } = await params;
  const depto = getDepartamento(deptoId);
  if (!depto) notFound();

  const cap = depto.cifras_capital;
  const ung = depto.cifras_departamento_ungrd;

  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>{depto.nombre}</h1>
        <p className="sub">Capital: {depto.capital} · {depto.resumen}</p>
        <div style={{ marginTop: 10 }}>
          <DepartamentoSelector departamentos={departamentos} activo={depto.id} />
        </div>
      </div>

      {cap && (
        <section className="seccion">
          <h2 className="rotulo">{cap.nombre} (capital)</h2>
          <div className="rejilla-2">
            {cap.fallecidos != null && <StatCard label="Fallecidos" value={cap.fallecidos} tone="critical" />}
            {cap.heridos != null && <StatCard label="Heridos" value={cap.heridos} tone="warning" />}
            {cap.desaparecidos != null && <StatCard label="Desaparecidos" value={cap.desaparecidos} tone="critical" />}
            {cap.atrapados != null && <StatCard label="Personas atrapadas" value={cap.atrapados} tone="critical" />}
            {cap.rescatados != null && <StatCard label="Rescatados con vida" value={cap.rescatados} tone="ok" />}
            {cap.viviendas_colapsadas != null && <StatCard label="Viviendas colapsadas" value={cap.viviendas_colapsadas} tone="critical" />}
            {cap.viviendas_averiadas != null && <StatCard label="Viviendas averiadas" value={cap.viviendas_averiadas} tone="warning" />}
            {cap.damnificados != null && <StatCard label="Damnificados" value={cap.damnificados} tone="warning" />}
          </div>
          {cap.nota && <p className="nota" style={{ marginTop: 8 }}>{cap.nota}</p>}
          <SourceNote fuente={cap.fuente} corte={cap.corte} />
        </section>
      )}

      <section className="seccion">
        <h2 className="rotulo">Departamento (UNGRD)</h2>
        <div className="rejilla-2">
          <StatCard label="Fallecidos" value={ung.fallecidos} tone={ung.fallecidos > 0 ? "critical" : "ok"} />
          <StatCard label="Heridos" value={ung.heridos} tone="warning" />
          <StatCard label="Viviendas averiadas" value={ung.viviendas_averiadas} tone="warning" />
          <StatCard label="Viviendas destruidas" value={ung.viviendas_destruidas} tone="critical" />
        </div>
        {ung.nota_ambiguedad && (
          <div style={{ marginTop: 10, borderLeft: "5px solid var(--evaluacion)", background: "var(--evaluacion-suave)", padding: 12, fontSize: 15 }}>
            <strong>Nota sobre esta cifra:</strong> {ung.nota_ambiguedad}
          </div>
        )}
        <SourceNote fuente={ung.fuente} corte={ung.corte} />
      </section>

      {depto.situacion.length > 0 && (
        <section className="seccion">
          <h2 className="rotulo">Situación actual</h2>
          <ul style={{ fontSize: 15, paddingLeft: 18, margin: 0 }}>
            {depto.situacion.map((item, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {depto.necesidades.length > 0 && (
        <section className="seccion">
          <h2 className="rotulo">Qué necesita {depto.nombre} ahora</h2>
          <div className="pila">
            {depto.necesidades.map((n) => (
              <div key={n} style={{ display: "flex", gap: 10, alignItems: "center", border: "1px solid var(--tinta)", padding: "10px 12px" }}>
                <span style={{ width: 10, height: 10, background: "var(--critico)", flex: "none" }} />
                <span style={{ fontSize: 16, fontWeight: 600 }}>{n}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 8 }}>
            <Link href="/donar" style={{ fontWeight: 600 }}>Ver guía completa de donación →</Link>
          </p>
        </section>
      )}

      <section className="seccion">
        <h2 className="rotulo">Municipios</h2>
        {depto.municipios.length > 0 ? (
          <MunicipiosTable municipios={depto.municipios} />
        ) : (
          <p className="sub">{depto.nota_cobertura ?? "Sin desglose por municipio disponible aún."}</p>
        )}
      </section>

      {(depto.puntos_acopio.length > 0 || depto.albergues.length > 0) && (
        <section className="seccion" style={{ display: "grid", gap: 24 }}>
          {depto.puntos_acopio.length > 0 && (
            <div>
              <h3 style={{ marginBottom: 8 }}>Puntos de acopio</h3>
              <ul style={{ fontSize: 15, paddingLeft: 18, margin: 0 }}>
                {depto.puntos_acopio.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {depto.albergues.length > 0 && (
            <div>
              <h3 style={{ marginBottom: 8 }}>Albergues</h3>
              <ul style={{ fontSize: 15, paddingLeft: 18, margin: 0 }}>
                {depto.albergues.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="seccion pila">
        <Link className="boton" href="/salud">Red hospitalaria <span>→</span></Link>
        <Link className="boton" href="/albergues">Albergues en {depto.nombre} <span>→</span></Link>
        <Link className="boton donar" href="/donar">Donar para {depto.nombre} <span>→</span></Link>
      </section>
    </main>
  );
}
