/*
  Warnings:

  - You are about to drop the column `deliveryDetailsId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `DeliveryDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `DeliveryDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliveryDetailsId_fkey";

-- DropIndex
DROP INDEX "Order_deliveryDetailsId_key";

-- AlterTable
ALTER TABLE "DeliveryDetails" ADD COLUMN     "orderId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryDetailsId";

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryDetails_orderId_key" ON "DeliveryDetails"("orderId");

-- AddForeignKey
ALTER TABLE "DeliveryDetails" ADD CONSTRAINT "DeliveryDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
