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
    CONSTRAINT "ServiceType_productExpenseId_fkey" FOREIGN KEY ("productExpenseId") REFERENCES "Product" ("productId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ServiceType_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ServiceType" ("createBy", "create_at", "delete_at", "description", "name", "productExpenseId", "serviceTypeId") SELECT "createBy", "create_at", "delete_at", "description", "name", "productExpenseId", "serviceTypeId" FROM "ServiceType";
DROP TABLE "ServiceType";
ALTER TABLE "new_ServiceType" RENAME TO "ServiceType";
PRAGMA foreign_key_check("ServiceType");
PRAGMA foreign_keys=ON;
