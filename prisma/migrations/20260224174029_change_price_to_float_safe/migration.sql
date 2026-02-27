-- AlterTable
ALTER TABLE "publications"
ALTER COLUMN "price" TYPE DOUBLE PRECISION
USING (
  CASE
    WHEN "price" ~ '^[0-9]+(\.[0-9]+)?$' THEN ("price")::DOUBLE PRECISION
    WHEN "price" ~ '^[0-9]+$' THEN ("price")::DOUBLE PRECISION
    WHEN "price" = '' OR "price" IS NULL THEN NULL
    ELSE 0.0
  END
);