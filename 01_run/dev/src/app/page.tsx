import Link from "next/link";
import AlertBanner from "@/components/AlertBanner";
import DepartamentosTable from "@/components/DepartamentosTable";
import SourceNote from "@/components/SourceNote";
import { meta, departamentosPrioritarios, departamentosSecundarios, formatNumero } from "@/lib/data";

const ACCIONES = [
  { href: "/donar", titulo: "Donar", desc: "Qué se necesita por departamento y cómo evitar estafas.", icon: "🤝" },
  { href: "/albergues", titulo: "Albergues", desc: "Directorio de albergues y puntos de acopio.", icon: "🏠" },
  { href: "/reportar", titulo: "Reportar", desc: "Persona atrapada, edificio en riesgo o necesidad médica.", icon: "📣" },
  { href: "/lineas-de-emergencia", titulo: "Emergencia", desc: "119 Bomberos · 123 Policía · 106 Salud mental.", icon: "☎" },
];

export default function Home() {
  const { nacional } = meta;

  return (
    <div>
      <AlertBanner />

      <section className="max-w-5xl mx-auto px-4 pt-8 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {meta.evento}
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Epicentro en {meta.epicentro} (profundidad {meta.profundidad_km} km),{" "}
          {meta.hora_evento} {meta.declaratoria} en Colombia. Esta página
          centraliza información verificada y herramientas para agilizar la
          ayuda en el {meta.region}: Valle del Cauca, Risaralda, Chocó,
          Caldas y departamentos vecinos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3">
            <div className="text-2xl sm:text-3xl font-bold tabular-nums text-red-900">
              {formatNumero(nacional.fallecidos_confirmados_urbano.valor)}
            </div>
            <div className="text-xs sm:text-sm mt-1 text-red-900">{nacional.fallecidos_confirmados_urbano.etiqueta}</div>
          </div>
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
            <div className="text-2xl sm:text-3xl font-bold tabular-nums text-amber-900">
              {formatNumero(nacional.fallecidos_gobernaciones.valor)}
            </div>
            <div className="text-xs sm:text-sm mt-1 text-amber-900">{nacional.fallecidos_gobernaciones.etiqueta}</div>
          </div>
          <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3">
            <div className="text-2xl sm:text-3xl font-bold tabular-nums text-slate-900">
              {formatNumero(nacional.heridos.valor)}
            </div>
            <div className="text-xs sm:text-sm mt-1 text-slate-700">{nacional.heridos.etiqueta}</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 max-w-2xl">
          Dos cifras de fallecidos porque dos fuentes miden distinto: Asocapitales
          confirma solo lo verificado en ciudades capitales; las gobernaciones
          (vía UNGRD) ya incluyen zonas rurales aún en evaluación, por eso es
          más alta y sigue subiendo.
        </p>
        <SourceNote fuente={nacional.fallecidos_gobernaciones.fuente} corte={nacional.fallecidos_gobernaciones.corte} />
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
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <h2 className="text-lg font-semibold">Departamentos afectados</h2>
          <Link href="/departamentos" className="text-sm text-red-700 hover:underline shrink-0">
            Ver todos →
          </Link>
        </div>
        <p className="text-sm text-slate-600 mb-3">
          Valle del Cauca, Risaralda, Chocó y Caldas tienen diagnóstico detallado
          por municipio. Quindío, Antioquia y Tolima reportan afectación menor,
          con cifras agregadas de UNGRD.
        </p>
        <DepartamentosTable departamentos={[...departamentosPrioritarios, ...departamentosSecundarios]} />
      </section>
    </div>
  );
}
