/*
  Warnings:

  - You are about to drop the column `ProjectName` on the `Offer` table. All the data in the column will be lost.
  - Added the required column `projectName` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "ProjectName",
ADD COLUMN     "projectName" TEXT NOT NULL;
