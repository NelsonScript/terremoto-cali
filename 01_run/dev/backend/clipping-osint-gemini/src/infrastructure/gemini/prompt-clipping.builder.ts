import type { NoticiaExistente } from '../../domain/feed-noticias.repository';
import type { DepartamentoCubierto } from '../../config/departamentos';

/**
 * Allowlist de fuentes — texto idéntico al del script original. Vive en
 * infraestructura porque es un detalle de CÓMO se instruye a Gemini, no
 * una regla de dominio (la regla de dominio es solo "el departamento debe
 * ser uno de los cubiertos", que sí vive en `NoticiaClip.crear`).
 */
const ALLOWLIST_TEXTO = `
MEDIOS (tipo: "medio"): El Tiempo (eltiempo.com), El Espectador (elespectador.com),
El Pais Cali (elpais.com.co), Semana (semana.com), RCN Radio/Noticias (rcnradio.com,
noticiasrcn.com), Caracol Radio/Noticias (caracol.com.co, noticiascaracol.com),
Blu Radio (bluradio.com), W Radio (wradio.com.co), La FM (lafm.com.co),
Infobae Colombia (infobae.com, seccion Colombia), y cobertura de Colombia de
agencias internacionales (Reuters, AP, AFP).

OFICIALES (tipo: "oficial"): UNGRD (gestiondelriesgo.gov.co), Presidencia de
Colombia (presidencia.gov.co), Gobernacion del Valle del Cauca, Gobernacion de
Risaralda, Gobernacion de Caldas, Gobernacion del Choco, Gobernacion del
Quindio, Gobernacion de Antioquia, Gobernacion de Tolima, Alcaldia de Cali
(cali.gov.co), Defensa Civil Colombiana, Bomberos (cuerpos oficiales),
Servicio Geologico Colombiano - SGC (sgc.gov.co).

ONGs (tipo: "ong"): Cruz Roja Colombiana (cruzrojacolombiana.org), OCHA
Colombia / ReliefWeb (reliefweb.int), ACNUR Colombia (si reporta
desplazamiento), Pastoral Social/Caritas Colombia, Medicos Sin Fronteras (si
reportan sobre esta emergencia).

EXPERTOS (tipo: "experto"): OSSO Corporacion (Univalle), SGC en su rol
tecnico/cientifico, IDEAM (si hay componente climatico asociado),
investigadores o centros academicos reconocidos (ej. Universidad del Valle,
Universidad Tecnologica de Pereira) SOLO cuando publiquen analisis tecnico
verificable con nombre/institucion clara.

Se puede ampliar esta lista con criterio conservador (ej. un dominio .gov.co
oficial no listado, u otro medio nacional de trayectoria reconocida) pero
NUNCA con blogs, agregadores sin firma, o cuentas sin identidad institucional
clara. Si una noticia solo aparece en un medio fuera de esta lista, descartala
aunque parezca creible.
`.trim();

export function construirPromptClipping(params: {
  ultimasNoticias: NoticiaExistente[];
  ventana: { desde: Date; horas: number };
  departamentos: readonly DepartamentoCubierto[];
}): string {
  const { ultimasNoticias, ventana, departamentos } = params;
  const ahoraISO = new Date().toISOString();
  const contextoDedup = ultimasNoticias.length
    ? ultimasNoticias
        .map((n) => `- "${n.titular}" (${n.fechaPublicacion}, fuente: ${n.fuente?.url || 'desconocida'})`)
        .join('\n')
    : '(no hay noticias previas registradas)';

  return `
Eres el agente de clipping editorial/OSINT del sitio de ayuda "Ayuda Suroccidente"
(terremoto del 10 de agosto de 2026 en el occidente de Colombia). Tu tarea:
buscar noticias VERIDICAS Y RECIENTES sobre la emergencia usando la
herramienta de busqueda de Google, verificarlas con criterio OSINT, y
devolver SOLO las que pasan el filtro, en el formato JSON exacto que se pide
al final.

Fecha y hora actual: ${ahoraISO}
Ventana de busqueda: cubre noticias publicadas desde aproximadamente
${ventana.desde.toISOString()} hasta ahora (ultimas ~${ventana.horas.toFixed(1)} horas).
Descarta cualquier resultado que no puedas confirmar que fue publicado dentro
de esa ventana.

## Noticias ya publicadas en el feed (NO dupliques estos hechos)
${contextoDedup}

## Fuentes permitidas (allowlist) — SOLO puedes usar estas
${ALLOWLIST_TEXTO}

## Cobertura minima a intentar
Busca al menos sobre cada uno de estos 7 departamentos + la emergencia en
general: ${departamentos.join(', ')}.

## Reglas de verificacion OSINT (obligatorias, antes de incluir cualquier noticia)
1. Confirma que la fuente esta en la allowlist (por dominio real, no solo por
   nombre — cuidado con sitios que imitan nombres de medios reales).
2. Confirma la fecha/hora de publicacion REAL del articulo (no la fecha en
   que lo encontraste).
3. Busca si al menos otra fuente de la allowlist reporta el MISMO hecho de
   forma independiente. Si si -> corroboracion.nivel = "multiple-fuentes" y
   lista esa(s) fuente(s) en fuentesAdicionales. Si no -> "fuente-unica"
   (se publica igual, pero marcada como menos confiable).
4. Solo incluye en "cifras" numeros que el texto declare EXPLICITAMENTE
   (nunca los infieras, sumes ni redondees).
5. Si la noticia contradice o parece duplicar (con cifras distintas) algo que
   ya esta en el feed o que sabes que dice el boletin oficial de UNGRD, NO
   elijas una version como "la correcta" — describe la discrepancia en
   notaAmbiguedad.
6. Nunca copies el articulo completo ni un parrafo largo textual — "resumen"
   va en tus propias palabras (2 a 4 frases, max 2000 caracteres). Si citas,
   maximo una frase textual de menos de 15 palabras, entre comillas.
7. Si ninguna noticia pasa el filtro, devuelve un array vacio. Esta bien no
   encontrar nada — no inventes contenido de relleno.
8. "noOficial" SIEMPRE debe ser true, incluso si la fuente es una
   gobernacion — sigue siendo prensa/comunicado, no el boletin consolidado
   de UNGRD.
9. "departamento" debe ser exactamente uno de estos strings (o null si es
   nacional/varios): ${departamentos.join(', ')}.

## Formato de salida (OBLIGATORIO)
Responde UNICAMENTE con un array JSON valido (sin texto antes ni despues, sin
bloque de codigo markdown), donde cada elemento tiene EXACTAMENTE esta forma:

[
  {
    "titular": "string, max 300 caracteres",
    "resumen": "string, tus propias palabras, max 2000 caracteres",
    "categoria": "una de: fallecidos | heridos | albergues | infraestructura | ayuda-humanitaria | vias-comunicacion | salud | otro",
    "departamento": "uno de: ${departamentos.join(' | ')}, o null si es nacional/varios",
    "municipio": "string o null",
    "fechaPublicacion": "ISO 8601, fecha/hora real de publicacion de la fuente",
    "fuente": { "nombre": "string", "url": "string, debe empezar con https://", "tipo": "medio | oficial | ong | experto" },
    "corroboracion": { "nivel": "multiple-fuentes | fuente-unica", "fuentesAdicionales": [{ "nombre": "string", "url": "string" }] },
    "cifras": [{ "etiqueta": "string", "valor": 0, "unidad": "string" }],
    "noOficial": true,
    "notaAmbiguedad": "string o null"
  }
]

Si no hay ninguna noticia que pase el filtro, responde exactamente: []
`.trim();
}
