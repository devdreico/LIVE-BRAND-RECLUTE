# LIVE-BRAND-RECLUTE

Landing morada de reclutamiento + panel de gestión para **Live Brand**, agencia de crecimiento digital orientada a creadores de lives en TikTok.

## Stack

- React 18 + Vite
- Tailwind CSS (paleta morada: `#8B5CF6` → `#D946EF`)
- Datos 100% frontend persistidos en `localStorage`

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
npm run lint     # eslint
```

## Estructura

- `#/` — Landing pública: hero, beneficios, grid de streamers, métricas y formulario de postulación.
- `#/panel` — Panel interno (enlace "Panel interno" en el navbar o footer): KPIs, distribución de estados, listado de postulantes con búsqueda, filtros y cambio de estado.

## Funciones

- Formulario de postulación con validación (nombre, @TikTok, seguidores, viewers, categoría, horarios).
- Estados de postulante: pendiente → contactado → aprobado / rechazado.
- KPIs: total de postulantes, aprobados, conversión, pendientes, seguidores y horas de live acumuladas.
- Ficha de detalle con eliminación y cambio de estado.
- Seed de datos de ejemplo en `src/data/seedApplicants.js` y streamers en `src/data/mockStreamers.js`.
