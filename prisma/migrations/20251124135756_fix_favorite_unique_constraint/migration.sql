/*
  Warnings:

  - You are about to drop the `_OrderToPublication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_OrderToPublication" DROP CONSTRAINT "_OrderToPublication_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_OrderToPublication" DROP CONSTRAINT "_OrderToPublication_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_methodId_fkey";

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "paymentMethodId" TEXT,
ALTER COLUMN "publicationIds" SET NOT NULL,
ALTER COLUMN "publicationIds" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "public"."_OrderToPublication";

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_publicationIds_fkey" FOREIGN KEY ("publicationIds") REFERENCES "public"."publications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "public"."payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
