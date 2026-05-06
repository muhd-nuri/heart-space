-- Rename `billCode` (ToyyibPay legacy) → `stripeSessionId` (Stripe Checkout
-- session id). Done as a RENAME so existing rows survive. Make nullable
-- since stub-mode contributions don't carry a real Stripe session id.
ALTER TABLE "Contribution" RENAME COLUMN "billCode" TO "stripeSessionId";
ALTER TABLE "Contribution" ALTER COLUMN "stripeSessionId" DROP NOT NULL;
