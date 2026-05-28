# Source Structure

This project uses the Next.js 16 App Router under `src/app`.

## Folders

- `app/`: routes, route groups, layouts, pages, loading/error/not-found files.
- `app/(public)/`: public customer-facing routes such as `/`, `/rooms`, `/search`, booking pages and my-bookings pages.
- `app/(auth)/auth/`: authentication routes. The group keeps the URL as `/auth/...`.
- `app/(admin)/admin/`: admin routes. The group keeps the URL as `/admin/...`.
- `app/api/openapi/`: OpenAPI JSON route for Swagger UI.
- `app/api-docs/`: Swagger UI HTML route.
- `components/ui/`: reusable shadcn/base-ui primitives.
- `components/layout/`: shared shell components such as navbar and footer.
- `components/admin/`: admin-specific UI components.
- `components/booking/`: booking search and booking form UI.
- `components/rooms/`: room catalog and room detail UI components.
- `components/reviews/`: review form UI.
- `components/animations/`: GSAP animation helpers.
- `lib/`: shared clients, validators, OpenAPI document, and utilities.
- `server/actions/`: server actions used by forms and mutations.
- `types/`: shared TypeScript types.

## Conventions

- Keep `src/app` focused on routing and route-specific composition.
- Put reusable UI in `src/components`.
- Put mutation logic in `src/server/actions` with a top-level `'use server'`.
- Put Supabase clients, validators, OpenAPI metadata, and formatting helpers in `src/lib`.
- Route handlers use the Web `Request`/`Response` APIs according to Next.js 16 docs.
