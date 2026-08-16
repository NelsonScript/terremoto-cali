# Service Backend: `clipping-osint-gemini`

Servicio backend aislado que corre en Cloud Functions Gen2 (`us-central1`), disparado por Cloud Scheduler (`clipping-osint-cada-3h`) cada 3 horas. Busca noticias sobre la emergencia del terremoto usando Gemini vía Vertex AI con Grounding (Google Search), las verifica con criterio OSINT usando el schema de Zod de `noticia-clip.schema.ts` (espejo del frontend), y publica en la colección `feed_noticias` de Firestore.

## Integración y Gobernanza (Makefile)

Siguiendo las reglas de gobernanza global del proyecto (`RULE[user_global]`), la compilación, despliegue y verificación se orquestan exclusivamente desde el `Makefile` ubicado en la raíz del repositorio:

```bash
make build-clipping     # Compila TypeScript en dist/
make deploy-clipping    # Despliega a GCP Cloud Functions Gen2
make verify-clipping    # Dispara job manual en Cloud Scheduler y lee logs
```

## Configuración y Variables de Entorno (Deploy)

- **Proyecto GCP**: `terremoto-colombia-2026`
- **Región**: `us-central1`
- **Runtime**: `nodejs20` (previsto actualizar a `nodejs22` antes de oct 2026)
- **Service Account**: `clipping-osint-runner@terremoto-colombia-2026.iam.gserviceaccount.com`
- **Variables de Entorno**:
  - `GCP_PROJECT_ID=terremoto-colombia-2026` (Obligatorio en Gen2 para evitar 403 en Vertex AI client)
  - `VERTEX_LOCATION=us-central1`
  - `GEMINI_MODEL=gemini-2.5-pro`

## Historial de Cambios / Decisiones

- **16 ago 2026**:
  - **Integración con Makefile**: Se añadieron metas `build-clipping`, `deploy-clipping` y `verify-clipping` al `Makefile` raíz para cumplir la regla estricta de fuente única de verdad operativa.
  - **Despliegue exitoso**: Despliegue de revisión Gen2 finalizado de forma activa y verificación confirmada con disparo manual exitoso (`CANDIDATA -> VERIFICADA -> PUBLICADA`).
