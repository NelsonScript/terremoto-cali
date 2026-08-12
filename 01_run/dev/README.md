# Ayuda Suroccidente — Sitio de respuesta al terremoto del 10 de agosto de 2026

Web de utilidad pública para centralizar información verificada y agilizar
procesos (donar, reportar, ubicar albergues, líneas de emergencia) durante
la emergencia por el sismo de magnitud 7,4 en el suroccidente colombiano
(Valle del Cauca, Risaralda, Chocó, Caldas y departamentos vecinos).

Contexto completo del proyecto:
- Idea, AS-IS/TO-BE y backlog: `../../02_emphatize/IDEA_PROYECTO.md`
- Diseño de producto y sitemap: `../../02_emphatize/DISENO_WEB.md`
- Arquitectura técnica y diagrama: `../../03_architecture/ARQUITECTURA.md`

## Stack

Next.js 16 (App Router, TypeScript, export estático) + Tailwind CSS 4 +
Firebase (Firestore, plan Spark/gratis) para los formularios, desplegado en
Firebase Hosting vía GitHub Actions, servido detrás de Cloudflare (CDN/DNS).
Costo operativo: **$0**.

## Requisitos

- Node.js 20+
- Cuenta de Firebase (plan Spark, gratis) — solo si quieres activar los
  formularios de Reportar y Voluntariado.
- Cuenta de Cloudflare (plan Free) — solo para producción (DNS/CDN).

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Estructura del contenido (importante)

Todo el contenido dinámico del sitio (cifras, departamentos, municipios,
hospitales, líneas de emergencia, apoyo externo, fuentes) vive en
`src/data/*.json`. **No hace falta tocar componentes para actualizar un
dato** — basta con editar el JSON correspondiente y abrir un Pull Request.
El flujo de CI (`.github/workflows/ci.yml`) valida que el sitio sigue
compilando; al hacer merge a `main` se despliega automáticamente.

| Archivo | Contenido |
|---|---|
| `src/data/meta.json` | Datos generales del evento y cifras nacionales (duales: confirmadas vs. preliminares) |
| `src/data/departamentos.json` | Archivo central: jerarquía departamento → municipios, cifras de capital y UNGRD, situación, necesidades, albergues y puntos de acopio |
| `src/data/hospitales.json` | Estado de la red hospitalaria |
| `src/data/lineas.json` | Líneas de emergencia |
| `src/data/apoyo-privado.json` | Cooperación internacional / sector privado / interinstitucional |
| `src/data/acopio-bogota.json` | Centros de acopio en Bogotá para donantes fuera de la zona de desastre |
| `src/data/fuentes.json` | Fuentes oficiales citadas |

Los albergues y puntos de acopio no tienen archivo propio: se agregan
automáticamente desde `departamentos.json` (ver `getAlberguesYAcopio()` en
`src/lib/data.ts`) para que no existan dos copias de la misma información
que puedan desincronizarse.

**Cuando dos fuentes oficiales se contradicen** (por ejemplo, cifras de una
capital vs. cifras departamentales de UNGRD que no está claro si la
incluyen), no se suman ni se elige una: se guardan ambas en bloques
separados (`cifras_capital` y `cifras_departamento_ungrd`) con un campo
`nota_ambiguedad` opcional que la UI muestra explícitamente. Ver el caso
real de Valle del Cauca en `departamentos.json`.

## Activar los formularios (Reportar y Voluntariado)

Los formularios están construidos pero **no enviarán datos hasta que
configures un proyecto de Firebase**:

1. Crea un proyecto gratuito en https://console.firebase.google.com (plan Spark).
2. Habilita **Firestore Database** (modo producción).
3. Despliega las reglas de seguridad incluidas: `firebase deploy --only firestore:rules` (requiere `firebase-tools` y haber hecho `firebase login` / `firebase use --add`).
4. En "Configuración del proyecto → Tus apps", crea una app web y copia sus credenciales a un archivo `.env.local` basado en `.env.example`.
5. Agrega esas mismas variables como **Secrets** del repositorio en GitHub (Settings → Secrets and variables → Actions) para que el build en CI/CD también las tenga.

Sin esta configuración, el sitio funciona igual (contenido informativo
completo), pero los formularios mostrarán un aviso de "no conectado" en vez
de guardar el envío.

## Despliegue (GitHub Actions → Firebase Hosting)

1. Genera una cuenta de servicio de Firebase con rol de Firebase Hosting Admin y agrégala como secret `FIREBASE_SERVICE_ACCOUNT` (JSON completo).
2. Agrega el secret `FIREBASE_PROJECT_ID` con el ID de tu proyecto de Firebase.
3. Actualiza `.firebaserc` con ese mismo project ID.
4. Cada Pull Request se despliega automáticamente a un **canal de preview** temporal (URL comentada en el PR).
5. Cada merge a `main` despliega a producción (canal `live`).

## Conectar Cloudflare como CDN/DNS

1. Agrega tu dominio (o subdominio, ej. `ayuda.tu-dominio.co`) a Cloudflare.
2. En Firebase Hosting, añade el dominio personalizado y sigue las instrucciones de verificación (registro TXT).
3. En Cloudflare, crea el registro DNS (A o CNAME, según indique Firebase) apuntando a Firebase Hosting, en modo **Proxied** (nube naranja) para obtener CDN, WAF básico y protección DDoS del plan Free.
4. Activa **Cloudflare Web Analytics** (gratis, sin cookies) en el dominio si quieres métricas de uso.

Detalle completo del porqué de cada pieza: `../../03_architecture/ARQUITECTURA.md`.

## Scripts

```bash
npm run dev      # desarrollo local
npm run build    # build de producción (genera ./out — export estático)
npm run lint     # eslint
npm run start    # (no se usa en producción; el sitio es 100% estático)
```
