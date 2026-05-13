-- Neon PostgreSQL: add email to leads (project uses raw SQL migrations, not Prisma).
-- Run in Neon SQL editor or: psql "$DATABASE_URL" -f lib/migrations/002_leads_email.sql

ALTER TABLE leads ADD COLUMN IF NOT EXISTS email TEXT;
