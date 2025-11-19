/*
  Warnings:

  - A unique constraint covering the columns `[publicationId]` on the table `favorites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "favorites_publicationId_key" ON "public"."favorites"("publicationId");
