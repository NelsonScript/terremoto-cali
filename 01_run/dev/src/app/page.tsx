import Link from "next/link";
import AlertBanner from "@/components/AlertBanner";
import StatCard from "@/components/StatCard";
import SourceNote from "@/components/SourceNote";
import { cifras, zonas, meta } from "@/lib/data";

const ACCIONES = [
  { href: "/donar", titulo: "Donar", desc: "Qué se necesita por zona y cómo evitar estafas.", icon: "🤝" },
  { href: "/albergues", titulo: "Ver albergues", desc: "Directorio de albergues y puntos de acopio.", icon: "🏠" },
  { href: "/reportar", titulo: "Reportar", desc: "Persona atrapada, edificio en riesgo o necesidad médica.", icon: "📣" },
  { href: "/lineas-de-emergencia", titulo: "Líneas de emergencia", desc: "119 Bomberos · 123 Policía · 106 Salud mental.", icon: "☎" },
];

export default function Home() {
  return (
    <div>
      <AlertBanner />

      <section className="max-w-5xl mx-auto px-4 pt-8 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {meta.evento}
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Epicentro en {meta.epicentro} (profundidad {meta.profundidad_km} km).{" "}
          {meta.declaratoria}. Esta página centraliza información verificada y
          herramientas para agilizar la ayuda en Cali, Chocó, Pereira y
          Manizales.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <StatCard label="Fallecidos (nacional)" value={cifras.nacional.fallecidos} tone="critical" />
          <StatCard label="Fallecidos en Cali" value={cifras.zonas.find((z) => z.id === "cali")?.fallecidos ?? null} tone="critical" />
          <StatCard label="Heridos en Cali" value={cifras.zonas.find((z) => z.id === "cali")?.heridos ?? null} tone="warning" />
          <StatCard label="Rescatados con vida en Cali" value={cifras.zonas.find((z) => z.id === "cali")?.rescatados ?? null} tone="ok" />
        </div>
        <SourceNote fuente={cifras.nacional.fuente} corte={cifras.nacional.corte} />
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-3">¿Qué necesitas hacer ahora?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACCIONES.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="rounded-xl border border-slate-200 p-4 hover:border-red-400 hover:shadow-sm transition-colors"
            >
              <div className="text-2xl">{a.icon}</div>
              <div className="font-semibold mt-2">{a.titulo}</div>
              <div className="text-sm text-slate-600 mt-1">{a.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-3">Zonas afectadas</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {zonas.map((z) => (
            <Link
              key={z.id}
              href={`/zonas/${z.id}`}
              className="rounded-xl border border-slate-200 p-4 hover:border-red-400 hover:shadow-sm transition-colors"
            >
              <div className="font-semibold">{z.nombre} <span className="text-slate-400 font-normal">· {z.region}</span></div>
              <p className="text-sm text-slate-600 mt-1">{z.resumen}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
