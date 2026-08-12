"use client";

import { useMemo, useState } from "react";
import type { Municipio } from "@/lib/types";

export default function MunicipiosTable({ municipios }: { municipios: Municipio[] }) {
  const [query, setQuery] = useState("");

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return municipios;
    return municipios.filter((m) => m.nombre.toLowerCase().includes(q));
  }, [municipios, query]);

  return (
    <div>
      {municipios.length > 5 && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar municipio…"
          className="campo"
          style={{ maxWidth: 320, marginBottom: 10 }}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>Municipio</th>
            <th>Situación reportada</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((m) => (
            <tr key={m.nombre}>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{m.nombre}</td>
              <td style={{ fontSize: 15, color: "var(--tinta-3)" }}>{m.nota}</td>
            </tr>
          ))}
          {filtrados.length === 0 && (
            <tr>
              <td colSpan={2} className="nota" style={{ textAlign: "center", padding: "16px 0" }}>
                Sin resultados para &quot;{query}&quot;.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
