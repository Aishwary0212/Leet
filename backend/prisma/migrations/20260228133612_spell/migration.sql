/*
  Warnings:

  - You are about to drop the column `cmpileOutput` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "cmpileOutput",
ADD COLUMN     "compileOutput" TEXT;
