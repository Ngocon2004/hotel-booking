# Deployment Guide

## Local Docker Smoke Test

Prerequisite: Docker Desktop must be running.

Latest local result: **passed on 2026-05-27**.

- Command: `docker compose up -d --build`
- Containers: `hotel-booking-app-1`, `hotel-booking-nginx-1`
- HTTP check: `http://localhost` returned `200`
- Current app image size after optional features: `hotel-booking-app:latest` is about `197MB`
- Docker target: passed `<200MB`

1. Create `.env.production` from `.env.example`.
2. Fill Supabase variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost
```

3. Build and run:

```powershell
docker compose up -d --build
```

4. Open:

```text
http://localhost
```

5. Stop:

```powershell
docker compose down
```

## VPS Deployment Checklist

1. Point domain A record to VPS IP.
2. Install Docker and Docker Compose plugin.
3. Clone the GitHub repository.
4. Create `.env.production` with production values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

5. Start containers:

```bash
docker compose up -d --build
```

6. Add SSL.

Recommended simple option: put Cloudflare in front of the VPS and enable HTTPS.

Alternative: replace Nginx with Caddy or add Certbot to issue Let's Encrypt certificates.

## Supabase Auth URLs

Add these in Supabase Authentication URL Configuration:

```text
https://your-domain.com/auth/callback
```

For Google OAuth, Google Cloud Authorized redirect URI remains the Supabase callback:

```text
https://fsafiqbloaewidbatsjv.supabase.co/auth/v1/callback
```
