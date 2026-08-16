import type { FC } from 'react';
import { useState, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@config/state-managment/store';
import { isFirebaseConfigured } from '@shared/core/persistence/firebase';
import { registrarVoluntarioRequest } from '@features/voluntariado/application/redux/voluntariado.actions';
import { selectVoluntariado } from '@features/voluntariado/application/redux/voluntariado.selectors';
import { departamentosContainer } from '@features/departamentos/application/container/departamentos.ioc';
import { DEPARTAMENTOS_IOC_TYPES } from '@features/departamentos/application/container/departamentos.ioc.types';
import { DepartamentosUseCases } from '@features/departamentos/application/usecases/departamentos.usecases';

const departamentosUseCases = departamentosContainer.get<DepartamentosUseCases>(DEPARTAMENTOS_IOC_TYPES.DepartamentosUseCases);

const PERFILES = ['Médico o salud', 'Rescatista / USAR', 'Transporte / logística', 'Psicosocial', 'Traducción', 'Otro'];

const COORDINAN = [
  { nombre: 'Cruz Roja Colombiana', detalle: 'Salud, albergues y ayuda humanitaria' },
  { nombre: 'Bomberos', detalle: 'Rescate urbano, solo personal certificado' },
  { nombre: 'Alcaldías y gobernaciones', detalle: 'Logística, censo y puntos de acopio' },
];

export const Voluntariado: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { estado, error } = useSelector(selectVoluntariado);
  const departamentos = departamentosUseCases.listarTodos();
  const [perfil, setPerfil] = useState(PERFILES[0]);
  const [departamento, setDepartamento] = useState(departamentos[0]?.id ?? '');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    dispatch(
      registrarVoluntarioRequest({
        perfil,
        departamento,
        disponibilidad: form.get('disponibilidad'),
        contacto: form.get('contacto'),
        nombre: form.get('nombre'),
      })
    );
  }

  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Ofrecer ayuda</h1>
        <p className="sub">
          No te desplaces a la zona sin ser convocado. El registro permite que las entidades te contacten cuando
          haya un cupo real. La coordinación oficial la lideran Cruz Roja, Bomberos y las alcaldías.
        </p>
      </div>

      {estado === 'exito' ? (
        <section className="seccion" role="status">
          <div style={{ borderLeft: '5px solid var(--operativo)', background: 'var(--fondo-2)', padding: 16 }}>
            <h2>Disponibilidad registrada</h2>
            <p style={{ fontSize: 15 }}>Te contactarán solo si se abre un cupo para tu perfil. Mientras tanto, no te desplaces a la zona.</p>
          </div>
        </section>
      ) : (
        <form className="seccion" onSubmit={handleSubmit}>
          <label className="etiqueta-campo" htmlFor="nombre" style={{ marginTop: 0 }}>Nombre</label>
          <input id="nombre" name="nombre" className="campo" required />

          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend className="etiqueta-campo">Tipo de ayuda que puedes ofrecer</legend>
            <div className="rejilla-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {PERFILES.map((p) => (
                <label key={p} className={'opcion' + (perfil === p ? ' activa' : '')}>
                  <input type="radio" name="perfil" value={p} checked={perfil === p} onChange={() => setPerfil(p)} /> {p}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="etiqueta-campo" htmlFor="departamento">Departamento donde puedes ayudar</label>
          <select id="departamento" name="departamento" className="campo" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
            {departamentos.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>

          <label className="etiqueta-campo" htmlFor="disponibilidad">Disponibilidad</label>
          <input id="disponibilidad" name="disponibilidad" className="campo" placeholder="Ej: fines de semana, tiempo completo esta semana…" />

          <label className="etiqueta-campo" htmlFor="contacto">Contacto</label>
          <input id="contacto" name="contacto" className="campo" required placeholder="Teléfono o correo" />

          {!isFirebaseConfigured && (
            <p className="nota" style={{ marginTop: 14, border: '1px solid var(--evaluacion)', background: 'var(--evaluacion-suave)', color: 'var(--tinta)', padding: 10 }}>
              Este formulario aún no está conectado a la base de datos del proyecto (falta configurar Firebase). Ver README.md para activarlo.
            </p>
          )}

          {estado === 'error' && (
            <p style={{ color: 'var(--critico)', fontWeight: 600, fontSize: 15, marginTop: 12 }}>No se pudo enviar: {error}</p>
          )}

          <button type="submit" disabled={estado === 'enviando'} className="boton principal" style={{ marginTop: 16 }}>
            {estado === 'enviando' ? 'Enviando…' : 'Registrar disponibilidad'}
          </button>
        </form>
      )}

      <section className="seccion">
        <h2 className="rotulo">Quién coordina voluntarios</h2>
        <table>
          <tbody>
            {COORDINAN.map((c) => (
              <tr key={c.nombre}>
                <td>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{c.nombre}</div>
                  <div style={{ fontSize: 14, color: 'var(--tinta-3)' }}>{c.detalle}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};
