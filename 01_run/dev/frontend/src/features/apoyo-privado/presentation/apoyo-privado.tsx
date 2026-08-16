import type { FC } from 'react';
import { Render } from '@shared/components/render';
import { useResumenEvento } from '@features/evento/presentation/hooks/use-resumen-evento';
import type { ApoyoPrivado as ApoyoPrivadoItem } from '@features/evento/domain/entities/evento';

const Grupo: FC<{ tipo: string; items: ApoyoPrivadoItem[] }> = ({ tipo, items }) => {
  if (items.length === 0) return null;
  return (
    <section className="seccion">
      <h2 className="rotulo">{tipo}</h2>
      <table>
        <tbody>
          {items.map((a) => (
            <tr key={a.organizacion}>
              <td style={{ fontWeight: 600 }}>{a.organizacion}</td>
              <td style={{ paddingLeft: 12 }}>{a.aporte}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

const ApoyoPrivadoContenido: FC<{ apoyoPrivado: ApoyoPrivadoItem[] }> = ({ apoyoPrivado }) => {
  const internacional = apoyoPrivado.filter((a) => a.tipo === 'Cooperación internacional');
  const privado = apoyoPrivado.filter((a) => a.tipo === 'Sector privado');
  const interinstitucional = apoyoPrivado.filter((a) => a.tipo === 'Cooperación interinstitucional');

  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Apoyo externo y del sector privado</h1>
        <p className="sub">
          Países, empresas e instituciones que ya están aportando a la respuesta. Reconocerlos también sirve para
          que más se sumen.
        </p>
      </div>

      <Grupo tipo="Cooperación internacional" items={internacional} />
      <Grupo tipo="Sector privado" items={privado} />
      <Grupo tipo="Cooperación interinstitucional" items={interinstitucional} />

      <p className="nota">
        Solo se listan aportes anunciados públicamente o confirmados por la entidad receptora. ¿Tu empresa u
        organización quiere sumarse? Escríbenos a través del formulario de{' '}
        <a href="/voluntariado">voluntariado</a>.
      </p>
    </main>
  );
};

export const ApoyoPrivado: FC = () => {
  const { data, error, isLoading } = useResumenEvento();
  return (
    <Render
      isLoading={isLoading}
      error={error}
      SuccessComponent={() => (data ? <ApoyoPrivadoContenido apoyoPrivado={data.apoyoPrivado} /> : null)}
    />
  );
};
