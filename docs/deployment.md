# Deployment Guide

## Current Status

- Local Next build: passed.
- Local Docker Compose: passed in previous smoke test.
- App image: about `197MB`.
- Production VPS/domain/HTTPS: not done yet.
- Swagger UI route: `/api-docs`.
- OpenAPI JSON route: `/api/openapi`.

## Local Docker Smoke Test

Prerequisite: Docker Desktop must be running.

1. Create `.env.production`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
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

5. Create `.env.production`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

6. Start containers:

```bash
docker compose up -d --build
```

7. Add HTTPS.

Recommended:

- Cloudflare proxy + SSL Full.
- Or replace Nginx with Caddy for automatic Let's Encrypt.
- Or keep Nginx and use Certbot.

8. Verify:

- `https://your-domain.com`
- `https://your-domain.com/rooms`
- `https://your-domain.com/api-docs`
- `https://your-domain.com/api/openapi`
- Admin protected redirect.

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
- After deploy, update `README.md` with the production URL.
