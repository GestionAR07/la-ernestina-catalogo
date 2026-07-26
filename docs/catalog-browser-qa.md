# Validación de navegador — catálogo La Ernestina

Fecha: 2026-07-26  
Rama: `chore/catalog-browser-qa`  
Base: `feature/catalog-ui` @ `ba18d63`

## Herramienta

Cursor no expuso MCP de navegador en este entorno.  
Se usó un runner efímero con **puppeteer-core + Chrome del sistema** en `audit-artifacts/runner/` (carpeta ignorada por Git; **no** es dependencia de la app).

## Resultados

- Pruebas automatizadas asistidas: **42 pass / 0 fail / 2 notes**
- Capturas: `audit-artifacts/screenshots/` (gitignored)
- Informe JSON: `audit-artifacts/qa-report.json` (gitignored)

## Notas

1. Todos los productos del dataset tienen **una sola presentación**; no hubo UI multi-presentación que ejercitar.
2. El `console.error` de JSON corrupto en localStorage es esperado durante la prueba de recuperación.
3. Hero: se adoptó `hero.webp` (~191 KB) conservando `hero.png` (~944 KB). AVIF (~94 KB) se evaluó y no se publicó en `public/`.

## E2E permanente

No se instaló Playwright en el proyecto.  
Recomendación: fase siguiente con Playwright (o equivalente) versionado para CI.
