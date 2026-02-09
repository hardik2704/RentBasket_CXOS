# Database Migration Guide

## Why do we need a migration?
Since we are starting a **new project** from scratch, "migration" here means **initializing the database schema**. We are migrating from "nothing" (an empty database) to "fully structured tables".

## What does it do?
The SQL script sets up the entire backend foundation:
1.  **Tables**: Creates `reviews`, `support_tickets`, `coupons`, etc.
2.  **Security**: Sets up initial Row Level Security (RLS) policies.
3.  **Automation**: Creates triggers to auto-update `updated_at` timestamps.
4.  **Analytics**: Creates "Views" (virtual tables) for the Admin Dashboard to read stats easily.

## Where to run it?
1.  Go to your **Supabase Dashboard** (https://supabase.com/dashboard/project/utvsykiekidmaszjsrbu).
2.  Click on **SQL Editor** in the left sidebar (icon with `>_`).
3.  Click **New Query**.
4.  Copy the contents of `supabase/migrations/001_initial_schema.sql` from your project.
5.  Paste it into the query window.
6.  Click **Run**.
