import Link from "next/link";
import { meta } from "@/lib/data";
import { formatFecha } from "@/lib/data";

const NAV_LINKS = [
  { href: "/zonas", label: "Zonas" },
  { href: "/salud", label: "Salud" },
  { href: "/albergues", label: "Albergues" },
  { href: "/donar", label: "Donar" },
  { href: "/voluntariado", label: "Voluntariado" },
  { href: "/lineas-de-emergencia", label: "Líneas de emergencia" },
  { href: "/tramites", label: "Trámites" },
  { href: "/apoyo-privado", label: "Apoyo privado" },
  { href: "/fuentes", label: "Fuentes" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="bg-slate-900 text-slate-100 text-xs sm:text-sm px-4 py-1.5 text-center">
        {meta.evento} · Última actualización: {formatFecha(meta.ultima_actualizacion)}
      </div>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-lg text-slate-900 shrink-0">
          Ayuda Cali <span className="text-red-600">·</span> Respuesta Terremoto
        </Link>
        <nav className="hidden md:flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700 justify-end">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-red-700 hover:underline underline-offset-4">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {/* Nav simplificada visible en móvil (scroll horizontal) */}
      <nav className="md:hidden flex gap-3 overflow-x-auto px-4 pb-2 text-sm text-slate-700 whitespace-nowrap">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-red-700">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
