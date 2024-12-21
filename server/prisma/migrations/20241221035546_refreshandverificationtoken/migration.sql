/*
  Warnings:

  - Added the required column `refreshToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshTokenExpiry` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationTokenExpiry` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "refreshTokenExpiry" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verificationToken" TEXT NOT NULL,
ADD COLUMN     "verificationTokenExpiry" TIMESTAMP(3) NOT NULL;
