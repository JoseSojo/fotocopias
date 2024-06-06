-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "serviceId" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT,
    "date" TEXT NOT NULL,
    "listServicesReferences" TEXT NOT NULL,
    "createBy" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "Service_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Service_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("transactionId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Service_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("equipmentId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Service" ("createBy", "create_at", "date", "delete_at", "description", "equipmentId", "listServicesReferences", "serviceId", "transactionId", "update_at") SELECT "createBy", "create_at", "date", "delete_at", "description", "equipmentId", "listServicesReferences", "serviceId", "transactionId", "update_at" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_transactionId_key" ON "Service"("transactionId");
PRAGMA foreign_key_check("Service");
PRAGMA foreign_keys=ON;
