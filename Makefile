.PHONY: up down test build deploy deploy-rules deploy-hosting build-clipping deploy-clipping verify-clipping clean

up:
	@echo "==> Iniciando entorno de desarrollo local..."
	cd 01_run/dev && npm run dev

down:
	@echo "==> Deteniendo servicios y limpiando procesos locales..."
	@pkill -f "next dev" || true

test:
	@echo "==> Ejecutando validación y build de verificación..."
	cd 01_run/dev && npm run build

build:
	@echo "==> Compilando la aplicación Next.js..."
	cd 01_run/dev && npm run build

build-clipping:
	@echo "==> Compilando servicio clipping-osint-gemini..."
	cd 01_run/dev/backend/clipping-osint-gemini && npm install && npm run build

deploy-rules:
	@echo "==> Desplegando reglas de seguridad de Firestore..."
	cd 01_run/dev && npx -y firebase-tools@latest deploy --only firestore:rules

deploy-hosting: build
	@echo "==> Desplegando en Firebase Hosting..."
	cd 01_run/dev && npx -y firebase-tools@latest deploy --only hosting

deploy-clipping: build-clipping
	@echo "==> Desplegando Cloud Function clipping-osint..."
	cd 01_run/dev/backend/clipping-osint-gemini && gcloud functions deploy clipping-osint \
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

verify-clipping:
	@echo "==> Ejecutando disparador manual y leyendo logs de clipping-osint..."
	gcloud scheduler jobs run clipping-osint-cada-3h --location=us-central1
	sleep 40
	gcloud functions logs read clipping-osint --region=us-central1 --gen2 --limit=50

deploy: build deploy-rules deploy-hosting
	@echo "==> Despliegue completo finalizado con éxito."

clean:
	@echo "==> Limpiando caché de compilación..."
	rm -rf 01_run/dev/.next 01_run/dev/out

