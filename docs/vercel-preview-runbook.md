# Despliegue preview Vercel — La Ernestina

## Bloqueo actual

1. El repositorio **no tiene remote Git** (`origin` ausente).
2. No hay credenciales Vercel en este entorno (`vercel whoami` inicia login OAuth).

## Commit a desplegar

- Rama: `feature/catalog-production-config`
- Commit: `891ec30 fix: quiet expected localStorage recovery in production`

## Requisitos de seguridad

- **No** definir `NEXT_PUBLIC_ENABLE_QA_FIXTURES=true` en Vercel.
- **No** agregar secretos ni `.env`.
- WhatsApp permanece en placeholder → checkout bloqueado.
- **No** promover a Production hasta aprobación del cliente.

## Pasos cuando haya autenticación

```bash
# 1) Autenticar (una vez)
npx vercel login

# 2) Vincular proyecto (preview, no production)
npx vercel link

# 3) Desplegar preview desde la rama actual
npx vercel
```

O, con remote GitHub:

1. Crear/vincular el repo remoto.
2. `git push -u origin feature/catalog-production-config`
3. Importar el proyecto en Vercel UI → Preview de la rama (sin Production).

## Variables de entorno en Vercel

Ninguna requerida para esta preview.

Si aparece `NEXT_PUBLIC_ENABLE_QA_FIXTURES`, dejarla **sin definir** o en `false`.
