-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "transactionId" TEXT NOT NULL PRIMARY KEY,
    "concepto" TEXT NOT NULL,
    "mount" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "methodPaymentId" TEXT NOT NULL,
    "createBy" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "Transaction_methodPaymentId_fkey" FOREIGN KEY ("methodPaymentId") REFERENCES "PaymentMethod" ("paymentMethodId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("concepto", "createBy", "create_at", "delete_at", "methodPaymentId", "mount", "transactionId") SELECT "concepto", "createBy", "create_at", "delete_at", "methodPaymentId", "mount", "transactionId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_key_check("Transaction");
PRAGMA foreign_keys=ON;
