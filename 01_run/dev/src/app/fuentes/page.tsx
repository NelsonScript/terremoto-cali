import type { Metadata } from "next";
import { fuentes, meta } from "@/lib/data";
import { formatFecha } from "@/lib/data";

export const metadata: Metadata = {
  title: "Fuentes y metodología",
};

export default function FuentesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Fuentes y metodología</h1>
      <p className="text-slate-600 mb-6 max-w-2xl">
        Cada cifra publicada en este sitio indica su fuente y fecha de
        corte. Este sitio no genera datos propios: cura y centraliza
        información de fuentes oficiales.
      </p>

      <ul className="space-y-4 mb-8">
        {fuentes.map((f) => (
          <li key={f.nombre} className="rounded-lg border border-slate-200 p-4">
            <div className="font-medium">{f.nombre}</div>
            <p className="text-sm text-slate-600 mt-1">{f.descripcion}</p>
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        <p>
          <strong>Última actualización general del sitio:</strong>{" "}
          {formatFecha(meta.ultima_actualizacion)}
        </p>
        <p className="mt-2">
          Todo el contenido dinámico del sitio (cifras, hospitales, albergues,
          necesidades) se gestiona en archivos de datos versionados en el
          repositorio del proyecto y se actualiza mediante revisión por
          Pull Request antes de publicarse. Historial completo disponible en
          GitHub.
        </p>
      </div>
    </div>
  );
}
