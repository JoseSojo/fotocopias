-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "reportId" TEXT NOT NULL PRIMARY KEY,
    "generateType" TEXT NOT NULL DEFAULT 'manual',
    "objectType" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "downloader" TEXT NOT NULL,
    "createBy" TEXT,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "Report_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User" ("userId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("createBy", "create_at", "delete_at", "downloader", "fecha", "generateType", "objectType", "path", "reportId", "update_at") SELECT "createBy", "create_at", "delete_at", "downloader", "fecha", "generateType", "objectType", "path", "reportId", "update_at" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_key_check("Report");
PRAGMA foreign_keys=ON;
