/*
  Warnings:

  - You are about to drop the column `publicationIds` on the `orders` table. All the data in the column will be lost.
  - Added the required column `publicationId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_publicationIds_fkey";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "publicationIds",
ADD COLUMN     "publicationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "public"."publications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
