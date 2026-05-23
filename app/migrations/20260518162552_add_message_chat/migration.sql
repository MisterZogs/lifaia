-- CreateTable
CREATE TABLE "MessageChat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "onglet" TEXT NOT NULL DEFAULT 'moderne',
    "urgenceDetectee" BOOLEAN NOT NULL DEFAULT false,
    "modeleUtilise" TEXT,
    "latenceMs" INTEGER,

    CONSTRAINT "MessageChat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageChat" ADD CONSTRAINT "MessageChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
