/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `PasswordReset` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `PasswordReset` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `PasswordReset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PasswordReset" DROP COLUMN "expiresAt",
DROP COLUMN "sentAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
