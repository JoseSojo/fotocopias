/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `productId` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `quantityProduct` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `name` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceUnity` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Product";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceType" (
    "serviceTypeId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tonel" BOOLEAN NOT NULL DEFAULT false,
    "productExpenseId" TEXT NOT NULL,
    "createBy" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "ServiceType_productExpenseId_fkey" FOREIGN KEY ("productExpenseId") REFERENCES "Stock" ("stockId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ServiceType_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ServiceType" ("createBy", "create_at", "delete_at", "description", "name", "productExpenseId", "serviceTypeId", "tonel") SELECT "createBy", "create_at", "delete_at", "description", "name", "productExpenseId", "serviceTypeId", "tonel" FROM "ServiceType";
DROP TABLE "ServiceType";
ALTER TABLE "new_ServiceType" RENAME TO "ServiceType";
CREATE TABLE "new_Stock" (
    "stockId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceUnity" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "updateBy" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "Stock_updateBy_fkey" FOREIGN KEY ("updateBy") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Stock_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("transactionId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Stock" ("create_at", "delete_at", "stockId", "transactionId", "updateBy", "update_at") SELECT "create_at", "delete_at", "stockId", "transactionId", "updateBy", "update_at" FROM "Stock";
DROP TABLE "Stock";
ALTER TABLE "new_Stock" RENAME TO "Stock";
CREATE UNIQUE INDEX "Stock_transactionId_key" ON "Stock"("transactionId");
PRAGMA foreign_key_check("ServiceType");
PRAGMA foreign_key_check("Stock");
PRAGMA foreign_keys=ON;
