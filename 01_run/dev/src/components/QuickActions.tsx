"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ACCIONES = [
  { href: "/donar", texto: "Donar" },
  { href: "/albergues", texto: "Albergues" },
  { href: "/reportar", texto: "Reportar" },
];

/** Puerto fiel de BarraAcciones.js (referencia de diseño). Oculta en
 * escritorio vía la regla `.barra-acciones{display:none}` en globals.css. */
export default function QuickActions() {
  const activa = usePathname();
  return (
    <nav className="barra-acciones" aria-label="Acciones críticas">
      {ACCIONES.map((a) => (
        <Link key={a.href} href={a.href} className={activa === a.href ? "activa" : undefined}>
          {a.texto}
        </Link>
      ))}
      <Link href="/lineas-de-emergencia" className="llamar">
        Llamar
        <small>119 · 123</small>
      </Link>
    </nav>
  );
}
