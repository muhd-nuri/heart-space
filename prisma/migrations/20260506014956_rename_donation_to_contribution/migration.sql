/*
  Warnings:

  - You are about to drop the `Donation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_campaignId_fkey";

-- DropTable
DROP TABLE "Donation";

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MYR',
    "type" TEXT NOT NULL,
    "campaignId" TEXT,
    "contributorName" TEXT NOT NULL,
    "contributorEmail" TEXT NOT NULL,
    "contributorPhone" TEXT,
    "billCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
