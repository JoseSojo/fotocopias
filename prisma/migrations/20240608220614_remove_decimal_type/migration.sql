/*
  Warnings:

  - You are about to alter the column `abril` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.
  - You are about to alter the column `agosto` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.
  - You are about to alter the column `diciembre` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.
  - You are about to alter the column `enero` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.
  - You are about to alter the column `febrero` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.
  - You are about to alter the column `julio` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.
  - You are about to alter the column `junio` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.
  - You are about to alter the column `marzo` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.
  - You are about to alter the column `mayo` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.
  - You are about to alter the column `noviembre` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.
  - You are about to alter the column `octubre` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.
  - You are about to alter the column `septiembre` on the `StaticticsForYear` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StaticticsForYear" (
    "staticticsForYearId" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "month1" TEXT NOT NULL DEFAULT '1_enero',
    "month2" TEXT NOT NULL DEFAULT '2_febrero',
    "month3" TEXT NOT NULL DEFAULT '3_marzo',
    "month4" TEXT NOT NULL DEFAULT '4_abril',
    "month5" TEXT NOT NULL DEFAULT '5_mayo',
    "month6" TEXT NOT NULL DEFAULT '6_junio',
    "month7" TEXT NOT NULL DEFAULT '7_julio',
    "month8" TEXT NOT NULL DEFAULT '8_agosto',
    "month9" TEXT NOT NULL DEFAULT '9_septiembre',
    "month10" TEXT NOT NULL DEFAULT '10_octubre',
    "month11" TEXT NOT NULL DEFAULT '11_noviembre',
    "month12" TEXT NOT NULL DEFAULT '12_diciembre',
    "enero" INTEGER NOT NULL DEFAULT 0,
    "febrero" INTEGER NOT NULL DEFAULT 0,
    "marzo" INTEGER NOT NULL DEFAULT 0,
    "abril" INTEGER NOT NULL DEFAULT 0,
    "mayo" INTEGER NOT NULL DEFAULT 0,
    "junio" INTEGER NOT NULL DEFAULT 0,
    "julio" INTEGER NOT NULL DEFAULT 0,
    "agosto" INTEGER NOT NULL DEFAULT 0,
    "septiembre" INTEGER NOT NULL DEFAULT 0,
    "octubre" INTEGER NOT NULL DEFAULT 0,
    "noviembre" INTEGER NOT NULL DEFAULT 0,
    "diciembre" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_StaticticsForYear" ("abril", "agosto", "diciembre", "enero", "febrero", "julio", "junio", "marzo", "mayo", "month1", "month10", "month11", "month12", "month2", "month3", "month4", "month5", "month6", "month7", "month8", "month9", "noviembre", "octubre", "septiembre", "staticticsForYearId", "year") SELECT "abril", "agosto", "diciembre", "enero", "febrero", "julio", "junio", "marzo", "mayo", "month1", "month10", "month11", "month12", "month2", "month3", "month4", "month5", "month6", "month7", "month8", "month9", "noviembre", "octubre", "septiembre", "staticticsForYearId", "year" FROM "StaticticsForYear";
DROP TABLE "StaticticsForYear";
ALTER TABLE "new_StaticticsForYear" RENAME TO "StaticticsForYear";
PRAGMA foreign_key_check("StaticticsForYear");
PRAGMA foreign_keys=ON;
