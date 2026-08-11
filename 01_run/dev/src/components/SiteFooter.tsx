import Link from "next/link";
import { meta } from "@/lib/data";
import { formatFecha } from "@/lib/data";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-slate-600 flex flex-col gap-3">
        <p>
          Este sitio centraliza información pública sobre la emergencia por el
          sismo del 10 de agosto de 2026 ({meta.epicentro}) para agilizar la
          respuesta humanitaria. No sustituye los canales oficiales de
          emergencia.
        </p>
        <p>
          Última actualización general: {formatFecha(meta.ultima_actualizacion)} ·{" "}
          <Link href="/fuentes" className="underline hover:text-red-700">
            Ver fuentes y metodología
          </Link>
        </p>
        <p className="text-xs text-slate-400">
          Proyecto sin fines de lucro, operado con herramientas gratuitas
          (GitHub, GitHub Actions, Firebase Hosting, Cloudflare).
        </p>
      </div>
    </footer>
  );
}
