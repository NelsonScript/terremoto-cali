.PHONY: up down test build deploy deploy-rules deploy-hosting clean

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

deploy-rules:
	@echo "==> Desplegando reglas de seguridad de Firestore..."
	cd 01_run/dev && npx -y firebase-tools@latest deploy --only firestore:rules

deploy-hosting: build
	@echo "==> Desplegando en Firebase Hosting..."
	cd 01_run/dev && npx -y firebase-tools@latest deploy --only hosting

deploy: build deploy-rules deploy-hosting
	@echo "==> Despliegue completo finalizado con éxito."

clean:
	@echo "==> Limpiando caché de compilación..."
	rm -rf 01_run/dev/.next 01_run/dev/out
