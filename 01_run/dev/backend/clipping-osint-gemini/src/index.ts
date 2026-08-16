/**
 * clipping-osint-gemini
 * ---------------------
 * Cloud Function (2a gen, HTTP) para el sitio "Ayuda Suroccidente".
 * Busca noticias recientes y veridicas sobre el terremoto del 10 de agosto
 * de 2026 en el occidente de Colombia, las verifica con criterio OSINT y
 * publica las que pasan el filtro como documentos nuevos en la coleccion
 * `feed_noticias` de Firestore.
 *
 * Corre enteramente dentro de GCP (Cloud Functions -> Vertex AI -> Firestore,
 * mismo proyecto), disparada por Cloud Scheduler. No depende de ningun
 * servicio externo a Google ni de que un computador este encendido.
 *
 * ARQUITECTURA (refactor DDD ligero, sin frameworks): este archivo es
 * SOLO la raiz de composicion + el handler HTTP. La logica de negocio
 * vive en domain/ (entidad NoticiaClip + maquina de estados) y
 * application/ (caso de uso + servicios puros); los adaptadores a
 * Firestore y Gemini viven en infrastructure/. Se eligio DDD sin NestJS
 * a proposito: esta funcion es un job efimero de un solo comando
 * disparado por cron, no una API HTTP con multiples rutas — un
 * contenedor de DI y una capa HTTP completa (CommandBus/QueryBus)
 * anadirian peso y cold-start sin beneficio real aqui. Ver
 * ARCHITECTURE_RULES.md / conversacion de entrega para el razonamiento
 * completo.
 *
 * La validacion de esquema usa una copia sincronizada del schema de zod que
 * ya usa el frontend para leer `feed_noticias` (ver src/schemas/noticia-clip.schema.ts)
 * — asi lo que este backend considera "valido para escribir" es exactamente
 * lo que el frontend considera "valido para leer".
 */

import type { HttpFunction } from '@google-cloud/functions-framework';
import * as functions from '@google-cloud/functions-framework';
import { GoogleGenAI } from '@google/genai';
import * as admin from 'firebase-admin';

import { DEPARTAMENTOS_CUBIERTOS } from './config/departamentos';
import { FirestoreFeedNoticiasRepository } from './infrastructure/firestore/firestore-feed-noticias.repository';
import { GeminiFuenteNoticiasClipping } from './infrastructure/gemini/gemini-fuente-noticias.adapter';
import { ClipearYPublicarNoticiasUseCase } from './application/use-cases/clipear-y-publicar-noticias.use-case';

// ---------------------------------------------------------------------------
// Configuracion (identica al script original)
// ---------------------------------------------------------------------------

// IMPORTANTE: Cloud Functions Gen2 NO garantiza tener seteada
// GOOGLE_CLOUD_PROJECT/GCLOUD_PROJECT en tiempo de ejecucion (comprobado: en
// nuestro despliegue llegaba `undefined`, lo que hacia que el cliente de
// Vertex AI le pegara a "projects/undefined" con un error 403 criptico en
// vez de un error claro). Por eso seteamos GCP_PROJECT_ID explicitamente en
// el deploy (--set-env-vars) y la usamos como fuente de verdad, con las
// variables automaticas solo como respaldo.
const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
const LOCATION = process.env.VERTEX_LOCATION || 'us-central1';
// gemini-2.5-pro es el modelo verificado al escribir este codigo. Si al
// desplegar existe una generacion mas nueva en Vertex AI (ej. gemini-3.x),
// revisa https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models
// y actualiza esta variable de entorno en el despliegue.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
const COLLECTION = 'feed_noticias';
const VENTANA_HORAS_DEFECTO = 6;

if (!PROJECT_ID) {
  // Falla rapido con un mensaje claro en vez de dejar que Vertex AI tire un
  // 403 confuso sobre "projects/undefined" mas adelante.
  throw new Error(
    'Falta la variable de entorno GCP_PROJECT_ID (o GOOGLE_CLOUD_PROJECT/GCLOUD_PROJECT). ' +
      'Verifica que el deploy incluya --set-env-vars=GCP_PROJECT_ID=terremoto-colombia-2026.',
  );
}

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const genAI = new GoogleGenAI({
  vertexai: true,
  project: PROJECT_ID,
  location: LOCATION,
});

// ---------------------------------------------------------------------------
// Composicion: se cablean los adaptadores concretos contra los puertos que
// espera el caso de uso. Sin contenedor de DI — instanciacion manual,
// suficiente para un job de un solo flujo.
// ---------------------------------------------------------------------------

const repositorio = new FirestoreFeedNoticiasRepository(db, COLLECTION);
const fuente = new GeminiFuenteNoticiasClipping(genAI, GEMINI_MODEL, DEPARTAMENTOS_CUBIERTOS);
const casoDeUso = new ClipearYPublicarNoticiasUseCase(
  repositorio,
  fuente,
  DEPARTAMENTOS_CUBIERTOS,
  VENTANA_HORAS_DEFECTO,
);

// ---------------------------------------------------------------------------
// Handler HTTP (invocado por Cloud Scheduler) — mismo nombre exportado
// (`clippingOsint`), mismo contrato de entrada/salida que antes del
// refactor, para que el deploy y el job de Cloud Scheduler no necesiten
// ningun cambio.
// ---------------------------------------------------------------------------

const clippingOsint: HttpFunction = async (_req, res) => {
  try {
    const resumen = await casoDeUso.ejecutar();
    console.log(JSON.stringify(resumen));
    res.status(200).json(resumen);
  } catch (err) {
    console.error('Error en clippingOsint:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

functions.http('clippingOsint', clippingOsint);
