import Link from "next/link";
import { fuentes } from "@/lib/data";

/** Puerto fiel de PieSitio.js (referencia de diseño). */
export default function SiteFooter() {
  const nombresFuentes = fuentes.map((f) => f.nombre);
  return (
    <footer className="pie">
      <div className="contenedor">
        <span>
          Fuentes: {nombresFuentes.join(" · ")}.
          <br />
          Sitio de utilidad pública sin ánimo de lucro. No sustituye a las entidades oficiales.
        </span>
        <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <Link href="/departamentos">Departamentos</Link>
          <Link href="/salud">Salud</Link>
          <Link href="/fuentes">Fuentes</Link>
          <Link href="/voluntariado">Voluntariado</Link>
          <Link href="/tramites">Trámites</Link>
          <Link href="/apoyo-privado">Apoyo privado</Link>
        </span>
      </div>
    </footer>
  );
}
