# RentBasket CXOS — Review & Feedback System

A premium, controlled review capture and sentiment routing engine for RentBasket.

## 🚀 Quick Start

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    CXOS_ADMIN_KEY=cxos-admin-secret-key-change-in-production
    GOOGLE_REVIEW_URL=https://g.page/r/CbzyDhZ0C2a7EBM/review
    ```

3.  **Database Migration:**
    Run the SQL scripts in your Supabase SQL Editor to set up the schema:
    - `supabase/migrations/001_initial_schema.sql` (Base tables)
    - `supabase/migrations/002_add_customer_details.sql` (Customer details extension)

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Access Points

### 1. Verified Customer Flow
Simulate a verified customer arriving from an email link. This flow allows for **Coupons** and **Google Review limits**.

- **URL:** `http://localhost:3000/verify?token=TEST_USER_123`
- **Behavior:**
    - Auto-detects "Valued Customer".
    - 5-Star Rating → Prompts for Google Review + Coupon.
    - < 5-Star Rating → Opens Support Ticket + Coupon.

### 2. Non-Customer / Guest Flow
For users without a token or walk-in traffic.

- **URL:** `http://localhost:3000/verify` (or click "Verify manually")
- **Behavior:**
    - Asks for **Name** and **Mobile Number**.
    - Allows feedback submission.
    - **No Coupon** generated.
    - **Spam Check:** Mobile number is checked against the 6-month review limit.

### 3. Admin War Room
Real-time dashboard for CX leadership.

- **URL:** `http://localhost:3000/admin`
- **Features:**
    - Live NPS & CSAT scores.
    - **Filters:** View by Sentiment, Customer Type, or Date.
    - **SLA Tracker:** Countdown for urgent tickets.
    - **Feed:** Live stream of incoming reviews with customer identity.

---

## 🛠️ Key Features implemented

- **Sentiment Routing:** Promoters get redirected to Google; Detractors get a support ticket.
- **Spam Protection:** 6-month cooldown period enforced via Customer ID (for verified) or Mobile Number (for guests).
- **Admin Dashboard:** Auto-refreshing "War Room" view with filters.
- **Premium UI:** Custom Star Rating component and smooth transitions.
