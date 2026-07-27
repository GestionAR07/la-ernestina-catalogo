# Configuración comercial — checklist

Rama: `feature/catalog-production-config`

## Datos listos

| Campo | Valor |
|-------|--------|
| Nombre | La Ernestina |
| Descripción | Forrajería & Alimentos |
| Modalidades de pedido | Retiro / Consultar envío |

## Datos pendientes (placeholders, no inventados)

| Campo | Estado |
|-------|--------|
| WhatsApp | Placeholder `5490000000000` — **checkout bloqueado** |
| Teléfono | Pendiente de configurar |
| Dirección | Pendiente de configurar |
| Horarios | Pendiente de configurar |
| Medios de pago | Lista vacía |
| Redes sociales | Objeto vacío |

## Cómo habilitar WhatsApp real

1. Reemplazar **solo** `WHATSAPP_NUMBER` en `src/config/site.ts` con dígitos internacionales (sin `+`, espacios ni guiones).
2. Actualizar `COMMERCIAL_STATUS.whatsappReady` a `true` cuando corresponda (documentación).
3. Validar en móvil: pedido no vacío → botón habilitado → `wa.me` abre con mensaje completo.
4. No enviar el pedido de prueba sin autorización del comercio.

## Fixtures QA multi-presentación

Activar solo en desarrollo:

```bash
NEXT_PUBLIC_ENABLE_QA_FIXTURES=true npm run dev
```

Sin esta variable, el producto `[QA] Producto multi-presentación` **no** aparece.
