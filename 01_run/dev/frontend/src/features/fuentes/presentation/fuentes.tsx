import type { FC } from 'react';
import { Render } from '@shared/components/render';
import { useResumenEvento } from '@features/evento/presentation/hooks/use-resumen-evento';
import type { Fuente } from '@features/evento/domain/entities/evento';

const METODOLOGIA = [
  'No se estiman cifras sin fuente confirmada: sin dato oficial, la UI muestra «—».',
  'Cuando dos fuentes oficiales difieren en una cifra, se muestran ambas por separado en vez de sumarlas o elegir una.',
  'Todo el contenido dinámico (cifras, hospitales, albergues, necesidades) vive en archivos de datos versionados y se actualiza vía Pull Request antes de publicarse.',
];

const FuentesContenido: FC<{ fuentes: Fuente[] }> = ({ fuentes }) => {
  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Fuentes y metodología</h1>
        <p style={{ fontSize: 15 }}>
          Cada cifra publicada aquí lleva su fuente y su hora de corte. Cuando una fuente oficial no ha confirmado
          un dato, se muestra «—» en vez de una estimación.
        </p>

        <h2 className="rotulo" style={{ marginTop: 16 }}>Fuentes oficiales</h2>
        <table>
          <tbody>
            {fuentes.map((f) => (
              <tr key={f.nombre}>
                <td>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{f.nombre}</div>
                  <div style={{ fontSize: 14, color: 'var(--tinta-3)' }}>{f.descripcion}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ border: '1px solid var(--linea-2)', padding: 14, marginTop: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Por qué las cifras cambian</div>
          <p style={{ fontSize: 15, margin: '4px 0 0' }}>
            Las cifras de fallecidos y afectación varían entre fuentes porque miden cosas distintas: Asocapitales
            confirma solo lo verificado en ciudades capitales, mientras que las gobernaciones (vía UNGRD) incluyen
            zonas rurales aún en evaluación técnica (EDAN) — por eso su cifra suele ser mayor y sigue subiendo a
            medida que avanza la evaluación.
          </p>
        </div>

        <ul style={{ fontSize: 15, paddingLeft: 18, marginTop: 14 }}>
          {METODOLOGIA.map((m) => <li key={m}>{m}</li>)}
        </ul>
      </div>
    </main>
  );
};

export const Fuentes: FC = () => {
  const { data, error, isLoading } = useResumenEvento();
  return (
    <Render
      isLoading={isLoading}
      error={error}
      SuccessComponent={() => (data ? <FuentesContenido fuentes={data.fuentes} /> : null)}
    />
  );
};
