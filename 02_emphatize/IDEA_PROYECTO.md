# Idea del Proyecto: Plataforma de Respuesta Terremoto Suroccidente 2026

> **Nombre de trabajo:** *Ayuda Suroccidente* (a definir marca final — reemplaza el nombre de trabajo anterior, *Ayuda Cali*, tras ampliar el alcance a los departamentos afectados)
> **Origen:** Síntesis de `00_discovery/afectacion_departamental.md` y `Evaluación_Multisectorial_de_Necesidades_Humanitarias.md` (versión departamental, reemplaza los documentos iniciales centrados solo en Cali)
> **Fecha de redacción:** 11 de agosto de 2026 (día siguiente al sismo de magnitud 7,4 con epicentro en San José del Palmar, Chocó) · actualizado 12 de agosto de 2026 al ampliar el alcance geográfico

---

## 1. Problema a resolver

El sismo del 10 de agosto de 2026 generó una crisis humanitaria multidepartamental que afecta con distinta severidad a **Valle del Cauca, Risaralda, Chocó, Caldas, Quindío, Antioquia y Tolima**, con **181 fallecidos confirmados en centros urbanos (Asocapitales)** y **hasta 224 según reportes preliminares de las gobernaciones (UNGRD)** — dos cifras oficiales distintas que no coinciden porque miden cosas distintas (ciudades capitales vs. todo el territorio, incluidas zonas rurales aún sin evaluación completa). Solo en Valle del Cauca hay **165 fallecidos combinados entre Cali y el resto del departamento**, y la red hospitalaria de varias capitales opera en Alerta Roja. La información oficial está dispersa entre alcaldías, gobernaciones, UNGRD, Asocapitales, Cruz Roja y medios, **y las propias fuentes oficiales se contradicen entre sí** (ver el caso real documentado en `03_architecture` y en los datos de Risaralda, donde el total departamental de heridos reportado por UNGRD es menor a los heridos reportados solo en su capital). Esto genera cuatro fricciones críticas:

1. **Fragmentación de la información**: no existe un punto único, verificado y actualizado donde ciudadanos, voluntarios y organismos puedan consultar el estado real de la emergencia por departamento y municipio.
2. **Cifras contradictorias entre fuentes oficiales**: distintos organismos (Asocapitales, UNGRD, alcaldías) miden y reportan de forma diferente, y publicarlas sin contexto genera desconfianza o decisiones mal informadas.
3. **Riesgo de desinformación y estafa**: las autoridades han tenido que aclarar reiteradamente que las donaciones económicas deben canalizarse *solo* por la Cruz Roja Colombiana, señal de que ya circulan intentos de fraude.
4. **Fricción operativa**: las personas no saben qué donar, dónde ir, a quién reportar un desaparecido o un edificio en riesgo, ni cómo pedir ayuda médica (sangre en Quibdó, medicamentos en Caldas, traslados, salud mental) — y esto varía mucho de un departamento a otro.

## 2. Propuesta de valor

Una web ligera, rápida (importante con telecomunicaciones caídas en varias zonas), **gratuita de operar**, que centralice y verifique la información crítica de la emergencia a nivel **departamento → municipio**, y **agilice procesos** (reportar, donar, ubicar albergues, encontrar líneas de emergencia) en vez de solo informar pasivamente. Cuando dos fuentes oficiales se contradicen, el sitio no elige una arbitrariamente: muestra ambas, con su fuente, y explica por qué difieren.

---

## 3. AS-IS — Situación actual (sin la herramienta)

- La información vive repartida en comunicados de prensa, redes sociales de alcaldías/gobernaciones/Cruz Roja, notas de medios y reportes técnicos (Asocapitales, UNGRD) que **no siempre coinciden entre sí, incluso dentro del mismo informe consolidado**.
- No hay un directorio único de albergues, puntos de acopio o líneas de emergencia por departamento.
- No hay forma digital sencilla de reportar una persona atrapada/desaparecida, un edificio en riesgo o necesidad médica urgente (p. ej. sangre en Quibdó) que llegue a quien coordina.
- Las empresas y ciudadanos que quieren donar no tienen claridad de qué se necesita *ahora mismo* por departamento (en Cali ya no se necesita ropa, se necesita agua/cascos/colchonetas; en Caldas se necesitan medicamentos por la caída de Disfarma) ni cómo evitar fraudes.
- Cada departamento afectado tiene una realidad distinta (rescate urbano en Valle, aislamiento logístico en Chocó rural, saturación hospitalaria en Risaralda, ruptura de cadena de medicamentos en Caldas) pero se comunica de forma genérica.
- Los balances municipales previos, al enfocarse solo en las capitales, **subestiman sistemáticamente el daño en zonas rurales** — el propio UNGRD señala este sesgo como motivo de su nuevo consolidado departamental.
- No existe trazabilidad de qué tan reciente es un dato ("¿esto es de hace 2 horas o de ayer?") ni de qué fuente lo respalda.

## 4. TO_BE — Visión objetivo

Una **plataforma web de utilidad pública (hub de crisis)**, mobile-first, accesible con conexión lenta/intermitente, con estas capacidades:

### 4.1 Información verificada y viva, con jerarquía departamento → municipio
- **Tablero comparativo nacional** (home): los departamentos afectados con su estado semántico (crítico / en evaluación / sin datos) de un vistazo — validado con el mockup **1c** frente a dos alternativas (ficha única estilo gov.uk y "acción primero"); se eligió 1c porque es el único patrón pensado para comparar varias unidades geográficas a la vez, que es justamente lo que exige pasar de "4 ciudades" a "7 departamentos con decenas de municipios".
- **Página por departamento** con cifras de su capital, cifras departamentales agregadas (UNGRD) y una **tabla de municipios** con buscador — pensada para escalar de los ~5 municipios documentados hoy a los ~40+ que tiene un departamento como Valle del Cauca.
- **Nunca se fusionan cifras ambiguas de dos fuentes en un solo número**: cuando una fuente dice "adicional a la capital" y otra la trata como total departamental (caso real: Valle del Cauca), se muestran ambas por separado con una nota explícita, en vez de sumar y arriesgar una cifra incorrecta.
- Estado en vivo (o casi vivo) de la red hospitalaria: qué IPS están evacuadas, cuáles saturadas, cuáles operando.

