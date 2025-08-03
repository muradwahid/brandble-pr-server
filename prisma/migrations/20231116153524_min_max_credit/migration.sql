/*
  Warnings:

  - You are about to drop the column `maxCreadit` on the `semester_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `minCreadit` on the `semester_registrations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "semester_registrations" DROP COLUMN "maxCreadit",
DROP COLUMN "minCreadit",
ADD COLUMN     "maxCredit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "minCredit" INTEGER NOT NULL DEFAULT 0;
