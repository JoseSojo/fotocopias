-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Money" (
    "moneyId" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "description" TEXT,
    "saldo" DECIMAL NOT NULL DEFAULT 0,
    "createBy" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "Money_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Money" ("createBy", "create_at", "delete_at", "description", "moneyId", "prefix", "title", "update_at") SELECT "createBy", "create_at", "delete_at", "description", "moneyId", "prefix", "title", "update_at" FROM "Money";
DROP TABLE "Money";
ALTER TABLE "new_Money" RENAME TO "Money";
PRAGMA foreign_key_check("Money");
PRAGMA foreign_keys=ON;
