/*
  Warnings:

  - You are about to drop the column `restaurentId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `restaurentId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Restaurent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `RestaurantId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RestaurantId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_restaurentId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_restaurentId_fkey";

-- DropForeignKey
ALTER TABLE "Restaurent" DROP CONSTRAINT "Restaurent_userId_fkey";

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "restaurentId",
ADD COLUMN     "RestaurantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "restaurentId",
ADD COLUMN     "RestaurantId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Restaurent";

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "RestaurantName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "deliveryTime" INTEGER NOT NULL,
    "cuisines" TEXT[],
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_RestaurantId_fkey" FOREIGN KEY ("RestaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_RestaurantId_fkey" FOREIGN KEY ("RestaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
