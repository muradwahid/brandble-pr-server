-- Add billing address columns to payment_methods
ALTER TABLE "payment_methods" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "payment_methods" ADD COLUMN IF NOT EXISTS "state" TEXT;
ALTER TABLE "payment_methods" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "payment_methods" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "payment_methods" ADD COLUMN IF NOT EXISTS "line1" TEXT;
ALTER TABLE "payment_methods" ADD COLUMN IF NOT EXISTS "line2" TEXT;