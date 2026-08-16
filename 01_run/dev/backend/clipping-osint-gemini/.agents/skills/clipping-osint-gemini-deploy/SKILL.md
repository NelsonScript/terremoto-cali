---
name: clipping-osint-gemini-deploy
description: Compila y despliega el servicio backend clipping-osint-gemini (Cloud Function TypeScript que busca, verifica OSINT y publica noticias en Firestore vía Gemini/Vertex AI), y verifica que quedó funcionando.
---

# Desplegar `clipping-osint-gemini`

Servicio backend aislado (propio `package.json`/`tsconfig.json`, sin workspace
compartido con `frontend/` ni con otros servicios de `backend/`) que corre en
Cloud Functions Gen2, disparado por Cloud Scheduler cada 3 horas. Busca
noticias sobre la emergencia con Gemini (Vertex AI + Grounding con Google
Search), las verifica con criterio OSINT usando el mismo schema de zod que
el frontend usa para leer `feed_noticias` (copia sincronizada, no import
compartido — ver `src/schemas/noticia-clip.schema.ts`), y escribe las que
pasan el filtro.

Proyecto GCP: `terremoto-colombia-2026`. Región: `us-central1`.

## 1. Compilar

Desde `backend/clipping-osint-gemini/`:

```bash
npm install
npm run build
```

Confirma que se generó `dist/index.js` y `dist/schemas/noticia-clip.schema.js`
sin errores de `tsc` antes de continuar. Si hay errores de tipos, PARA aquí —
no despliegues código que no compiló limpio.

## 2. Desplegar

```bash
gcloud functions deploy clipping-osint \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-central1 \
  --source=. \
  --entry-point=clippingOsint \
  --trigger-http \
  --no-allow-unauthenticated \
  --run-service-account=clipping-osint-runner@terremoto-colombia-2026.iam.gserviceaccount.com \
  --set-env-vars=VERTEX_LOCATION=us-central1,GEMINI_MODEL=gemini-2.5-pro,GCP_PROJECT_ID=terremoto-colombia-2026 \
  --memory=512Mi \
  --timeout=300s
```

**Crítico**: `GCP_PROJECT_ID` en `--set-env-vars` es obligatorio — Cloud
Functions Gen2 NO garantiza tener `GOOGLE_CLOUD_PROJECT`/`GCLOUD_PROJECT`
seteadas en runtime (lo comprobamos: sin esto, el cliente de Vertex AI le
pega a `projects/undefined` y falla con un 403 confuso en vez de un error
claro). Si cambias el nombre del proyecto o lo despliegas en otro proyecto
GCP, actualiza este valor.

`--no-allow-unauthenticated` es intencional — la función solo debe poder
invocarla la service account de Cloud Scheduler (`scheduler-invoker@...`),
nunca el público. No lo cambies sin una razón explícita y documentada.

Nota de vigencia: `--runtime=nodejs20` se descontinúa el **30 de octubre de
2026**. Antes de esa fecha hay que redesplegar con `nodejs22` (o el runtime
LTS vigente en ese momento) — revisa
https://docs.cloud.google.com/functions/docs/runtime-support antes de esa
fecha.

## 3. Verificar que quedó funcionando

Dispara una ejecución manual (no esperes al cron):

```bash
gcloud scheduler jobs run clipping-osint-cada-3h --location=us-central1
sleep 40
gcloud functions logs read clipping-osint --region=us-central1 --gen2 --limit=50
```

Busca en el log la línea con el resumen JSON (`candidatas`, `creadas`,
`descartadas`, `detalle_creadas`, `detalle_descartadas`). Si en vez de eso
ves un error, ve al skill `/clipping-osint-gemini-debug` — ahí está el checklist de
diagnóstico con los problemas reales que ya se dieron en este proyecto.

## 4. Si cambiaste el schema de `feed_noticias`

Si el cambio que estás desplegando toca la forma del documento (nuevos
campos, nuevos enums, etc.), **primero** revisa que
`src/schemas/noticia-clip.schema.ts` siga siendo un espejo exacto de:
frontend/src/features/feed-noticias/domain/schemas/noticia-clip.schema.ts
Si el frontend cambió y este archivo no, el backend puede escribir
documentos que el frontend después descarta silenciosamente al leer (ver
`RawNoticiaClipSchema.safeParse` en el frontend). Son copias sincronizadas
a mano, no un import compartido — es tu responsabilidad mantenerlas iguales
cuando una de las dos cambia.

## 5. Registrar el cambio

Actualiza brevemente `backend/clipping-osint-gemini/README.md` (o el CHANGELOG
si se crea uno) con qué cambió y por qué, siguiendo el mismo criterio de
documentación que ya usa el proyecto en `ARCHITECTURE_RULES.md` del frontend
— decisiones y su razonamiento, no solo el qué.
