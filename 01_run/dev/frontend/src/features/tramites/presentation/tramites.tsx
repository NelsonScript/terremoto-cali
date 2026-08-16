import type { FC } from 'react';

const CUBRE = [
  'Gastos médicos y quirúrgicos: cirugías, hospitalización y rehabilitación.',
  'Gastos funerarios: indemnización para familias de víctimas mortales.',
  'Indemnización por incapacidad permanente, previa certificación técnica.',
  'Traslado de pacientes: reconocimiento de costos de transporte asistencial.',
];
const NO_CUBRE = ['Daños en vivienda', 'Pérdida de bienes', 'Lucro cesante'];
const PASOS = [
  { titulo: '1. Reúne los documentos', detalle: 'Documento de identidad, historia clínica o certificado de atención, y factura de los servicios.' },
  { titulo: '2. Radica ante la IPS o EPS', detalle: 'La institución que te atendió normalmente radica el cobro por ti. Pide constancia.' },
  { titulo: '3. Haz seguimiento', detalle: 'Guarda el número de radicado y consulta el estado en el canal oficial de ADRES.' },
];

/**
 * Página 100% estática (sin datos versionados que puedan cambiar): no
 * depende de ningún repositorio, es Presentación pura. No toda página
 * necesita las cuatro capas — forzarlas aquí sería ceremonia sin beneficio.
 */
export const Tramites: FC = () => {
  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Trámites e indemnizaciones</h1>
        <p className="sub">
          La Administradora de los Recursos del Sistema General de Seguridad Social en Salud (ADRES) cubre gastos
          derivados de la atención a víctimas de eventos catastróficos. No cubre daños materiales.
        </p>
        <div className="rejilla-2" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 14 }}>
          <div style={{ borderTop: '4px solid var(--operativo)', background: 'var(--fondo-2)', padding: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--operativo)' }}>Sí cubre</div>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 15 }}>
              {CUBRE.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
          <div style={{ borderTop: '4px solid var(--critico)', background: 'var(--fondo-2)', padding: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--critico)' }}>No cubre</div>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 15 }}>
              {NO_CUBRE.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <section className="seccion">
        <h2 className="rotulo">Cómo reclamar</h2>
        <div style={{ borderLeft: '3px solid var(--tinta)', paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PASOS.map((p) => (
            <div key={p.titulo}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{p.titulo}</div>
              <div style={{ fontSize: 15 }}>{p.detalle}</div>
            </div>
          ))}
        </div>
        <p>
          <a href="https://www.adres.gov.co" rel="noopener noreferrer" target="_blank" style={{ fontWeight: 600 }}>
            Ir al canal oficial de ADRES →
          </a>
        </p>
        <p className="nota">Esta guía es informativa. La entidad competente es la única que define la cobertura de cada caso.</p>
      </section>
    </main>
  );
};
