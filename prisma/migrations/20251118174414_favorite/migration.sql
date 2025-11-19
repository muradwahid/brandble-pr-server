-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "public"."publications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
