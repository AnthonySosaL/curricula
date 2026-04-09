# Curricula — Backend

API REST construida con **NestJS 11** + **Prisma 7** + **Neon PostgreSQL**, desplegada en Vercel como función serverless.

---

## Arquitectura en capas

```
src/
├── main.ts                     ← Bootstrap: CORS, ValidationPipe, GlobalPrefix (/api)
├── app.module.ts               ← Módulo raíz
├── config/
│   └── configuration.ts        ← Configuración centralizada desde .env
├── common/
│   ├── prisma/
│   │   ├── prisma.service.ts   ← PrismaClient injectable (@Global)
│   │   └── prisma.module.ts
│   ├── filters/
│   │   └── http-exception.filter.ts  ← Formato uniforme de errores
│   ├── guards/
│   │   └── jwt-auth.guard.ts         ← Guard JWT reutilizable
│   └── decorators/
│       └── current-user.decorator.ts ← @CurrentUser() param decorator
└── modules/
    ├── auth/
    │   ├── dto/                ← RegisterDto, LoginDto (class-validator)
    │   ├── strategies/
    │   │   └── jwt.strategy.ts ← Passport JWT strategy
    │   ├── auth.service.ts
    │   ├── auth.controller.ts  ← POST /api/auth/register, /api/auth/login
    │   └── auth.module.ts
    ├── users/
    │   ├── dto/                ← UpdateUserDto
    │   ├── entities/
    │   │   └── user.entity.ts  ← Mapeo Prisma → respuesta (sin password)
    │   ├── users.repository.ts ← Capa de datos (solo queries Prisma)
    │   ├── users.service.ts    ← Capa de lógica de negocio
    │   ├── users.controller.ts ← Capa de presentación (rutas REST)
    │   └── users.module.ts
    └── health/
        └── health.controller.ts ← GET /api/health
```

### Flujo de request

```
HTTP → Controller (DTO validation) → Service (business logic) → Repository (Prisma) → Neon DB
```

---

## Endpoints disponibles

| Método | Ruta                  | Auth | Descripción               |
|--------|-----------------------|------|---------------------------|
| GET    | `/api/health`         | No   | Estado del servicio       |
| POST   | `/api/auth/register`  | No   | Registro de usuario       |
| POST   | `/api/auth/login`     | No   | Login → retorna JWT       |
| GET    | `/api/users`          | JWT  | Listar usuarios           |
| GET    | `/api/users/me`       | JWT  | Perfil del usuario actual |
| GET    | `/api/users/:id`      | JWT  | Usuario por ID            |
| PATCH  | `/api/users/:id`      | JWT  | Actualizar usuario        |
| DELETE | `/api/users/:id`      | JWT  | Eliminar usuario          |

---

## Scripts

```bash
pnpm run dev          # Desarrollo con hot-reload (:3001)
pnpm start            # Producción (node dist/main)
pnpm build            # Compilar TypeScript → dist/
pnpm migrate:dev      # Crear y aplicar migración (desarrollo)
pnpm migrate:deploy   # Aplicar migraciones en producción
pnpm prisma:studio    # UI visual de la base de datos
pnpm test             # Tests unitarios
```

---

## Variables de entorno

```bash
cp .env.example .env
```

| Variable        | Descripción                                   |
|-----------------|-----------------------------------------------|
| `DATABASE_URL`  | Neon pooled URL (para runtime serverless)     |
| `DIRECT_URL`    | Neon direct URL (para migraciones Prisma CLI) |
| `JWT_SECRET`    | Mínimo 32 caracteres                          |
| `JWT_EXPIRES_IN`| Ej: `7d`, `24h`                              |
| `FRONTEND_URL`  | URL del frontend para CORS                    |
| `PORT`          | Default: `3001`                               |

---

## Despliegue en Vercel

`vercel.json` ya configurado. Vercel usa **Fluid Compute** (reduce cold starts a ~0).

1. Importar carpeta `backend/` en Vercel como proyecto separado
2. Agregar variables de entorno en el dashboard
3. Deploy en cada push a `main`

**Limitaciones serverless:**
- Sin filesystem persistente (solo `/tmp`)
- Neon maneja connection pooling automáticamente en modo pooled

---

## Base de datos — Neon PostgreSQL

**Nombre:** `curricula`

```bash
# Primera vez
pnpm migrate:dev --name init

# Producción
pnpm migrate:deploy
```

---

## Agregar módulos nuevos

```
src/modules/NOMBRE/
  dto/create-NOMBRE.dto.ts
  dto/update-NOMBRE.dto.ts
  entities/NOMBRE.entity.ts
  NOMBRE.repository.ts   ← Solo queries Prisma (sin lógica)
  NOMBRE.service.ts      ← Lógica + errores de dominio
  NOMBRE.controller.ts   ← Rutas + guards
  NOMBRE.module.ts       ← Registrar en app.module.ts
```

Regla: **ningún archivo > 600 líneas**. Extraer helpers si se acerca al límite.
