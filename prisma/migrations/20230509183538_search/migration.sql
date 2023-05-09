/*
  Warnings:

  - You are about to drop the column `salt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookId,identifierTypeId,value]` on the table `BookIdentifier` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "salt";

-- CreateIndex
CREATE UNIQUE INDEX "BookIdentifier_bookId_identifierTypeId_value_key" ON "BookIdentifier"("bookId", "identifierTypeId", "value");
