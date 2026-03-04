/*
  Warnings:

  - You are about to drop the `ProblemInPlayList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProblemInPlayList" DROP CONSTRAINT "ProblemInPlayList_playListId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemInPlayList" DROP CONSTRAINT "ProblemInPlayList_problemId_fkey";

-- DropTable
DROP TABLE "ProblemInPlayList";

-- CreateTable
CREATE TABLE "ProblemsInPlayList" (
    "id" TEXT NOT NULL,
    "playListId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemsInPlayList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemsInPlayList_playListId_problemId_key" ON "ProblemsInPlayList"("playListId", "problemId");

-- AddForeignKey
ALTER TABLE "ProblemsInPlayList" ADD CONSTRAINT "ProblemsInPlayList_playListId_fkey" FOREIGN KEY ("playListId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemsInPlayList" ADD CONSTRAINT "ProblemsInPlayList_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
