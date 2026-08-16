import type { FC } from 'react';
import { Render } from '@shared/components/render';
import { LineaEmergenciaCard } from '@shared/components/linea-emergencia-card';
import { useResumenEvento } from '@features/evento/presentation/hooks/use-resumen-evento';
import type { LineaEmergencia } from '@features/evento/domain/entities/evento';

const LineasContenido: FC<{ lineas: LineaEmergencia[] }> = ({ lineas }) => {
  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Líneas de emergencia</h1>
        <p className="sub">Toca el número para llamar. Guarda estos contactos antes de usar cualquier formulario en esta web.</p>
      </div>
      <div className="pila">
        {lineas.map((l) => (
          <div key={l.nombre}>
            <LineaEmergenciaCard
              nombre={l.nombre.split(' (')[0]}
              descripcion={l.nombre.includes('(') ? l.nombre.slice(l.nombre.indexOf('(') + 1, -1) : l.cobertura}
              numero={l.numero}
              nivel={l.numero.match(/^\d+$/) ? 'critico' : 'neutro'}
            />
            {l.nota && <p className="nota" style={{ marginTop: 4 }}>{l.nota}</p>}
          </div>
        ))}
      </div>
    </main>
  );
};

export const LineasEmergencia: FC = () => {
  const { data, error, isLoading } = useResumenEvento();
  return (
    <Render
      isLoading={isLoading}
      error={error}
      SuccessComponent={() => (data ? <LineasContenido lineas={data.lineas} /> : null)}
    />
  );
};
