/*
  Warnings:

  - Added the required column `imageUrl` to the `Restaurent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurent" ADD COLUMN     "imageUrl" TEXT NOT NULL;
