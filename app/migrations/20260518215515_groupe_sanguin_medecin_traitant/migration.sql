/*
  Warnings:

  - You are about to drop the `OperationChirurgicale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OperationChirurgicale" DROP CONSTRAINT "OperationChirurgicale_enfantId_fkey";

-- DropForeignKey
ALTER TABLE "OperationChirurgicale" DROP CONSTRAINT "OperationChirurgicale_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groupeSanguin" TEXT,
ADD COLUMN     "medecinTraitant" TEXT;

-- DropTable
DROP TABLE "OperationChirurgicale";
