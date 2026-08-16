---
name: clipping-osint-gemini-debug
description: Checklist de diagnóstico cuando el servicio backend clipping-osint-gemini falla al desplegar, al autenticar gcloud, o al ejecutarse (Cloud Scheduler / Cloud Function / Vertex AI / Firestore).
---

# Debuguear `clipping-osint-gemini`

Sigue este checklist EN ORDEN — cada capa depende de que la anterior esté
bien. No saltes directo a "revisar el código" sin antes confirmar que el
problema no es de auth/permisos/red, que es donde han estado los problemas
reales de este servicio hasta ahora.

## 1. ¿El problema es local (tu máquina) o del servicio ya desplegado?

Si el error pasa corriendo `gcloud` en tu terminal (no una ejecución
programada), sospecha primero de tu entorno local antes que de GCP:

- **`invalid_grant: Token has been expired or revoked` justo después de
  loguearte** → casi siempre es una VPN/DNS local (ej. Pi-hole) interceptando
  el intercambio de token OAuth. Prueba apagando la VPN y repitiendo
  `gcloud auth revoke --all && gcloud auth login`. Si con la VPN apagada
  funciona, ya está confirmado — puedes whitelistear los dominios de Google
  OAuth en tu Pi-hole en vez de apagarla cada vez.
- **`PERMISSION_DENIED` en `gcloud projects describe` / `gcloud services
  enable`, pero la misma cuenta SÍ ve el proyecto con `firebase
  projects:list`** → los roles de la consola de Firebase (ej. "Firebase
  Admin") no son lo mismo que un rol real de Cloud IAM. Verifica el rol real
  en `https://console.cloud.google.com/iam-admin/iam?project=terremoto-colombia-2026`
  — si no aparece Owner/Editor ahí, ese es el problema, no las reglas de
  Firestore.
- Si ninguna de las dos aplica, considera usar Cloud Shell
  (`console.cloud.google.com` → ícono de terminal) para descartar por
  completo tu entorno local — Cloud Shell ya viene autenticado con tu sesión
  de navegador, sin ningún token/VPN local de por medio.

## 2. ¿El deploy mismo falló?

Revisa el output de `gcloud functions deploy` — si falló en el paso de
Cloud Build, el link a los logs de build viene en el output
(`https://console.cloud.google.com/cloud-build/builds;region=us-central1/...`).
Los errores típicos ahí son de compilación TypeScript (corre `npm run build`
localmente primero para atraparlos antes de gastar un ciclo de deploy) o de
alguna dependencia que no resuelve.

## 3. ¿El deploy funcionó pero el Cloud Scheduler falla al invocar?

```bash
gcloud scheduler jobs describe clipping-osint-cada-3h --location=us-central1
```

Mira el campo `status.code` del último intento (es un código de estado
gRPC, no HTTP):

- **`code: 16` (UNAUTHENTICATED)** o el log de la función dice *"Empty
  Authorization header value"* → el job no está mandando el token OIDC
  correctamente, o falta el invoker role. Verifica:
```bash
  gcloud functions add-invoker-policy-binding clipping-osint \
    --region=us-central1 \
    --member="serviceAccount:scheduler-invoker@terremoto-colombia-2026.iam.gserviceaccount.com"
```
  y que `oidcToken.audience` en el `describe` sea EXACTAMENTE la URL de la
  función (compara con `gcloud functions describe clipping-osint
  --region=us-central1 --gen2 --format='value(serviceConfig.uri)'`).
- **`code: 13` (INTERNAL)** → la autenticación SÍ pasó, el problema está
  dentro de la función. Ve al paso 4.
- **`code: 7` (PERMISSION_DENIED)** → revisa que la service account de
  Scheduler tenga el invoker role (mismo comando de arriba).

## 4. ¿La función se ejecuta pero falla por dentro?

```bash
gcloud functions logs read clipping-osint --region=us-central1 --gen2 --limit=100
```

Busca la línea `Error en clippingOsint: ...` (la función atrapa sus propios
errores y loguea el mensaje completo). Errores ya vistos en este proyecto:

- **`"Consumer 'projects/undefined' has been suspended"`** (403 de Vertex
  AI) → falta `GCP_PROJECT_ID` en las variables de entorno del deploy. Ver
  `/clipping-osint-gemini-deploy` paso 2 — es obligatorio pasarlo explícito, Cloud
  Functions Gen2 no lo inyecta solo.
- **Error de cuota/rate limit de Vertex AI** → revisa
  https://cloud.google.com/vertex-ai/generative-ai/pricing para el estado
  actual de cuotas del grounding con Google Search; a la frecuencia de este
  servicio (cada 3h) no debería pasar nunca, así que si aparece, algo más
  está disparando la función además del cron esperado — revisa si hay
  invocaciones manuales de más o un segundo job de Scheduler apuntando a la
  misma función.
- **Error de parseo JSON de la respuesta de Gemini** → Gemini a veces
  envuelve el JSON en \`\`\`json aunque se le pida no hacerlo; la función ya
  tiene un fallback para eso (`extraerJSON`). Si aun así falla, revisa el
  texto crudo que Gemini devolvió (agrégalo temporalmente a un
  `console.log` antes de `extraerJSON` para inspeccionarlo, y quítalo antes
  de volver a desplegar).
- **`RawNoticiaClipSchema.safeParse` rechazando candidatas válidas a
  simple vista** → puede ser que el schema local se desincronizó del
  schema real del frontend. Compara ambos archivos (ver
  `/clipping-osint-gemini-deploy` paso 4).

## 5. ¿La función corre bien pero no aparecen noticias nuevas en el sitio?

Eso puede ser correcto, no un bug — la función NO fuerza contenido de
relleno. Revisa `detalle_descartadas` en el resumen del log: si dice
`"posible duplicado de una noticia ya publicada"` o simplemente
`candidatas: 0`, es que Gemini no encontró nada nuevo que pasara el filtro
en esa ventana de tiempo, lo cual es el comportamiento esperado y deseado.
