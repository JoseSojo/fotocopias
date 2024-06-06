/*
  Warnings:

  - You are about to alter the column `priceUnity` on the `Stock` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stock" (
    "stockId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceUnity" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "updateBy" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "Stock_updateBy_fkey" FOREIGN KEY ("updateBy") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Stock_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("transactionId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Stock" ("create_at", "delete_at", "description", "name", "priceUnity", "quantity", "stockId", "transactionId", "updateBy", "update_at") SELECT "create_at", "delete_at", "description", "name", "priceUnity", "quantity", "stockId", "transactionId", "updateBy", "update_at" FROM "Stock";
DROP TABLE "Stock";
ALTER TABLE "new_Stock" RENAME TO "Stock";
CREATE UNIQUE INDEX "Stock_transactionId_key" ON "Stock"("transactionId");
PRAGMA foreign_key_check("Stock");
PRAGMA foreign_keys=ON;
