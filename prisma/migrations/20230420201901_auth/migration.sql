/*
  Warnings:

  - A unique constraint covering the columns `[hashedToken]` on the table `EmailVerification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hashedToken]` on the table `PasswordReset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmailVerification_hashedToken_key" ON "EmailVerification"("hashedToken");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_hashedToken_key" ON "PasswordReset"("hashedToken");
