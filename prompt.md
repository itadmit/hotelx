להלן אפיון מעודכן, ממוקד Next.js + PostgreSQL, כולל דף בית שיווקי, תהליך הרשמה, ושאר העמודים – באנגלית, כדי שתוכל להשתמש בזה מול מלון / מפתח.

1. Tech Stack

Core:

Frontend & Backend: Next.js (App Router)

Language: TypeScript

Database: PostgreSQL

ORM: Prisma

Styling: Tailwind CSS

Auth: NextAuth.js (Email/Password + Optional SSO)

i18n: next-intl / next-i18next (multi-language)

Modern Fonts (Google Fonts):

Primary: Inter / Plus Jakarta Sans / Poppins

Optional RTL: Noto Sans Hebrew (אם תרצה גם עברית)

2. High-Level Architecture

Public Marketing Site (for hotels):

Landing page, pricing, features, FAQ, contact.

CTA → “Start Free Trial” / “Book a Demo”.

App Area (Secure):

Dashboard for hotel managers and staff.

QR guest web app for hotel guests (mobile-first).

3. Pages & Routes
🔹 Public / Marketing

Homepage – /

Hero section:

Headline: “Upgrade Your Hotel Service with QR-Based Requests”

Subheadline: “Guests scan. Staff responds. Managers see everything.”

CTA buttons:

[Start Free Trial] → /signup

[Book a Live Demo] → /demo

Sections:

How it works (3 steps, with icons)

Features grid (Guest app / Staff dashboard / Analytics / Multi-language)

For Guests vs For Staff vs For Managers

Screenshots / mockups

Testimonials / logos of hotels (עתידי)

Pricing teaser

Pricing – /pricing

Plans:

Basic / Pro / Enterprise

Per-room / per-property logic (טקסט בלבד בשלב זה)

“Contact sales” for big hotels.

Features – /features

Detailed breakdown:

Guest QR app

Staff task board

Manager analytics

Multi-language engine

Each עם אייקון וטקסט קצר.

About – /about (אופציונלי)

Vision, company info, trust, security highlights.

Contact / Demo – /contact או /demo

Form:

Hotel name

Contact person

Email / Phone

Country / City

Number of rooms

After submit → CRM / email notification.

🔹 Auth

Login – /login

Email + Password.

“Forgot password?” link.

“Don’t have an account? Sign up.”

Signup – /signup

Step 1: Account

Name, Email, Password.

Step 2: Hotel info

Hotel Name, Country, City, Timezone, Default Language.

Step 3: Finish & redirect → /dashboard.

Forgot Password – /forgot-password

Email input → send reset link.

Reset Password – /reset-password?token=…

New password form.

🔹 App – Hotel Dashboard (Secure Area)

Base path: /dashboard

Dashboard Overview – /dashboard

KPIs:

Open Requests

Average Response Time

Requests Today

Most requested service

Graph (Last 7 days)

Shortcut buttons: “Add Service”, “Add Room”, “Generate QR”

Hotel Settings – /dashboard/hotel-settings

Hotel name, logo upload, default language.

Branding:

Primary color, accent color.

Font choice (Inter / Poppins).

Timezone & locale.

Rooms Management – /dashboard/rooms

Table of rooms:

Room number / name

QR URL

Status (Active / Inactive)

Actions:

Add room

Bulk import (CSV)

Generate QR (link to design/preview)

Room Detail – /dashboard/rooms/[roomId]

Room info.

QR preview.

Last requests for that room.

Services Management – /dashboard/services

List of services (filtered by category):

Name, Category (Room Service, Cleaning, Spa, Transport)

Price (optional)

Active/Inactive

Actions:

Add service

Duplicate service

Attach to specific room groups (optional future)

Service Editor – /dashboard/services/[serviceId]

Fields:

Name (internal)

Guest visible name (by language)

Description (by language)

Category

Price

Estimated response time

Icon / emoji

QR Management – /dashboard/qr

List of rooms with:

Room number

QR code preview

Download options (PNG/PDF)

Option to customize:

Add hotel logo on QR flyer

Instructions text (“Scan to order room service”)

Requests Board – /dashboard/requests

Kanban-style columns:

New / In Progress / Done

Cards showing:

Room, Service, Time since created, Notes.

Filters:

By service type / room / date.

Actions:

Assign to staff member

Change status

Add internal note.

Reports & Analytics – /dashboard/reports

Charts:

Requests per day / week.

Top services.

Avg response time.

Date range filter.

Export to CSV / PDF.

Team Management – /dashboard/team

Staff users list:

Name, Role (Manager / Reception / Service)

Status (Active/Inactive)

Invite new staff (email).

🔹 Guest QR Web App

Base path לדוגמה: /g/[hotelSlug]/[roomCode]

Guest Home – /g/[hotelSlug]/[roomCode]

Detect / select language:

If browser lang supported → auto.

Else show language picker.

Hero:

“Welcome to [Hotel Name]”

Room number display.

Categories grid:

Room Service, Cleaning, Transport, Maintenance, Info.

Category Page – /g/[hotelSlug]/[roomCode]/[categorySlug]

List services in that category.

Each card:

Name, short description, icon, optional price.

Click → open request form.

Service Request Page – /g/[hotelSlug]/[roomCode]/service/[serviceId]

Service details.

Optional fields:

Quantity

Time preference (“Now” / “In 30 minutes”)

Free-text notes.

Button: Submit Request

After submit:

Show confirmation + status page.

Request Status – /g/[hotelSlug]/[roomCode]/request/[requestId]

Shows:

Status (New/In Progress/Done)

Room

Service

Last update time.

Optional: auto-refresh every X seconds.

4. Database – PostgreSQL (High-Level)

טבלאות עיקריות (בקצרה):

users

hotels

rooms

services

service_translations

requests

staff_assignments

pricing_plans (עתידי)

sessions / accounts (NextAuth)

(אם תרצה, אכתוב לך גם סכמת Prisma מלאה.)

5. UI & Fonts

Base layout:

Top nav (logo + menu: Features, Pricing, Login, Signup)

Centered hero עם טקסט גדול + mockup מסך.

Components:

Feature cards (rounded corners, subtle shadow)

Gradient backgrounds (blue → teal)

Icons from Lucide / Heroicons.

Fonts:

Inter or Plus Jakarta Sans for body text.

Poppins or DM Sans for headings.

Line height גדול, plenty of white space.