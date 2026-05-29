# Deployment Guide

## Current Status

- Local Next build: passed.
- Local Docker Compose: configured for native Caddy reverse proxy.
- App image: about `197MB`.
- Production VPS/domain/HTTPS: not done yet.
- Manual testing checklist: passed.
- Swagger UI route: `/api-docs`.
- OpenAPI JSON route: `/api/openapi`.

## Local Docker Smoke Test

Prerequisite: Docker Desktop must be running.

1. Create `.env` and update values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost
```

2. Build and run:

```powershell
docker compose up -d --build
```

3. Open:

```text
http://localhost
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

1. Create VPS.
2. Point domain A record to VPS IP.
3. Install Docker and Docker Compose plugin.
4. Clone repository:

```bash
git clone https://github.com/Ngocon2004/hotel-booking.git
cd hotel-booking
```

5. Create `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

6. Start containers:

```bash
docker compose up -d --build
```

7. HTTPS is handled by native Caddy.

Point the domain `A` record to the VPS IP before starting the stack. The Docker app listens on `127.0.0.1:3000`; Caddy listens on ports `80` and `443`, proxies to the app, requests the Let's Encrypt certificate automatically, stores it in Caddy's host storage, and renews it automatically.

Install the Caddyfile:

```bash
sudo cp docker/caddy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

For production, set:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

If using Cloudflare proxy, set SSL/TLS mode to `Full` or `Full (strict)`.

8. Enable auto-start on VM reboot.

The Docker app uses `restart: unless-stopped`, and native Caddy is enabled with `systemctl enable caddy`. For a full VM reboot, install the included systemd unit so the Docker app is brought up after Docker starts:

```bash
sudo cp docker/systemd/hotel-booking.service /etc/systemd/system/hotel-booking.service
sudo systemctl daemon-reload
sudo systemctl enable --now hotel-booking.service
```

Check status and logs:

```bash
sudo systemctl status hotel-booking.service
docker compose ps
sudo journalctl -u caddy -f
```

If the repository is deployed somewhere other than `/home/hai/hotel-booking`, update `WorkingDirectory` in `docker/systemd/hotel-booking.service` before copying it.

9. Verify:

- `https://your-domain.com`
- `https://your-domain.com/rooms`
- `https://your-domain.com/api-docs`
- `https://your-domain.com/api/openapi`
- Admin protected redirect.
- Customer login/search/booking.
- Admin booking lifecycle.

## Supabase Production URL Config

In Supabase Dashboard, update Authentication URL Configuration:

```text
Site URL: https://your-domain.com
Redirect URLs:
https://your-domain.com/auth/callback
```

For Google OAuth, Google Cloud authorized redirect URI remains Supabase callback:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

## Notes

- Next.js client env values with `NEXT_PUBLIC_*` are baked during build.
- If env changes, rebuild the image.
- Use `docker compose up -d --build` from the repository root. Compose reads `.env` for build args and passes it to the app container. Native Caddy reads `/etc/caddy/Caddyfile`.
- After deploy, update `README.md` with the production URL.
