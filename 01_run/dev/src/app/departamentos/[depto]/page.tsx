import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StatCard from "@/components/StatCard";
import SourceNote from "@/components/SourceNote";
import MunicipiosTable from "@/components/MunicipiosTable";
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <p className="text-sm text-slate-500 mb-2">
        <Link href="/departamentos" className="hover:underline">Departamentos</Link> / {depto.nombre}
      </p>
      <h1 className="text-2xl font-bold">{depto.nombre} <span className="text-slate-400 font-normal text-lg">· capital {depto.capital}</span></h1>
      <p className="text-slate-600 mt-2 max-w-2xl">{depto.resumen}</p>

      {cap && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
            {cap.nombre} (capital)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cap.fallecidos != null && <StatCard label="Fallecidos" value={cap.fallecidos} tone="critical" />}
            {cap.heridos != null && <StatCard label="Heridos" value={cap.heridos} tone="warning" />}
            {cap.desaparecidos != null && <StatCard label="Desaparecidos" value={cap.desaparecidos} tone="critical" />}
            {cap.atrapados != null && <StatCard label="Personas atrapadas" value={cap.atrapados} tone="critical" />}
            {cap.rescatados != null && <StatCard label="Rescatados con vida" value={cap.rescatados} tone="ok" />}
            {cap.viviendas_colapsadas != null && <StatCard label="Viviendas colapsadas" value={cap.viviendas_colapsadas} tone="critical" />}
            {cap.viviendas_averiadas != null && <StatCard label="Viviendas averiadas" value={cap.viviendas_averiadas} tone="warning" />}
            {cap.damnificados != null && <StatCard label="Damnificados" value={cap.damnificados} tone="warning" />}
          </div>
          {cap.nota && <p className="text-xs text-slate-500 mt-2">{cap.nota}</p>}
          <SourceNote fuente={cap.fuente} corte={cap.corte} />
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
          Departamento (UNGRD)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Fallecidos" value={ung.fallecidos} tone={ung.fallecidos > 0 ? "critical" : "ok"} />
          <StatCard label="Heridos" value={ung.heridos} tone="warning" />
          <StatCard label="Viviendas averiadas" value={ung.viviendas_averiadas} tone="warning" />
          <StatCard label="Viviendas destruidas" value={ung.viviendas_destruidas} tone="critical" />
        </div>
        {ung.nota_ambiguedad && (
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <strong>Nota sobre esta cifra:</strong> {ung.nota_ambiguedad}
          </div>
        )}
        <SourceNote fuente={ung.fuente} corte={ung.corte} />
      </div>

      {depto.situacion.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Situación actual</h2>
          <ul className="list-disc list-inside space-y-1.5 text-slate-700">
            {depto.situacion.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {depto.necesidades.length > 0 && (
        <section className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-5">
          <h2 className="text-lg font-semibold mb-3 text-amber-900">Qué se necesita ahora en {depto.nombre}</h2>
          <ul className="list-disc list-inside space-y-1 text-amber-900">
            {depto.necesidades.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <Link href="/donar" className="inline-block mt-4 text-sm font-medium text-red-700 hover:underline">
            Ver guía completa de donación →
          </Link>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Municipios</h2>
        {depto.municipios.length > 0 ? (
          <MunicipiosTable municipios={depto.municipios} />
        ) : (
          <p className="text-slate-500">
            {depto.nota_cobertura ?? "Sin desglose por municipio disponible aún."}
          </p>
        )}
      </section>

      {(depto.puntos_acopio.length > 0 || depto.albergues.length > 0) && (
        <section className="mt-8 grid sm:grid-cols-2 gap-6">
          {depto.puntos_acopio.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Puntos de acopio</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {depto.puntos_acopio.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {depto.albergues.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Albergues</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {depto.albergues.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
