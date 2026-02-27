-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending';
