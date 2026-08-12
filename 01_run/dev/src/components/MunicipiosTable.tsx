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
          className="w-full sm:w-64 rounded-md border border-slate-300 px-3 py-2 text-sm mb-3"
        />
      )}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-4 py-2">Municipio</th>
              <th className="px-4 py-2">Situación reportada</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((m) => (
              <tr key={m.nombre} className="border-t border-slate-200">
                <td className="px-4 py-2 font-medium whitespace-nowrap">{m.nombre}</td>
                <td className="px-4 py-2 text-slate-600">{m.nota}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-4 text-center text-slate-400">
                  Sin resultados para &quot;{query}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
