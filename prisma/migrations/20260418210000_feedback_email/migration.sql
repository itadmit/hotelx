-- Hotel: feedback + reputation columns
ALTER TABLE "Hotel"
  ADD COLUMN IF NOT EXISTS "feedbackEnabled"   BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "feedbackThreshold" INTEGER NOT NULL DEFAULT 4,
  ADD COLUMN IF NOT EXISTS "googleReviewUrl"   TEXT,
  ADD COLUMN IF NOT EXISTS "bookingReviewUrl"  TEXT,
  ADD COLUMN IF NOT EXISTS "supportEmail"      TEXT;

-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FeedbackSentiment') THEN
    CREATE TYPE "FeedbackSentiment" AS ENUM ('POSITIVE', 'NEGATIVE');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FeedbackStatus') THEN
    CREATE TYPE "FeedbackStatus" AS ENUM ('NEW', 'IN_REVIEW', 'RESOLVED');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EmailTemplateKind') THEN
    CREATE TYPE "EmailTemplateKind" AS ENUM ('FEEDBACK_THANKS', 'FEEDBACK_APOLOGY', 'PASSWORD_RESET', 'TEAM_INVITE');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EmailStatus') THEN
    CREATE TYPE "EmailStatus" AS ENUM ('SENT', 'FAILED', 'SIMULATED');
  END IF;
END$$;

-- Add new NotificationType values (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'FEEDBACK_RECEIVED'
                 AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'NotificationType')) THEN
    ALTER TYPE "NotificationType" ADD VALUE 'FEEDBACK_RECEIVED';
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'FEEDBACK_ESCALATION'
                 AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'NotificationType')) THEN
    ALTER TYPE "NotificationType" ADD VALUE 'FEEDBACK_ESCALATION';
  END IF;
END$$;

-- Feedback table
CREATE TABLE IF NOT EXISTS "Feedback" (
  "id"             TEXT PRIMARY KEY,
  "hotelId"        TEXT NOT NULL,
  "requestId"      TEXT NOT NULL,
  "rating"         INTEGER NOT NULL,
  "comment"        TEXT,
  "guestName"      TEXT,
  "guestEmail"     TEXT,
  "sentiment"      "FeedbackSentiment" NOT NULL,
  "status"         "FeedbackStatus" NOT NULL DEFAULT 'NEW',
  "resolvedAt"     TIMESTAMP(3),
  "resolvedById"   TEXT,
  "resolutionNote" TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Feedback_hotelId_fkey"   FOREIGN KEY ("hotelId")   REFERENCES "Hotel"("id")   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Feedback_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Feedback_requestId_key" ON "Feedback"("requestId");
CREATE INDEX IF NOT EXISTS "Feedback_hotel_sentiment_status_createdAt_idx"
  ON "Feedback"("hotelId", "sentiment", "status", "createdAt");

-- Email templates per hotel
CREATE TABLE IF NOT EXISTS "HotelEmailTemplate" (
  "id"        TEXT PRIMARY KEY,
  "hotelId"   TEXT NOT NULL,
  "kind"      "EmailTemplateKind" NOT NULL,
  "subject"   TEXT NOT NULL,
  "heading"   TEXT NOT NULL,
  "body"      TEXT NOT NULL,
  "ctaLabel"  TEXT,
  "ctaUrl"    TEXT,
  "isActive"  BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HotelEmailTemplate_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "HotelEmailTemplate_hotelId_kind_key" ON "HotelEmailTemplate"("hotelId", "kind");

-- Email log
CREATE TABLE IF NOT EXISTS "EmailLog" (
  "id"          TEXT PRIMARY KEY,
  "hotelId"     TEXT,
  "to"          TEXT NOT NULL,
  "subject"     TEXT NOT NULL,
  "template"    "EmailTemplateKind",
  "provider"    TEXT NOT NULL DEFAULT 'resend',
  "externalId"  TEXT,
  "status"      "EmailStatus" NOT NULL DEFAULT 'SENT',
  "error"       TEXT,
  "meta"        JSONB NOT NULL DEFAULT '{}',
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailLog_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "EmailLog_hotelId_createdAt_idx" ON "EmailLog"("hotelId", "createdAt");
CREATE INDEX IF NOT EXISTS "EmailLog_to_createdAt_idx"      ON "EmailLog"("to", "createdAt");
