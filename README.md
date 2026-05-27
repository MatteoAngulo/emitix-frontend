# Emitix Frontend

Frontend del sistema de facturación electrónica **Emitix**, construido con Next.js 16, React 19, TypeScript y Tailwind CSS v4.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + shadcn/ui + Radix UI
- **Estilos:** Tailwind CSS v4
- **Formularios:** React Hook Form + Zod
- **Gráficos:** Recharts
- **Iconos:** Lucide React
- **Package manager:** pnpm (obligatorio)

## Requisitos previos

- **Node.js** >= 18
- **pnpm** >= 9 (`npm install -g pnpm`)
- Backend de Emitix corriendo en `http://localhost:8080` (ver `emitix-back/`)

## Puesta en marcha

1. **Clonar el repositorio** e ir a la carpeta del frontend:

   ```bash
   cd "Emitix Frontend"
   ```

2. **Configurar variables de entorno.** Crear un archivo `.env.local` en la raíz del frontend:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

   Ajustar la URL si el backend corre en otro host o puerto.

3. **Instalar dependencias:**

   ```bash
   pnpm install
   ```

   > `npm install` y `yarn install` están bloqueados por un hook `preinstall`. Usar siempre `pnpm`.

4. **Iniciar el servidor de desarrollo:**

   ```bash
   pnpm dev
   ```

   La app estará disponible en [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

| Comando        | Descripción                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Servidor de desarrollo (hot reload)  |
| `pnpm build`   | Build de producción                  |
| `pnpm start`   | Servir el build de producción        |
| `pnpm lint`    | Ejecutar ESLint                      |

## Estructura del proyecto

```
app/
├── page.tsx                        # Página de login
├── (dashboard)/
│   ├── dashboard/page.tsx          # Dashboard principal
│   ├── invoices/
│   │   ├── page.tsx                # Listado de facturas
│   │   ├── new/page.tsx            # Crear factura
│   │   └── [id]/page.tsx           # Detalle de factura
│   ├── users/page.tsx              # Gestión de usuarios
│   ├── settings/page.tsx           # Configuración
│   ├── reports/page.tsx            # Reportes
│   └── activity/page.tsx           # Log de actividad
components/
├── ui/                             # Primitivos shadcn/ui
├── layout/                         # Sidebar y header
└── auth/                           # RoleGate y componentes de auth
contexts/
└── AuthContext.tsx                  # Proveedor de autenticación
lib/api/
├── client.ts                       # Wrapper central (apiFetch)
├── types.ts                        # DTOs tipados
├── auth.ts, invoices.ts, ...       # Módulos por dominio
```

## Autenticación

- JWT almacenado en `localStorage` (clave `emitix_token`)
- Cookie `emitix_session` para protección de rutas en middleware server-side
- Roles jerárquicos: `VIEWER < ACCOUNTANT < ADMIN < SUPER_ADMIN`
- Componente `RoleGate` para renderizado condicional por rol

## Path alias

`@/` apunta a la raíz del frontend (`Emitix Frontend/`).
