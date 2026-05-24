# Source Structure

This project uses the Next.js App Router under `src/app`.

## Folders

- `app/`: routes, route groups, layouts, pages, loading/error/not-found files.
- `app/(public)/`: public customer-facing routes such as `/` and `/rooms`.
- `app/(auth)/auth/`: authentication routes. The group keeps the URL as `/auth/...`.
- `app/(admin)/admin/`: admin routes. The group keeps the URL as `/admin/...`.
- `components/ui/`: reusable shadcn/base-ui primitives.
- `components/layout/`: shared shell components such as navbar and footer.
- `components/admin/`: admin-specific UI components.
- `components/rooms/`: room catalog and room detail UI components.
- `lib/`: shared clients, validators, and utilities.
- `server/actions/`: server actions used by forms and mutations.
- `types/`: shared TypeScript types.

## Conventions

- Keep `src/app` focused on routing and route-specific composition.
- Put reusable UI in `src/components`.
- Put mutation logic in `src/server/actions` with a top-level `'use server'`.
- Put Supabase clients, validators, and formatting helpers in `src/lib`.
