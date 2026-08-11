import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trámites e indemnizaciones",
};

export default function TramitesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Trámites e indemnizaciones</h1>
      <p className="text-slate-600 mb-6 max-w-2xl">
        La Administradora de los Recursos del Sistema General de Seguridad
        Social en Salud (ADRES) activó rutas de indemnización para las
        víctimas del sismo.
      </p>

      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6 mb-6">
        <h2 className="font-semibold text-emerald-900 mb-2">ADRES sí cubre</h2>
        <ul className="list-disc list-inside space-y-1 text-emerald-900">
          <li>Gastos médicos y quirúrgicos: cirugías, hospitalización y rehabilitación.</li>
          <li>Gastos funerarios: indemnización para familias de víctimas mortales.</li>
          <li>Indemnización por incapacidad permanente, previa certificación técnica.</li>
          <li>Traslado de pacientes: reconocimiento de costos de transporte asistencial.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-red-300 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900 mb-2">ADRES NO cubre</h2>
        <p className="text-red-900">
          Daños materiales ni afectaciones a la infraestructura física
          (vivienda, negocio, vehículo). Para esos casos consulta los
          programas de reconstrucción de la Alcaldía y el Gobierno Nacional.
        </p>
      </div>

      <p className="text-sm text-slate-500 mt-6">
        Consulta siempre el canal oficial de ADRES para el procedimiento y
        los documentos exactos requeridos, ya que pueden variar.
      </p>
    </div>
  );
}
