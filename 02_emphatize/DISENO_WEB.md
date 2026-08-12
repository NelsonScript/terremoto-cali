# Diseño de la Web y Tipo de Solución Propuesta

> Complementa a `IDEA_PROYECTO.md`. Aquí se define **qué tipo de web es**, su **arquitectura de información**, el **mapa del sitio** y el diseño de cada módulo a nivel de wireframe descriptivo (no visual).

---

## 1. Tipo de web propuesta

**Hub de información y utilidad de crisis (Crisis Information Hub)**, construido como:

- **PWA (Progressive Web App) estática** — instalable en el celular, funciona con conexión pobre gracias a *service worker* y contenido pre-generado (Static Site Generation).
- **Content-driven / data-driven**: el contenido vive en archivos de datos (JSON/MD) desacoplados del código, para que se pueda actualizar sin recompilar toda la lógica y sea editable por perfiles no técnicos vía Pull Request.
- **No es una red social ni un foro**: es una herramienta de consulta + acción rápida (donar, reportar, ubicar). Se evita cualquier funcionalidad que requiera moderación compleja de contenido generado por usuarios.
- **Regional por diseño, con jerarquía departamento → municipio**: no es un sitio genérico de "terremoto Colombia", sino un sitio que segmenta la realidad de cada departamento afectado (Valle del Cauca, Risaralda, Chocó, Caldas, y con menor detalle Quindío, Antioquia, Tolima) y, dentro de cada uno, de sus municipios — porque el discovery muestra que cada territorio tiene necesidades distintas (rescate urbano en Cali vs. aislamiento logístico en Chocó rural vs. saturación hospitalaria en Risaralda vs. quiebre de cadena de medicamentos en Caldas), y que los balances centrados solo en capitales subestiman el daño rural.

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
6. **Segmentado por departamento y municipio, no genérico.** El usuario elige su departamento (y dentro de él, su municipio) y ve solo lo relevante para él.
7. **Anti-desinformación explícito.** Alertas visuales (banner) contra estafas de donación en cada página relacionada con dinero/ayuda.
8. **Mobile-first real.** >90% del tráfico esperado es móvil en zona de desastre; desktop es secundario.

---

## 3. Mapa del sitio (Sitemap)

```
/                            Home — tablero comparativo nacional + accesos directos
/departamentos               Índice de los 7 departamentos afectados (tabla comparativa)
/departamentos/[depto]       Detalle: cifras capital + UNGRD, situación, tabla de municipios
/salud                       Estado de la red hospitalaria (departamentos con diagnóstico detallado)
/albergues                   Directorio de albergues y puntos de acopio (agregado por departamento)
/donar                       Guía de donación (qué, dónde, cómo evitar estafas) + acopio en Bogotá
/reportar                    Formulario de reporte (desaparecido / riesgo / necesidad médica)
/voluntariado                Cómo ofrecer ayuda (rescate, salud, logística, transporte)
/lineas-de-emergencia         Directorio de teléfonos y canales oficiales
/tramites                    Guía ADRES y otros trámites de indemnización
/apoyo-privado               Matriz de cooperación internacional / sector privado / interinstitucional
/fuentes                     Transparencia: metodología y fuentes oficiales
```

Departamentos con diagnóstico completo (municipios, necesidades, situación): **Valle del Cauca, Risaralda, Chocó, Caldas**. Departamentos con afectación menor reportada (solo cifras agregadas de UNGRD, sin desglose municipal aún): **Quindío, Antioquia, Tolima** — se amplían a medida que llegue más investigación a `00_discovery`.

Navegación persistente (header/footer o barra inferior móvil) con 4 accesos fijos: **Donar · Albergues · Reportar · Líneas de emergencia** — son las cuatro acciones más urgentes identificadas en el discovery.

---

## 4. Wireframes descriptivos por módulo

### 4.1 Home (`/`)

**Decisión de diseño — patrón elegido: tablero comparativo (mockup "1c").**
Se evaluaron 3 direcciones para el home: (1a) ficha oficial única estilo
gov.uk, con cifras apiladas a ancho completo; (1b) "acción primero", con
las 4 acciones críticas ocupando la pantalla inicial; (1c) tablero
comparativo con las cifras de varias ciudades/departamentos y su estado
semántico. Se eligió **1c** porque, al pasar el alcance de "4 ciudades" a
"7 departamentos con decenas de municipios", el home necesita resolver una
pregunta distinta a la de una sola zona: *"¿cuál de estos territorios está
peor y a cuál me interesa entrar?"* — algo que solo el patrón comparativo
resuelve bien. 1a y 1b siguen siendo la referencia correcta para páginas
de un solo lugar (el detalle de un departamento, ver 4.2).

