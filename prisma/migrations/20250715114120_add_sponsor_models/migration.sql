-- CreateEnum
CREATE TYPE "SponsorLevel" AS ENUM ('PLATINUM', 'GOLD', 'SILVER', 'BRONZE');

-- AlterTable
ALTER TABLE "conferences" ADD COLUMN     "sponsorId" TEXT;

-- CreateTable
CREATE TABLE "sponsors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "level" "SponsorLevel" NOT NULL DEFAULT 'BRONZE',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "conferences" ADD CONSTRAINT "conferences_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "sponsors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
