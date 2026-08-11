# Diseño de la Web y Tipo de Solución Propuesta

> Complementa a `IDEA_PROYECTO.md`. Aquí se define **qué tipo de web es**, su **arquitectura de información**, el **mapa del sitio** y el diseño de cada módulo a nivel de wireframe descriptivo (no visual).

---

## 1. Tipo de web propuesta

**Hub de información y utilidad de crisis (Crisis Information Hub)**, construido como:

- **PWA (Progressive Web App) estática** — instalable en el celular, funciona con conexión pobre gracias a *service worker* y contenido pre-generado (Static Site Generation).
- **Content-driven / data-driven**: el contenido vive en archivos de datos (JSON/MD) desacoplados del código, para que se pueda actualizar sin recompilar toda la lógica y sea editable por perfiles no técnicos vía Pull Request.
- **No es una red social ni un foro**: es una herramienta de consulta + acción rápida (donar, reportar, ubicar). Se evita cualquier funcionalidad que requiera moderación compleja de contenido generado por usuarios.
- **Multi-zona por diseño**: no es un sitio genérico de "terremoto Colombia", sino un sitio que segmenta la realidad de Cali, Chocó/Quibdó, Pereira y Manizales, porque el discovery muestra que cada ciudad tiene necesidades distintas (rescate urbano vs. aislamiento logístico vs. saturación hospitalaria vs. quiebre de cadena de medicamentos).

### Por qué esta elección (y no otras)
| Alternativa considerada | Por qué se descarta |
|---|---|
| Blog / noticias tradicional | No agiliza procesos, solo informa; no resuelve "qué hago ahora" |
| App nativa (iOS/Android) | Costo/tiempo de desarrollo y distribución incompatibles con la urgencia y el presupuesto $0 |
| Dashboard tipo BI (Looker/PowerBI embebido) | Depende de fuentes de datos en tiempo real que no existen aún; poco accionable para el ciudadano de a pie |
| Formulario suelto (Google Form) sin sitio | No centraliza ni da contexto ni credibilidad; no sirve como "fuente única de verdad" |

---

## 2. Principios de diseño (UX)

1. **Lo crítico arriba, siempre.** Líneas de emergencia y "cómo ayudar / cómo pido ayuda" visibles desde el primer scroll en cualquier página.
2. **Cero fricción para actuar.** Máximo 2 taps para llegar a "dónde dono", "dónde reporto" o "a quién llamo".
3. **Confianza por transparencia.** Cada cifra muestra fuente + fecha/hora de corte. Nunca se muestra un número "pelado" sin trazabilidad.
4. **Diseño para conexión mala.** Peso de página objetivo < 150 KB por vista (sin imágenes pesadas), tipografía del sistema, imágenes optimizadas/lazy, modo lectura ligera.
5. **Accesible primero.** Contraste AA, tap targets ≥ 44px, funciona sin JavaScript para el contenido esencial (SSG puro), soporta lectores de pantalla.
6. **Segmentado por zona, no genérico.** El usuario elige/detecta su ciudad y ve solo lo relevante para él.
7. **Anti-desinformación explícito.** Alertas visuales (banner) contra estafas de donación en cada página relacionada con dinero/ayuda.
8. **Mobile-first real.** >90% del tráfico esperado es móvil en zona de desastre; desktop es secundario.

---

## 3. Mapa del sitio (Sitemap)

```
/                          Home — resumen de la emergencia + accesos directos
/zonas                     Selector de zona
/zonas/cali                Info específica de Cali
/zonas/choco               Info específica de Chocó (Quibdó)
/zonas/pereira              Info específica de Pereira
/zonas/manizales            Info específica de Manizales
/salud                     Estado de la red hospitalaria (todas las zonas)
/albergues                 Directorio de albergues y puntos de acopio
/donar                     Guía de donación (qué, dónde, cómo evitar estafas)
/reportar                  Formulario de reporte (desaparecido / riesgo / necesidad médica)
/voluntariado              Cómo ofrecer ayuda (rescate, salud, logística, transporte)
/lineas-de-emergencia       Directorio de teléfonos y canales oficiales
/tramites                  Guía ADRES y otros trámites de indemnización
/apoyo-privado             Matriz de empresas/organizaciones que están ayudando
/fuentes                   Transparencia: metodología y fuentes oficiales
```

Navegación persistente (header/footer o barra inferior móvil) con 4 accesos fijos: **Donar · Albergues · Reportar · Líneas de emergencia** — son las cuatro acciones más urgentes identificadas en el discovery.

---

## 4. Wireframes descriptivos por módulo

### 4.1 Home (`/`)
1. **Banner superior fijo**: "Sismo 7,4 — 10 ago 2026. Última actualización: [fecha/hora]." + selector de zona.
2. **Fila de cifras clave** (tarjetas): fallecidos, heridos, desaparecidos, rescatados — con fuente/hora debajo de cada una.
3. **4 botones grandes de acción**: Donar / Ver albergues / Reportar algo / Líneas de emergencia.
4. **Selector de zona** (Cali, Chocó, Pereira, Manizales) con 1 línea de "qué está pasando ahí ahora mismo".
5. **Banner anti-estafa**: "Toda ayuda económica solo a través de la Cruz Roja Colombiana."
6. **Footer**: fuentes oficiales, última actualización general, enlace a `/fuentes`.

