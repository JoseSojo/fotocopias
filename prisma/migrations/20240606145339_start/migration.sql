/*
  Warnings:

  - You are about to drop the column `productExpenseId` on the `ServiceType` table. All the data in the column will be lost.
  - Added the required column `stockExpenseId` to the `ServiceType` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceType" (
    "serviceTypeId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stockExpenseId" TEXT NOT NULL,
    "createBy" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "ServiceType_stockExpenseId_fkey" FOREIGN KEY ("stockExpenseId") REFERENCES "Stock" ("stockId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ServiceType_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ServiceType" ("createBy", "create_at", "delete_at", "description", "name", "serviceTypeId") SELECT "createBy", "create_at", "delete_at", "description", "name", "serviceTypeId" FROM "ServiceType";
DROP TABLE "ServiceType";
ALTER TABLE "new_ServiceType" RENAME TO "ServiceType";
PRAGMA foreign_key_check("ServiceType");
PRAGMA foreign_keys=ON;