1. **Banner superior fijo**: "Sismo 7,4 — 10 ago 2026. Última actualización: [fecha/hora]."
2. **Bloque de cifras nacionales duales**: fallecidos confirmados en centros urbanos (Asocapitales) y fallecidos según gobernaciones (UNGRD, preliminar y en aumento) mostrados **por separado, nunca sumados**, con una nota explicando por qué difieren — más heridos a nivel nacional.
3. **4 botones grandes de acción**: Donar / Albergues / Reportar / Líneas de emergencia.
4. **Tablero comparativo de departamentos** (patrón 1c): tabla con nombre, fallecidos, resumen de una línea y estado semántico (crítico / en evaluación / sin datos), separando primero los 4 departamentos con diagnóstico detallado y luego los 3 con solo cifras UNGRD.
5. **Banner anti-estafa**: "Toda ayuda económica solo a través de la Cruz Roja Colombiana."
6. **Footer**: fuentes oficiales, última actualización general, enlace a `/fuentes`.

### 4.2 Departamento (`/departamentos/[depto]`)
- Encabezado con nombre del departamento y su capital.
- **Cifras de la capital** (fuente: alcaldía/Asocapitales) y **cifras departamentales UNGRD** mostradas en bloques separados — nunca sumadas cuando hay ambigüedad entre fuentes sobre si una incluye a la otra (caso documentado: Valle del Cauca).
- Bloque "Qué necesita este departamento ahora" (ej. Valle: agua/cascos/colchonetas; Chocó: sangre y kits de higiene; Risaralda: refuerzo médico; Caldas: medicamentos).
- Bloque de situación vigente (operaciones USAR, medidas, aislamiento, red hospitalaria).
- **Tabla de municipios** (patrón 1c, reutilizado a menor escala) con buscador — hoy lista 1 a 5 municipios por departamento, pensada para escalar a los ~40 que puede tener un departamento como Valle del Cauca.
- Enlaces directos a `/salud`, `/albergues`, `/donar`.

### 4.3 Salud (`/salud`)
- Tabla por ciudad: instituciones con daño grave/evacuadas vs. en evaluación/saturadas.
- Bloque destacado de necesidades urgentes puntuales (ej. donación de sangre IDCBIS en Quibdó).
- Nota de metodología y fecha de corte.

### 4.4 Albergues (`/albergues`)
- Lista agregada automáticamente desde los datos de cada departamento: nombre, tipo (albergue / punto de acopio), departamento.
- Botón "cómo llegar" (enlace a mapa externo, sin embeber mapas pesados por rendimiento) — pendiente de dirección exacta por punto.

### 4.5 Donar (`/donar`)
- Alerta anti-estafa en la parte superior (no al final).
- Lista de insumos requeridos **por departamento**, no genérica (evita que alguien lleve algo que ya no se necesita).
- Puntos de acopio oficiales con dirección, incluyendo centros de acopio fuera de la zona de desastre (Cruz Roja en Bogotá) para quienes quieren donar desde otra ciudad.
- Explicación clara: donaciones en dinero → solo Cruz Roja Colombiana (con el canal oficial).

### 4.6 Reportar (`/reportar`)
- Formulario corto: tipo de reporte (persona atrapada/desaparecida, edificio en riesgo, necesidad médica urgente), departamento, municipio, descripción, contacto opcional, ubicación opcional.
- Mensaje explícito: "Si es una emergencia de vida en riesgo, llama primero a 119 (Bomberos) o 123 (Policía). Este formulario complementa, no reemplaza, la llamada."
- Al enviar: confirmación + repetición de las líneas oficiales según el tipo de reporte.

### 4.7 Voluntariado (`/voluntariado`)
- Formulario simple: tipo de perfil (médico, rescatista, transporte, logística, otro), departamento disponible, contacto.
- Bloque informativo de organizaciones que ya coordinan voluntarios (Cruz Roja, Bomberos, Alcaldía).

### 4.8 Líneas de emergencia (`/lineas-de-emergencia`)
- Tabla simple y grande: 119 Bomberos, 123 Policía, 106 Salud mental, Cruz Roja — Protección de Vínculos Familiares (PVF).
- Diseñada para leerse en 3 segundos.

### 4.9 Trámites (`/tramites`)
- Explicación de cobertura ADRES (qué sí / qué no) en lenguaje simple.
- Pasos para reclamar, documentos necesarios, enlaces oficiales.

### 4.10 Apoyo privado (`/apoyo-privado`)
- Matriz agrupada en 3 categorías — cooperación internacional (EE. UU., El Salvador), sector privado (Starlink, FC Barcelona, Grupo Gilinski, Nutresa, Tiendas Ara, Éxito/Olímpica, etc.) e interinstitucional (Alcaldía de Bogotá) — como reconocimiento y para incentivar más apoyo.

### 4.11 Fuentes (`/fuentes`)
- Listado de fuentes oficiales (Evaluación Multisectorial de Necesidades Humanitarias, UNGRD, Asocapitales, Alcaldía de Cali, Secretaría de Salud, Cruz Roja) y metodología de actualización de datos del sitio.

---

## 5. Sistema visual (lineamientos, no marca final)

### 5.1 Estilo de diseño

