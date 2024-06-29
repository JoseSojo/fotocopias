/*
  Warnings:

  - You are about to drop the column `createBy` on the `Report` table. All the data in the column will be lost.
  - Added the required column `fullnameUser` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "reportId" TEXT NOT NULL PRIMARY KEY,
    "objectType" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "downloader" TEXT NOT NULL,
    "fullnameUser" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME
);
INSERT INTO "new_Report" ("create_at", "delete_at", "downloader", "fecha", "objectType", "path", "reportId", "update_at") SELECT "create_at", "delete_at", "downloader", "fecha", "objectType", "path", "reportId", "update_at" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_key_check("Report");
PRAGMA foreign_keys=ON;