### 4.2 Zona (`/zonas/[zona]`)
- Encabezado con nombre de zona + cifras propias (fallecidos, edificaciones colapsadas, etc.).
- Bloque "Qué necesita esta zona ahora" (ej. Cali: agua/cascos/colchonetas; Quibdó: sangre y kits de higiene; Pereira: refuerzo médico; Manizales: medicamentos).
- Bloque de medidas vigentes (toque de queda, movilidad, censos).
- Enlaces directos a `/salud`, `/albergues`, `/donar` filtrados por esa zona.

### 4.3 Salud (`/salud`)
- Tabla por ciudad: instituciones con daño grave/evacuadas vs. en evaluación/saturadas (según `ANALISIS_DEL_IMPACTO_HOSPITALARIO.md`).
- Bloque destacado de necesidades urgentes puntuales (ej. donación de sangre IDCBIS en Quibdó).
- Nota de metodología y fecha de corte.

### 4.4 Albergues (`/albergues`)
- Lista filtrable por zona: nombre, dirección, tipo (albergue / punto de acopio), estado.
- Botón "cómo llegar" (enlace a mapa externo, sin embeber mapas pesados por rendimiento).

### 4.5 Donar (`/donar`)
- Alerta anti-estafa en la parte superior (no al final).
- Lista de insumos requeridos **por zona**, no genérica (evita que alguien lleve algo que ya no se necesita).
- Puntos de acopio oficiales con dirección.
- Explicación clara: donaciones en dinero → solo Cruz Roja Colombiana (con el canal oficial).

### 4.6 Reportar (`/reportar`)
- Formulario corto: tipo de reporte (persona atrapada/desaparecida, edificio en riesgo, necesidad médica urgente), zona, descripción, contacto opcional, ubicación opcional.
- Mensaje explícito: "Si es una emergencia de vida en riesgo, llama primero a 119 (Bomberos) o 123 (Policía). Este formulario complementa, no reemplaza, la llamada."
- Al enviar: confirmación + repetición de las líneas oficiales según el tipo de reporte.

### 4.7 Voluntariado (`/voluntariado`)
- Formulario simple: tipo de perfil (médico, rescatista, transporte, logística, otro), zona disponible, contacto.
- Bloque informativo de organizaciones que ya coordinan voluntarios (Cruz Roja, Bomberos, Alcaldía).

### 4.8 Líneas de emergencia (`/lineas-de-emergencia`)
- Tabla simple y grande: 119 Bomberos, 123 Policía, 106 Salud mental, Cruz Roja PVF (restablecimiento de contacto familiar), líneas municipales por ciudad.
- Diseñada para leerse en 3 segundos.

### 4.9 Trámites (`/tramites`)
- Explicación de cobertura ADRES (qué sí / qué no) en lenguaje simple.
- Pasos para reclamar, documentos necesarios, enlaces oficiales.

### 4.10 Apoyo privado (`/apoyo-privado`)
- Matriz de empresas/organizaciones y su aporte (Starlink, FC Barcelona, Tiendas Ara, Grupo Éxito, Fundación Olímpica, Nutresa/Grupo Gilinski, Alcaldía de Bogotá, etc.), como reconocimiento y para incentivar más apoyo.

### 4.11 Fuentes (`/fuentes`)
- Listado de fuentes oficiales (Alcaldía de Cali, Asocapitales, Secretaría de Salud, Cruz Roja) y metodología de actualización de datos del sitio.

---

## 5. Sistema visual (lineamientos, no marca final)

- **Paleta**: colores de alerta institucional (rojo/naranja para estado crítico, verde para "operativo", gris para "en evaluación"), fondo neutro de alto contraste.
- **Tipografía**: fuente del sistema (system-ui) para minimizar peso de carga.
- **Componentes reutilizables**: `TarjetaCifra`, `TablaEstadoHospitales`, `TarjetaAlbergue`, `BannerAlerta`, `SelectorZona`, `LineaEmergencia`.
- **Iconografía**: mínima, solo funcional (no decorativa) para no penalizar el peso de página.

---

## 6. Contenido como dato (Content Model resumido)

Todo el contenido dinámico vive en `data/*.json` dentro del proyecto Next.js, para permitir actualizaciones vía PR sin tocar componentes:

- `data/cifras.json` — cifras clave por zona y fecha de corte.
- `data/hospitales.json` — estado de instituciones de salud por ciudad.
- `data/albergues.json` — albergues y puntos de acopio.
- `data/necesidades.json` — qué se necesita por zona.
- `data/lineas.json` — líneas de emergencia.
- `data/apoyo-privado.json` — matriz de empresas/aportes.
- `data/fuentes.json` — fuentes oficiales citadas.

Este modelo se detalla técnicamente en `03_architecture/ARQUITECTURA.md` y se implementa en `01_run/dev`.
