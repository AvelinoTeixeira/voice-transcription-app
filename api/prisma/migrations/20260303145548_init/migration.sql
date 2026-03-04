-- CreateTable
CREATE TABLE "transcriptions" (
    "id" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "cleanText" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transcriptions_pkey" PRIMARY KEY ("id")
);
