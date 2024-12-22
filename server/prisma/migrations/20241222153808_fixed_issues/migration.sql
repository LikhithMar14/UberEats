/*
  Warnings:

  - You are about to drop the column `RestaurantId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `RestaurantId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `RestaurantName` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `name` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantName` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_RestaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_RestaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliveryDetailsId_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "RestaurantId",
ADD COLUMN     "restaurantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "RestaurantId",
ADD COLUMN     "restaurantId" INTEGER NOT NULL,
ALTER COLUMN "deliveryDetailsId" DROP NOT NULL,
ALTER COLUMN "totalAmount" DROP NOT NULL,
ALTER COLUMN "totalAmount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "RestaurantName",
ADD COLUMN     "restaurantName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryDetailsId_fkey" FOREIGN KEY ("deliveryDetailsId") REFERENCES "DeliveryDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
