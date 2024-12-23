/*
  Warnings:

  - Made the column `deliveryDetailsId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliveryDetailsId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "deliveryDetailsId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryDetailsId_fkey" FOREIGN KEY ("deliveryDetailsId") REFERENCES "DeliveryDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
