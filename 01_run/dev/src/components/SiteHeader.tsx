"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { meta, formatFecha, formatNumero } from "@/lib/data";

const NAV_LINKS = [
  { href: "/departamentos", label: "Departamentos" },
  { href: "/salud", label: "Salud" },
  { href: "/albergues", label: "Albergues" },
  { href: "/voluntariado", label: "Voluntariado" },
  { href: "/tramites", label: "Trámites" },
  { href: "/apoyo-privado", label: "Apoyo privado" },
  { href: "/fuentes", label: "Fuentes" },
  { href: "/donar", label: "Donar", variant: "donar" },
  { href: "/lineas-de-emergencia", label: "Llamar", variant: "llamar" },
];

/** Puerto fiel de EncabezadoPagina.js (referencia de diseño). */
export default function SiteHeader() {
  const ruta = usePathname();
  const esHome = ruta === "/";
  const titular = `${meta.evento} — epicentro ${meta.epicentro} — ${formatNumero(
    meta.nacional.fallecidos_gobernaciones.valor
  )} fallecidos a nivel nacional (cifra preliminar, en aumento)`;

  return (
    <>
      <div className="barra-marca">
        <div className="contenedor">
          {esHome ? (
            <span style={{ fontWeight: 700, letterSpacing: ".04em" }}>
              AYUDA SUROCCIDENTE · ESTADO NACIONAL
            </span>
          ) : (
            <Link href="/">← Inicio</Link>
          )}
          <span className="ruta">{esHome ? "Corte " + formatFecha(meta.ultima_actualizacion) : ruta}</span>
        </div>
      </div>
      {esHome && (
        <div className="tira-evento">
          <div className="contenedor">{titular}</div>
        </div>
      )}
      <div className="contenedor" style={{ padding: "10px 16px" }}>
        <nav className="nav-escritorio" aria-label="Navegación principal">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={l.variant}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
