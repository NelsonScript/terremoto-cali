import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StatCard from "@/components/StatCard";
import SourceNote from "@/components/SourceNote";
import { zonas, getZona, getCifraZona } from "@/lib/data";

export async function generateStaticParams() {
  return zonas.map((z) => ({ zona: z.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/zonas/[zona]">): Promise<Metadata> {
  const { zona: zonaId } = await params;
  const zona = getZona(zonaId);
  return { title: zona ? zona.nombre : "Zona" };
}

export default async function ZonaPage({ params }: PageProps<"/zonas/[zona]">) {
  const { zona: zonaId } = await params;
  const zona = getZona(zonaId);
  if (!zona) notFound();

  const cifra = getCifraZona(zona.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <p className="text-sm text-slate-500 mb-2">
        <Link href="/zonas" className="hover:underline">Zonas</Link> / {zona.nombre}
      </p>
      <h1 className="text-2xl font-bold">{zona.nombre} <span className="text-slate-400 font-normal text-lg">· {zona.region}</span></h1>
      <p className="text-slate-600 mt-2 max-w-2xl">{zona.resumen}</p>

      {cifra && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <StatCard label="Fallecidos" value={cifra.fallecidos} tone="critical" />
            <StatCard label="Heridos" value={cifra.heridos} tone="warning" />
            <StatCard label="Desaparecidos" value={cifra.desaparecidos} tone="critical" />
            <StatCard label="Rescatados con vida" value={cifra.rescatados} tone="ok" />
          </div>
          <SourceNote fuente={cifra.fuente} corte={cifra.corte} />
        </>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Situación actual</h2>
        <ul className="list-disc list-inside space-y-1.5 text-slate-700">
          {zona.situacion.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-5">
        <h2 className="text-lg font-semibold mb-3 text-amber-900">Qué se necesita ahora en {zona.nombre}</h2>
        <ul className="list-disc list-inside space-y-1 text-amber-900">
          {zona.necesidades.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <Link href="/donar" className="inline-block mt-4 text-sm font-medium text-red-700 hover:underline">
          Ver guía completa de donación →
        </Link>
      </section>

      {(zona.puntos_acopio.length > 0 || zona.albergues.length > 0) && (
        <section className="mt-8 grid sm:grid-cols-2 gap-6">
          {zona.puntos_acopio.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Puntos de acopio</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {zona.puntos_acopio.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {zona.albergues.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Albergues</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {zona.albergues.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
