-- Automation + admin SEO engine tables (Neon PostgreSQL)
-- Run manually against DATABASE_URL or via Neon SQL editor.

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  state TEXT NOT NULL,
  timing TEXT,
  injuries TEXT,
  source TEXT,
  ghl_synced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_queue (
  id SERIAL PRIMARY KEY,
  topic TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  target_keyword TEXT,
  state VARCHAR(50),
  city VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  generated_content TEXT,
  file_path TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  generated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS automation_logs (
  id SERIAL PRIMARY KEY,
  channel VARCHAR(50) NOT NULL,
  action TEXT NOT NULL,
  status VARCHAR(20) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reddit_posts (
  id SERIAL PRIMARY KEY,
  subreddit TEXT,
  post_title TEXT,
  post_url TEXT,
  our_comment TEXT,
  reddit_comment_id TEXT,
  status VARCHAR(20) DEFAULT 'posted',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  phone TEXT,
  state TEXT,
  source VARCHAR(50),
  sequence_name VARCHAR(50) DEFAULT 'main',
  sequence_day INTEGER DEFAULT 0,
  last_email_sent TIMESTAMP,
  unsubscribed BOOLEAN DEFAULT FALSE,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS autocomplete_tracking (
  id SERIAL PRIMARY KEY,
  phrase TEXT NOT NULL,
  appearing BOOLEAN DEFAULT FALSE,
  position INTEGER,
  suggestions JSONB,
  checked_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outreach_prospects (
  id SERIAL PRIMARY KEY,
  site_name TEXT,
  site_url TEXT,
  contact_email TEXT,
  status VARCHAR(20) DEFAULT 'prospecting',
  emails_sent INTEGER DEFAULT 0,
  last_contact TIMESTAMP,
  linked BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS press_releases (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  trigger_event TEXT,
  distributed BOOLEAN DEFAULT FALSE,
  distributed_at TIMESTAMP,
  distribution_urls JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_posts (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50),
  content TEXT,
  source_slug TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  posted_at TIMESTAMP,
  post_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webinar_registrations (
  id SERIAL PRIMARY KEY,
  webinar_slug TEXT,
  first_name TEXT,
  email TEXT,
  phone TEXT,
  state TEXT,
  registered_at TIMESTAMP DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  converted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS automation_settings (
  id SERIAL PRIMARY KEY,
  channel VARCHAR(50) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  rate_limit_per_day INTEGER DEFAULT 10,
  updated_at TIMESTAMP DEFAULT NOW()
);
