# Curricula — Plataforma educativa

Monorepo con frontend React + Vite y backend NestJS, ambos desplegados en **Vercel**.

---

## Stack tecnológico

| Capa       | Tecnología                                  | Versión |
|------------|---------------------------------------------|---------|
| Frontend   | React + Vite + shadcn/ui + Tailwind CSS 4   | 19 / 8  |
| Backend    | NestJS + Prisma ORM                         | 11 / 7  |
| Base datos | Neon PostgreSQL (serverless)                | —       |
| Auth       | JWT con passport-jwt                        | —       |
| Deploy     | Vercel (frontend + backend como serverless) | —       |
| Package    | pnpm                                        | 10      |
| Node       | v22 LTS                                     | 22      |

---

## Estructura del proyecto

```
curriculum/
├── .nvmrc               ← Node version (22)
├── README.md            ← Este archivo
├── frontend/            ← React + Vite
│   ├── README.md
│   ├── src/
│   │   ├── lib/api.ts   ← Cliente HTTP centralizado (/api prefix)
│   │   ├── styles/colors.ts  ← Paleta de colores (psicología)
│   │   ├── stores/      ← Zustand (estado global)
│   │   ├── hooks/       ← Custom hooks (react-query)
│   │   ├── pages/       ← Vistas por dominio
│   │   ├── components/  ← Componentes reutilizables + shadcn/ui
│   │   └── types/       ← Tipos TypeScript compartidos
│   └── .env.example
└── backend/             ← NestJS
    ├── README.md
    ├── vercel.json      ← Configuración serverless
    ├── prisma/
    │   └── schema.prisma
    ├── src/
    │   ├── common/      ← Guards, filtros, decoradores, Prisma service
    │   ├── config/      ← Configuración centralizada
    │   └── modules/     ← Módulos por dominio (auth, users, health)
    └── .env.example
```

---

## Convenciones de versionamiento

```
MAJOR.MINOR.PATCH  →  1.0.0
```

- **MAJOR**: cambio que rompe compatibilidad (nuevo modelo de datos, auth distinta)
- **MINOR**: nueva feature sin romper lo existente
- **PATCH**: bugfix, ajuste de estilos, refactor interno

### Ramas

| Rama        | Propósito                                |
|-------------|------------------------------------------|
| `main`      | Producción — se despliega en Vercel      |
| `develop`   | Integración de features en desarrollo    |
| `feat/*`    | Nuevas funcionalidades                   |
| `fix/*`     | Corrección de errores                    |
| `chore/*`   | Mantenimiento (deps, config, docs)       |

### Commits (Conventional Commits)

```
feat(auth): agregar registro de usuarios
fix(users): corregir validación de email
chore(deps): actualizar prisma a 7.8
docs(readme): actualizar instrucciones de despliegue
```

---

## Inicio rápido

### Prerrequisitos

- Node 22 (`nvm use 22` — ver `.nvmrc`)
- pnpm instalado globalmente

### Backend

```bash
cd backend
cp .env.example .env        # Configurar variables
pnpm install
pnpm run dev                # Desarrollo con hot-reload en :3001
pnpm build                  # Compilar para producción
```

### Frontend

```bash
cd frontend
cp .env.example .env        # Configurar variables
pnpm install
pnpm run dev                # Desarrollo en :5173 con proxy a :3001
pnpm build                  # Compilar para producción
```

---

## Despliegue en Vercel

### Backend

1. Importar carpeta `backend/` en Vercel como proyecto separado
2. Agregar variables de entorno en el dashboard de Vercel
3. `vercel.json` ya está configurado — Vercel detecta NestJS automáticamente

### Frontend

1. Importar carpeta `frontend/` en Vercel como proyecto separado
2. Setear `VITE_API_BASE_URL` apuntando al dominio del backend
3. Vercel detecta Vite automáticamente

### Base de datos (Neon)

1. Crear cuenta en [neon.tech](https://console.neon.tech)
2. Crear base de datos llamada `curricula`
3. Copiar `DATABASE_URL` (pooled) y `DIRECT_URL` (direct) al backend `.env`
4. Ejecutar migraciones: `pnpm migrate:deploy`

---

## Psicología de colores

Ver `frontend/src/styles/colors.ts` para la paleta completa documentada.

| Token                   | Color        | Significado psicológico        |
|-------------------------|--------------|-------------------------------|
| `--color-primary`       | Azul `#2563eb`    | Confianza, conocimiento, autoridad |
| `--color-success`       | Verde `#16a34a`   | Crecimiento, logro, progreso       |
| `--color-accent`        | Ámbar `#f59e0b`   | Energía, llamado a la acción       |
| `--color-danger`        | Rojo `#ef4444`    | Error, alerta, acción destructiva  |
| `--color-bg`            | Pizarra `#f8fafc` | Limpieza, neutralidad              |

---

## Variables de entorno requeridas

### Backend (`.env`)

| Variable        | Descripción                        | Requerida |
|-----------------|------------------------------------|-----------|
| `DATABASE_URL`  | Neon pooled connection string       | ✅         |
| `DIRECT_URL`    | Neon direct connection string       | ✅         |
| `JWT_SECRET`    | Secreto para firmar tokens JWT     | ✅         |
| `JWT_EXPIRES_IN`| Duración del token (ej: `7d`)      | ✅         |
| `FRONTEND_URL`  | URL del frontend para CORS         | ✅         |
| `PORT`          | Puerto del servidor (default 3001) | —         |
| `NODE_ENV`      | `development` o `production`       | —         |

### Frontend (`.env`)

| Variable              | Descripción                          | Requerida |
|-----------------------|--------------------------------------|-----------|
| `VITE_API_BASE_URL`   | URL base del backend sin `/api`      | ✅         |
| `VITE_APP_NAME`       | Nombre de la aplicación              | —         |
| `VITE_APP_VERSION`    | Versión de la app                    | —         |
