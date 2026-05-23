-- CreateTable
CREATE TABLE "OperationChirurgicale" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "enfantId" TEXT,
    "nom" TEXT NOT NULL,
    "annee" INTEGER,
    "hopital" TEXT,
    "notes" TEXT,

    CONSTRAINT "OperationChirurgicale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OperationChirurgicale" ADD CONSTRAINT "OperationChirurgicale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationChirurgicale" ADD CONSTRAINT "OperationChirurgicale_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
