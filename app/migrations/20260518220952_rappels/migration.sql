-- CreateTable
CREATE TABLE "Rappel" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "enfantId" TEXT,
    "type" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "dateProchaine" TIMESTAMP(3) NOT NULL,
    "frequence" TEXT NOT NULL DEFAULT 'unique',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "derniereNotifAt" TIMESTAMP(3),

    CONSTRAINT "Rappel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rappel" ADD CONSTRAINT "Rappel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rappel" ADD CONSTRAINT "Rappel_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
