-- CreateTable
CREATE TABLE "Report" (
    "reportId" TEXT NOT NULL PRIMARY KEY,
    "objectType" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "downloader" TEXT NOT NULL,
    "createBy" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "Report_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
