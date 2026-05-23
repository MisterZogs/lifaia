-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateNaissance" TIMESTAMP(3),
ADD COLUMN     "poidsKg" DOUBLE PRECISION,
ADD COLUMN     "sexe" TEXT,
ADD COLUMN     "tailleCm" INTEGER;

-- CreateTable
CREATE TABLE "Enfant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "prenom" TEXT NOT NULL,
    "sexe" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "tailleCm" INTEGER,
    "poidsKg" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Enfant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Enfant" ADD CONSTRAINT "Enfant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
