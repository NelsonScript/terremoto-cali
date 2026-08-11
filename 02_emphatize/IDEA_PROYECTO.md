# Idea del Proyecto: Plataforma de Respuesta Terremoto Cali 2026

> **Nombre de trabajo:** *Ayuda Cali* (a definir marca final)
> **Origen:** Síntesis de `00_discovery/ABSTRACT.md`, `ANALISIS_DEL_IMPACTO_HOSPITALARIO.md` y `Evaluación_Multisectorial_de_Necesidades_Humanitarias.md`
> **Fecha de redacción:** 11 de agosto de 2026 (día siguiente al sismo de magnitud 7,4 con epicentro en San José del Palmar, Chocó)

---

## 1. Problema a resolver

El sismo del 10 de agosto de 2026 generó una crisis humanitaria multizona (Cali, Chocó/Quibdó, Pereira, Manizales) con **169 fallecidos a nivel nacional**, **95 fallecidos y 949 heridos solo en Cali**, **239 personas desaparecidas**, **36 instituciones de salud afectadas o en evaluación** en Cali y una red hospitalaria saturada al 100 %. La información oficial está dispersa entre la Alcaldía, Asocapitales, Cruz Roja, medios y redes sociales, y ha sido inconsistente en las primeras horas (cifras de fallecidos que variaron de 28 a 95). Esto genera tres fricciones críticas:

1. **Fragmentación de la información**: no existe un punto único, verificado y actualizado donde ciudadanos, voluntarios y organismos puedan consultar el estado real de la emergencia por zona.
2. **Riesgo de desinformación y estafa**: ya se reportan necesidades de aclarar que las donaciones económicas deben canalizarse *solo* por la Cruz Roja Colombiana, lo que indica que ya circulan intentos de fraude.
3. **Fricción operativa**: las personas no saben qué donar, dónde ir, a quién reportar un desaparecido o un edificio en riesgo, ni cómo pedir ayuda médica (sangre en Quibdó, traslados, salud mental).

## 2. Propuesta de valor

Una web ligera, rápida (importante con telecomunicaciones caídas en varias zonas), **gratuita de operar**, que centralice y verifique la información crítica de la emergencia y **agilice procesos** (reportar, donar, ubicar albergues, encontrar líneas de emergencia) en vez de solo informar pasivamente.

---

## 3. AS-IS — Situación actual (sin la herramienta)

- La información vive repartida en comunicados de prensa, redes sociales de la Alcaldía/Cruz Roja, notas de medios y reportes técnicos (Asocapitales) que no siempre coinciden entre sí.
- No hay un directorio único de albergues, puntos de acopio o líneas de emergencia por zona.
- No hay forma digital sencilla de reportar una persona atrapada/desaparecida, un edificio en riesgo o necesidad médica urgente (p. ej. sangre en Quibdó) que llegue a quien coordina.
- Las empresas y ciudadanos que quieren donar no tienen claridad de qué se necesita *ahora mismo* por zona (en Cali ya no se necesita ropa, se necesita agua/cascos/colchonetas) ni cómo evitar fraudes.
- Cada ciudad afectada (Cali, Quibdó, Pereira, Manizales) tiene una realidad distinta (rescate urbano vs. aislamiento logístico vs. saturación hospitalaria vs. ruptura de cadena de medicamentos) pero se comunica de forma genérica.
- No existe trazabilidad de qué tan reciente es un dato ("¿esto es de hace 2 horas o de ayer?").

## 4. TO_BE — Visión objetivo

Una **plataforma web de utilidad pública (hub de crisis)**, mobile-first, accesible con conexión lenta/intermitente, con estas capacidades:

### 4.1 Información verificada y viva
- Panel de cifras clave por zona (fallecidos, heridos, desaparecidos, rescatados) con **fuente y hora de corte visibles** en cada dato — evita el problema de cifras contradictorias.
- Vista por zona/ciudad (Cali, Chocó/Quibdó, Pereira, Manizales) con sus necesidades específicas, ya que cada una vive un momento distinto de la emergencia.
- Estado en vivo (o casi vivo) de la red hospitalaria: qué IPS están evacuadas, cuáles saturadas, cuáles operando.

