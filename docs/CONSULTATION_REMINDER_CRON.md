# Consultation discovery reminder cron

Soft T+2d discovery reminders for marketing consultation requests.

Hub Mail has no native delayed send. This site queues due reminders in Postgres (`consultation_leads`) and exposes a cron endpoint.

## Required for automated reminders

- `DATABASE_URL` (Railway Postgres linked to the web service)
- `AUTH_MAIL_SECRET` + `AUTH_URL` + `AUTH_CLIENT_ID` (Hub Mail)
- `CRON_SECRET` (preferred) or reuse `AUTH_MAIL_SECRET` as Bearer token

## Schedule

Railway cron / external scheduler:

```http
POST https://www.roalla.com/api/cron/consultation-reminders
Authorization: Bearer $CRON_SECRET
```

`GET` is also accepted with the same auth for simple ping-style schedulers.

## Fallback when `DATABASE_URL` is unset

- Client + sales confirmation emails still include the Digital Enablement URL
- Sales email includes a T+2 nudge tip for manual follow-up
- Cron endpoint returns `{ processed: 0, databaseConfigured: false }`

## Notes

- Cold traffic always gets `https://app.roalla.com/digital-enablement` (never `/digitaldiscovery`)
- Reminder is sent once per `CR-*` submission; sales can still re-share the link manually
