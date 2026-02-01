/*
  Warnings:

  - You are about to drop the column `niches` on the `publications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."publications" DROP COLUMN "niches";

-- CreateTable
CREATE TABLE "public"."_PublicationNiches" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PublicationNiches_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PublicationNiches_B_index" ON "public"."_PublicationNiches"("B");

-- AddForeignKey
ALTER TABLE "public"."_PublicationNiches" ADD CONSTRAINT "_PublicationNiches_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."niches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PublicationNiches" ADD CONSTRAINT "_PublicationNiches_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
