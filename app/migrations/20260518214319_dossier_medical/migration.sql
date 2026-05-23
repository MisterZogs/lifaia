-- CreateTable
CREATE TABLE "Allergie" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "enfantId" TEXT,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severite" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Allergie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Traitement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "enfantId" TEXT,
    "nom" TEXT NOT NULL,
    "dose" TEXT,
    "frequence" TEXT,
    "depuis" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "Traitement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AntecedentMedical" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "enfantId" TEXT,
    "categorie" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "annee" INTEGER,
    "notes" TEXT,

    CONSTRAINT "AntecedentMedical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AntecedentFamilial" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "maladie" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "AntecedentFamilial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "enfantId" TEXT,
    "vaccin" TEXT NOT NULL,
    "dateDernierDose" TIMESTAMP(3) NOT NULL,
    "prochainRappel" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "Vaccination_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Allergie" ADD CONSTRAINT "Allergie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allergie" ADD CONSTRAINT "Allergie_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traitement" ADD CONSTRAINT "Traitement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traitement" ADD CONSTRAINT "Traitement_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AntecedentMedical" ADD CONSTRAINT "AntecedentMedical_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AntecedentMedical" ADD CONSTRAINT "AntecedentMedical_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AntecedentFamilial" ADD CONSTRAINT "AntecedentFamilial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
