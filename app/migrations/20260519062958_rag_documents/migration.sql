-- CreateTable
CREATE TABLE "DocumentRAG" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "embedding" JSONB,

    CONSTRAINT "DocumentRAG_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentRAG_source_idx" ON "DocumentRAG"("source");
