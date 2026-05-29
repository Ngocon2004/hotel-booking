# Deployment Guide

## Current Status

- Local Next build: passed.
- Local Docker Compose: app production runs on `127.0.0.1:3000`.
- App image: about `197MB`.
- Domain prepared: `dghahai.io.vn` at BKNS.
- Production VPS/domain/HTTPS: not confirmed as completed yet.
- Manual testing checklist: passed.
- Swagger UI route: `/api-docs`, admin-only.
- OpenAPI JSON route: `/api/openapi`, admin-only.

## Local Docker Smoke Test

Prerequisite: Docker Desktop must be running.

1. Create `.env` and update values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. Build and run:

```powershell
docker compose up -d --build
```

3. Open:

```text
http://localhost:3000
```

4. Useful checks:

```powershell
docker compose ps
docker images hotel-booking-app
```

5. Stop:

```powershell
docker compose down
```

## VPS Deployment Checklist

1. Create VPS and install Docker + Docker Compose plugin.

2. Point domain DNS:

```text
Type: A
Name: @
Value: <VPS_IP>
```

If using `www.dghahai.io.vn`, add:

```text
Type: CNAME
Name: www
Value: dghahai.io.vn
```

3. Clone repository:

```bash
git clone https://github.com/Ngocon2004/hotel-booking.git
cd hotel-booking
```

4. Create `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://dghahai.io.vn
```

5. Start the app container:

```bash
docker compose up -d --build
```

The current compose file exposes the app on the host loopback:

```text
127.0.0.1:3000 -> container 3000
```

That means an external reverse proxy should terminate HTTP/HTTPS and proxy to `127.0.0.1:3000`.

## HTTPS Options

### Option A: Caddy On VPS

Use Caddy if you want automatic Let's Encrypt certificates.

Example Caddyfile:

```caddyfile
dghahai.io.vn {
    reverse_proxy 127.0.0.1:3000
}
```

Then reload Caddy:

```bash
sudo systemctl reload caddy
```

The repository also includes `docker/caddy/Caddyfile` as a reference, but the current default compose file only starts the app container.

### Option B: Nginx + Certbot

Use Nginx if the VPS already has Nginx.

Proxy target:

```text
http://127.0.0.1:3000
```

Then issue SSL with Certbot for `dghahai.io.vn`.

### Option C: Cloudflare Proxy

If DNS is managed through Cloudflare, enable proxy and set SSL/TLS mode to `Full` or `Full (strict)`. The VPS still needs a reverse proxy listening on port 80/443.

## Supabase Production URL Config

In Supabase Dashboard, update Authentication URL Configuration:

```text
Site URL: https://dghahai.io.vn
Redirect URLs:
https://dghahai.io.vn/auth/callback
```

For Google OAuth, Google Cloud authorized redirect URI remains Supabase callback:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

## Production Verification

After deploy, verify:

- `https://dghahai.io.vn`
- `https://dghahai.io.vn/about`
- `https://dghahai.io.vn/rooms`
- Customer login/search/booking/cancel.
- Admin login/dashboard/booking lifecycle.
- Realtime booking toast/status.
- `/api-docs` when not logged in redirects to login.
- `/api-docs` as customer redirects to home.
- `/api-docs` as admin shows Swagger UI.
- `/api/openapi` follows the same admin-only rule.

## Notes

- Next.js client env values with `NEXT_PUBLIC_*` are baked during build.
- If env changes, rebuild the image with `docker compose up -d --build`.
- Keep `NEXT_PUBLIC_SITE_URL` aligned with the public URL, otherwise OAuth/callback flow can redirect to the wrong host.
- After production is stable, update `README.md` with the final production URL.
