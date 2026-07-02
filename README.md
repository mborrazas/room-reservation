# Office Reserve

Meeting room booking app built with Next.js & TypeScript. REST API, conflict detection, layered backend/frontend architecture.

Sistema para reservar salas de reuniones. Podés listar, crear, editar y eliminar reservas, con detección de conflictos de horario por sala.

**Repo:** [github.com/mborrazas/room-reservation](https://github.com/mborrazas/room-reservation)

La app corre en español y arranca sin reservas — las salas ya vienen cargadas.

## Cómo correr el proyecto

Necesitás Node.js 20+ y npm.

```bash
# instalar dependencias
npm install

# levantar en desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

Otros comandos útiles:

```bash
npm test          # corre los tests (vitest)
npm run test:watch
npm run build     # build de producción
npm run start     # corre el build
npm run lint
```

No hace falta configurar variables de entorno ni levantar una base de datos.

## Tecnologías

| Área | Stack |
|------|-------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Toasts | Sonner |
| Tests | Vitest |
| Persistencia | In-memory (por ahora) |

## Estructura del proyecto

Separé el código en tres módulos para que sea fácil de mantener (y de sacar a otro repo si hiciera falta):

```
src/
├── backend/     dominio, repositorios, servicios y handlers HTTP
├── frontend/    componentes, hooks, cliente API y estilos
├── shared/      DTOs y utilidades compartidas
└── app/         solo el glue de Next.js (páginas y rutas /api)
```

`app/` es lo que Next.js exige para las rutas. La lógica real vive en `backend/` y `frontend/`.

## API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/bookings` | Listar reservas (acepta filtros por query) |
| `POST` | `/api/bookings` | Crear reserva |
| `GET` | `/api/bookings/:id` | Obtener una reserva |
| `PATCH` | `/api/bookings/:id` | Editar reserva |
| `DELETE` | `/api/bookings/:id` | Eliminar reserva |
| `GET` | `/api/rooms` | Listar salas activas |

Las respuestas siguen el formato `{ data: ... }` y los errores `{ error: { code, message } }`.

## Decisiones que tomé

**Capas separadas.** El dominio (`BookingService`, reglas de negocio, detección de conflictos) no depende de Next ni de React. Los repositorios tienen interfaz para poder cambiar la implementación sin tocar el servicio.

**DTOs en `shared/`.** El backend trabaja con `Date` en las entidades; la API y el frontend usan strings ISO. El mapeo está en `backend/http/mappers.ts`.

**Frontend consume la API, no el servicio directo.** Aunque todo vive en el mismo repo, la UI habla con `/api/*` como si fuera un backend externo. Eso deja la puerta abierta a separar proyectos después.

**Persistencia in-memory.** Para una prueba técnica me pareció suficiente. Los datos se pierden al reiniciar el servidor. Las salas vienen con seed fijo (Sala A y Sala B).

**Sin horario laboral ni duración máxima.** Solo valido duración mínima (15 min), que el fin sea después del inicio, y que no se pueda reservar en el pasado. Preferí no complicar la UX con restricciones de horario de oficina.

**Conflictos por sala.** Dos reservas confirmadas no pueden solaparse en la misma sala. Las canceladas no cuentan.

**Rutas REST con `[id]`.** `GET/PATCH/DELETE` van a `/api/bookings/:id` en lugar de usar query params.

## Supuestos

- Hay un conjunto fijo de salas predefinidas; no hay CRUD de salas.
- Un usuario puede reservar cualquier sala sin autenticación.
- Las reservas se eliminan en duro (hard delete), no se cancelan desde la UI.
- El campo `status` existe en el modelo (`confirmed` / `cancelled`) pero la UI no lo muestra ni permite cambiarlo.
- La zona horaria para mostrar fechas es la del navegador del usuario.
- No hay notificaciones, calendario externo ni permisos por rol.

## Tests

Hay tests unitarios del servicio de dominio, validación de formulario, ordenamiento de reservas, y tests de integración de los handlers HTTP.

```bash
npm test
```

## Mejoras que haría con más tiempo

- Persistencia real (SQLite o Postgres con Prisma)
- Seed de reservas de ejemplo para la demo
- Autenticación básica
- Filtros en la UI (por sala, fecha, organizador)
- Cancelar reservas en lugar de borrarlas
- CI con GitHub Actions (`test` + `build` en cada push)

## AI tooling (challenge disclosure)

Usé **Cursor** como IDE y **Cursor Agent (Auto)** como asistente de pair programming.

### Skills / MCPs

- **MCPs:** ninguno
- **Cursor Skills:** ninguno instalado fue invocado de forma explícita durante el desarrollo
