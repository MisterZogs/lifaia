-- Mémoire long terme : résumé cumulatif des sessions de conversation par patient
CREATE TABLE "ResumConversation" (
    "id"                TEXT NOT NULL,
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,
    "userId"            TEXT NOT NULL,
    "resume"            TEXT NOT NULL,
    "derniereSessionAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumConversation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ResumConversation_userId_key" ON "ResumConversation"("userId");

ALTER TABLE "ResumConversation"
    ADD CONSTRAINT "ResumConversation_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
