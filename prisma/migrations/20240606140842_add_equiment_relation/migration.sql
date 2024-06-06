/*
  Warnings:

  - You are about to drop the column `servicesTypeId` on the `Equipment` table. All the data in the column will be lost.
  - Added the required column `description` to the `Equipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicesId` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Equipment" (
    "equipmentId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "servicesId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME,
    CONSTRAINT "Equipment_servicesId_fkey" FOREIGN KEY ("servicesId") REFERENCES "Service" ("serviceId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Equipment" ("equipmentId", "name") SELECT "equipmentId", "name" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
PRAGMA foreign_key_check("Equipment");
PRAGMA foreign_keys=ON;