### 4.2 Herramientas de agilización de procesos
- **Reporte ciudadano**: formulario simple para reportar persona atrapada/desaparecida, edificio en riesgo o necesidad médica urgente, con geolocalización opcional, que llegue a un canal accionable (no se resuelve dentro de la web, pero enruta correctamente: 119, 123, 106, censo distrital).
- **Guía de donación inteligente**: qué se necesita *hoy* por zona (ej. agua, cascos, colchonetas en Cali vs. sangre en Quibdó), dónde llevarlo, y alerta explícita anti-estafa (solo Cruz Roja para dinero).
- **Directorio de albergues y puntos de acopio** con dirección, capacidad si se conoce, y estado.
- **Líneas de emergencia** siempre visibles/accesibles (119 Bomberos, 123 Policía, 106 salud mental, Cruz Roja PVF para restablecimiento de contacto familiar).
- **Módulo de voluntariado**: cómo ofrecer ayuda (rescatistas, médicos, transporte, logística).
- **Transparencia y trámites**: guía clara de qué cubre ADRES (gastos médicos, funerarios, incapacidad, traslados) y qué no (daños materiales), y enlaces a fuentes oficiales.

### 4.3 Principios de diseño técnico
- **Offline-first / bajo consumo de datos**: la red MIO, telecomunicaciones y aeropuertos están afectados; la web debe cargar en 2G/3G y funcionar aunque el usuario pierda señal a medias.
- **Actualizable sin developer**: el contenido (cifras, albergues, necesidades) se gestiona en archivos de datos versionados (JSON/Markdown) para que un voluntario no técnico pueda proponer cambios vía PR o un formulario intermedio, sin tocar código.
- **Costo operativo $0**: stack 100% en capas gratuitas (GitHub, GitHub Actions, Firebase Hosting Spark, Cloudflare Free).
- **Multilenguaje-ready** (futuro): español como base, posibilidad de inglés para cooperación internacional (Starlink, ONGs).
- **Confiable**: cada dato muestra su fuente y timestamp; se prioriza no publicar cifras sin respaldo antes que "estar primero".

---

## 5. TO_DO — Backlog priorizado

### Fase 0 — Fundacional (MVP en horas, no días)
- [ ] Definir nombre/dominio del proyecto y repositorio en GitHub.
- [ ] Estructura de datos base (`data/*.json`): cifras por zona, hospitales, albergues, puntos de acopio, líneas de emergencia, necesidades de donación por zona.
- [ ] Página de inicio con resumen de cifras + acceso directo a los 4 módulos críticos (Donar / Albergues / Reportar / Líneas de emergencia).
- [ ] Página "Fuentes y metodología" (transparencia de dónde sale cada dato).
- [ ] Deploy inicial a Firebase Hosting vía GitHub Actions.

### Fase 1 — Módulos de utilidad
- [ ] Página por zona (Cali / Chocó / Pereira / Manizales) con sus necesidades específicas.
- [ ] Estado de red hospitalaria (tabla dinámica desde `data/hospitales.json`).
- [ ] Directorio de albergues y puntos de acopio (lista + link a mapa).
- [ ] Guía de donación con alerta anti-estafa destacada.
- [ ] Formulario de reporte (desaparecido / edificio en riesgo / necesidad médica) que enruta a líneas oficiales y/o guarda el reporte (Firestore) para un equipo coordinador.

### Fase 2 — Comunidad y voluntariado
- [ ] Módulo de voluntariado (registro de interés + tipo de ayuda ofrecida).
- [ ] Matriz de apoyo del sector privado (Starlink, FC Barcelona, Grupo Éxito, etc.) para que otras empresas vean cómo sumarse.
- [ ] Sección ADRES / trámites (qué cubre, cómo reclamar).

### Fase 3 — Robustez y escala
- [ ] Panel de administración simple (o flujo de PR + revisión) para actualizar datos sin fricción.
- [ ] Monitoreo/alertas de caída del sitio (ver `04_monitoring`).
- [ ] Analítica ligera y gratuita (p. ej. Cloudflare Web Analytics) para saber qué módulos se usan más y priorizar.
- [ ] Revisión de accesibilidad (WCAG AA) y prueba en dispositivos de gama baja.
- [ ] Traducción a inglés para cooperación internacional.

### Backlog / ideas a validar
- [ ] Integración con mapa (Cali comunas 17 y 19 como zonas prioritarias).
- [ ] Botón de "compartir estado" tipo tarjeta para redes sociales con el dato verificado del día.
- [ ] Modo texto plano / AMP-like para conexiones muy lentas.

---

## 6. Fuera de alcance (por ahora)
- Procesamiento de pagos/donaciones dentro de la web (se canaliza explícitamente a Cruz Roja Colombiana).
- Verificación en tiempo real automatizada (el equipo humano cura y publica los datos).
- App nativa móvil (se prioriza web responsive instalable como PWA).