### 4.2 Herramientas de agilización de procesos
- **Reporte ciudadano**: formulario con departamento + municipio, tipo de reporte (persona atrapada/desaparecida, edificio en riesgo, necesidad médica urgente), que llega a un canal accionable (no se resuelve dentro de la web, pero enruta correctamente: 119, 123, 106).
- **Guía de donación inteligente**: qué se necesita *hoy* por departamento, dónde llevarlo (incluye puntos de acopio fuera de la zona de desastre, como los de Cruz Roja en Bogotá), y alerta explícita anti-estafa (solo Cruz Roja para dinero).
- **Directorio de albergues y puntos de acopio**, agregado automáticamente desde los datos de cada departamento.
- **Líneas de emergencia** siempre visibles/accesibles (119 Bomberos, 123 Policía, 106 salud mental, Cruz Roja PVF — Protección de Vínculos Familiares).
- **Módulo de voluntariado**: cómo ofrecer ayuda, con departamento de disponibilidad.
- **Transparencia y trámites**: guía clara de qué cubre ADRES y enlaces a fuentes oficiales.

### 4.3 Principios de diseño técnico
- **Offline-first / bajo consumo de datos**: la web debe cargar en 2G/3G y funcionar aunque el usuario pierda señal a medias.
- **Actualizable sin developer**: el contenido (departamentos, municipios, hospitales, necesidades) se gestiona en `src/data/*.json` versionados, editable vía Pull Request sin tocar componentes.
- **Costo operativo $0**: stack 100% en capas gratuitas (GitHub, GitHub Actions, Firebase Hosting Spark, Cloudflare Free).
- **Multilenguaje-ready** (futuro): español como base, posibilidad de inglés para cooperación internacional (Starlink, gobierno de EE. UU., El Salvador).
- **Confiable**: cada dato muestra su fuente y timestamp; se prioriza no publicar cifras sin respaldo — y cuando dos fuentes oficiales se contradicen, se muestran ambas en vez de elegir una.

---

## 5. TO_DO — Backlog priorizado

### Fase 0 — Fundacional
- [x] Estructura de datos base (`src/data/*.json`): departamentos → municipios, hospitales, líneas de emergencia, apoyo externo, fuentes.
- [x] Página de inicio con tablero comparativo departamental + acceso directo a los 4 módulos críticos (Donar / Albergues / Reportar / Líneas de emergencia).
- [x] Página "Fuentes y metodología" (transparencia de dónde sale cada dato).
- [ ] Definir nombre/dominio final del proyecto y repositorio en GitHub (pendiente de decisión del usuario).
- [ ] Deploy inicial a Firebase Hosting vía GitHub Actions (pendiente de crear el proyecto real de Firebase — ver `01_run/dev/README.md`).

### Fase 1 — Módulos de utilidad
- [x] Página índice de departamentos + página de detalle por departamento (cifras capital, cifras UNGRD, situación, municipios, necesidades).
- [x] Estado de red hospitalaria (tabla dinámica desde `data/hospitales.json`).
- [x] Directorio de albergues y puntos de acopio (agregado desde cada departamento).
- [x] Guía de donación con alerta anti-estafa destacada + centros de acopio en Bogotá.
- [x] Formulario de reporte (desaparecido / edificio en riesgo / necesidad médica) con departamento y municipio, listo para conectar a Firestore.
- [ ] Ampliar `municipios` de cada departamento a medida que llegue más investigación de `00_discovery` (hoy solo hay 4-5 municipios documentados por departamento prioritario).

### Fase 2 — Comunidad y voluntariado
- [x] Módulo de voluntariado (registro de interés + tipo de ayuda + departamento).
- [x] Matriz de apoyo externo, separada en cooperación internacional / sector privado / interinstitucional.
- [x] Sección ADRES / trámites (qué cubre, cómo reclamar).

### Fase 3 — Robustez y escala
- [ ] Panel de administración simple (o flujo de PR + revisión) para actualizar datos sin fricción.
- [ ] Monitoreo/alertas de caída del sitio (ver `04_monitoring`).
- [ ] Analítica ligera y gratuita (p. ej. Cloudflare Web Analytics) para saber qué módulos se usan más y priorizar.
- [ ] Revisión de accesibilidad (WCAG AA) y prueba en dispositivos de gama baja.
- [ ] Traducción a inglés para cooperación internacional.
- [ ] Páginas individuales por municipio si el volumen de datos lo justifica (hoy la tabla dentro de cada departamento es suficiente).

### Backlog / ideas a validar
- [ ] Integración con mapa por departamento/municipio.
- [ ] Botón de "compartir estado" tipo tarjeta para redes sociales con el dato verificado del día.
- [ ] Modo texto plano / AMP-like para conexiones muy lentas.

---

## 6. Fuera de alcance (por ahora)
- Procesamiento de pagos/donaciones dentro de la web (se canaliza explícitamente a Cruz Roja Colombiana).
- Verificación en tiempo real automatizada (el equipo humano cura y publica los datos).
- App nativa móvil (se prioriza web responsive instalable como PWA).
- Reconciliar matemáticamente cifras de fuentes que se contradicen (se muestran ambas con su fuente en vez de "corregirlas").
