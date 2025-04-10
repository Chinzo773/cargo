/*
  Warnings:

  - You are about to drop the column `userId` on the `Packages` table. All the data in the column will be lost.
  - The `deliveryLocation` column on the `Packages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `location` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Packages" DROP CONSTRAINT "Packages_userId_fkey";

-- DropIndex
DROP INDEX "Users_name_key";

-- AlterTable
ALTER TABLE "Packages" DROP COLUMN "userId",
ADD COLUMN     "clerkId" TEXT,
DROP COLUMN "deliveryLocation",
ADD COLUMN     "deliveryLocation" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "location",
DROP COLUMN "name";

-- AddForeignKey
ALTER TABLE "Packages" ADD CONSTRAINT "Packages_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "Users"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;