**Utilitario de confianza institucional** — lo opuesto a una estética de
"hype" o startup. El objetivo de esta web no es impresionar ni vender: es
que alguien en shock, con mal internet y en el celular, encuentre el dato
correcto en segundos y confíe en él. Por eso el estilo se define por
oposición: cada decisión visual prioriza claridad y credibilidad sobre
personalidad de marca.

**Referencias de estilo:** gov.uk, USA.gov, el Google Crisis Response, o
las páginas de emergencia de la Cruz Roja — no Airbnb, no un SaaS, no un
portafolio creativo. Diseño que se siente oficial, calmado y funcional,
no promocional.

| Atributo | Dirección |
|---|---|
| **Color** | Paleta semántica de alerta (rojo = crítico, ámbar = en evaluación/saturado, verde = operativo/resuelto) sobre fondo neutro de altísimo contraste. Nada de gradientes ni colores "de marca" decorativos que compitan con el significado del color — aquí el color comunica estado, no personalidad. |
| **Tipografía** | Fuente del sistema (system-ui). Tamaños grandes y muy legibles, pensados para alguien leyendo con estrés o con la pantalla rota. Jerarquía tipográfica marcada (títulos grandes, cifras clave aún más grandes) en vez de sutileza tipográfica. |
| **Layout** | Denso pero escaneable: tarjetas, tablas simples, blanco funcional (no decorativo). Lo crítico siempre arriba y a un tap de distancia. Cero scroll infinito, cero "hero section" cinematográfico. |
| **Imágenes / iconografía** | Iconos funcionales mínimos. Cero fotografía de stock o ilustraciones "bonitas" — cada elemento visual debe cargar rápido y aportar información, no ambiente. |
| **Movimiento** | Prácticamente ninguna animación. Sin scroll-reveal, parallax ni transiciones vistosas — cuestan datos y batería, que es justo lo que puede no sobrar en la zona del sismo. |
| **Tono general** | Autoridad calmada, no alarmismo. El diseño debe transmitir "esto es serio y confiable", no "esto es urgente y emocionante" — la situación ya es suficientemente intensa; el diseño no necesita subrayarlo. |

**Qué evitar explícitamente:** glassmorphism, gradientes decorativos,
video de fondo, animaciones de scroll, ilustraciones o stock photos,
dark patterns, cualquier elemento que compita por atención con las
acciones críticas (donar, reportar, llamar).

> **Brief listo para copiar/pegar en una herramienta de diseño (ej. Claude Design):**
> "Diseña un sitio de utilidad pública para una respuesta a un
> terremoto, estilo utilitario de confianza institucional (referencia:
> gov.uk, Google Crisis Response, Cruz Roja) — no estética de startup.
> Paleta semántica de alerta (rojo/ámbar/verde) sobre fondo neutro de
> alto contraste. Tipografía de sistema, tamaños grandes y muy legibles.
> Layout denso pero escaneable, con las acciones críticas (donar,
> reportar, líneas de emergencia) siempre a un tap de distancia. Cero
> imágenes decorativas, cero animaciones, cero elementos que compitan
> por atención con la información crítica. Tono: autoridad calmada, no
> alarmismo."

### 5.2 Elementos reutilizables

- **Paleta**: colores de alerta institucional (rojo/naranja para estado crítico, verde para "operativo", gris para "en evaluación"), fondo neutro de alto contraste.
- **Tipografía**: fuente del sistema (system-ui) para minimizar peso de carga.
- **Componentes reutilizables**: `TarjetaCifra`, `TablaEstadoHospitales`, `TarjetaAlbergue`, `BannerAlerta`, `SelectorZona`, `LineaEmergencia`.
- **Iconografía**: mínima, solo funcional (no decorativa) para no penalizar el peso de página.

---

## 6. Contenido como dato (Content Model resumido)

Todo el contenido dinámico vive en `src/data/*.json` dentro del proyecto Next.js, para permitir actualizaciones vía PR sin tocar componentes:

- `data/departamentos.json` — jerarquía departamento → municipios: cifras de la capital, cifras departamentales UNGRD (con nota de ambigüedad cuando aplica), situación, necesidades, municipios, albergues y puntos de acopio. Es el archivo central del sitio.
- `data/meta.json` — datos generales del evento y las cifras nacionales duales (confirmadas vs. preliminares).
- `data/hospitales.json` — estado de instituciones de salud por ciudad.
- `data/lineas.json` — líneas de emergencia.
- `data/apoyo-privado.json` — matriz de apoyo externo (internacional / privado / interinstitucional).
- `data/acopio-bogota.json` — centros de acopio en Bogotá para donantes fuera de la zona de desastre.
- `data/fuentes.json` — fuentes oficiales citadas.

Los albergues y puntos de acopio ya **no** viven en un archivo aparte: se agregan automáticamente a partir de `departamentos.json` para evitar que los mismos datos se dupliquen (y se desincronicen) en dos archivos.

Este modelo se detalla técnicamente en `03_architecture/ARQUITECTURA.md` y se implementa en `01_run/dev`.
