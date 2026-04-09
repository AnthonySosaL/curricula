# Curricula — Frontend

SPA construida con **React 19** + **Vite 8** + **Tailwind CSS 4** + **shadcn/ui**, desplegada en Vercel.

---

## Estructura del proyecto

```
src/
├── index.css                  ← Tokens CSS globales (colores, tipografía)
├── main.tsx                   ← Entry point
├── App.tsx                    ← Router principal (react-router-dom v7)
├── lib/
│   ├── api.ts                 ← Cliente Axios centralizado (prefijo /api automático)
│   └── utils.ts               ← cn() helper para Tailwind (shadcn)
├── styles/
│   └── colors.ts              ← Paleta de colores documentada con psicología
├── types/
│   └── api.ts                 ← Tipos TypeScript de la API
├── stores/
│   └── auth.store.ts          ← Estado de autenticación (Zustand + persist)
├── hooks/
│   └── useAuth.ts             ← useLogin, useRegister, useLogout (react-query)
├── components/
│   ├── ui/                    ← Componentes shadcn/ui (agregar con CLI)
│   ├── shared/
│   │   └── ProtectedRoute.tsx ← Guard de rutas privadas
│   └── layout/                ← Layouts reutilizables
└── pages/
    ├── auth/
    │   └── LoginPage.tsx
    └── dashboard/
        └── DashboardPage.tsx
```

---

## Cliente API — Prefijo /api

**Nunca** escribir `/api` manualmente en los servicios. El cliente en `src/lib/api.ts` lo agrega automáticamente:

```typescript
// Correcto
api.get('/users/me')      // → GET {BASE_URL}/api/users/me

// Incorrecto
api.get('/api/users/me')  // → GET {BASE_URL}/api/api/users/me
```

---

## Agregar componentes shadcn/ui

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add form
```

Se instalan en `src/components/ui/`.

---

## Sistema de colores

Tokens CSS en `index.css`, documentados en `src/styles/colors.ts`:

```css
color: var(--color-primary);        /* Azul #2563eb — confianza */
color: var(--color-success);        /* Verde #16a34a — progreso */
color: var(--color-accent);         /* Ámbar #f59e0b — CTA */
background: var(--color-bg);        /* Pizarra #f8fafc — fondo */
```

---

## Scripts

```bash
pnpm run dev     # Desarrollo en :5173 (proxy /api → :3001)
pnpm start       # Preview del build producción
pnpm build       # Compilar (tsc + vite build)
pnpm lint        # ESLint
```

---

## Variables de entorno

```bash
cp .env.example .env
```

| Variable            | Descripción                         |
|---------------------|-------------------------------------|
| `VITE_API_BASE_URL` | URL base del backend (sin `/api`)   |
| `VITE_APP_NAME`     | Nombre de la aplicación             |

---

## Despliegue en Vercel

1. Importar `frontend/` en Vercel (detecta Vite automáticamente)
2. Setear `VITE_API_BASE_URL` = URL del backend en Vercel
3. Deploy en cada push a `main`

---

## Convenciones

- Alias `@/` → `src/`
- Máximo **600 líneas** por archivo
- Formularios: `react-hook-form` + `zod`
- Peticiones: `@tanstack/react-query`
- Estilos: Tailwind + CSS tokens (`var(--color-*)`)
