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
    "enero" DECIMAL NOT NULL DEFAULT 0.0,
    "febrero" DECIMAL NOT NULL DEFAULT 0.0,
    "marzo" DECIMAL NOT NULL DEFAULT 0.0,
    "abril" DECIMAL NOT NULL DEFAULT 0.0,
    "mayo" DECIMAL NOT NULL DEFAULT 0.0,
    "junio" DECIMAL NOT NULL DEFAULT 0.0,
    "julio" DECIMAL NOT NULL DEFAULT 0.0,
    "agosto" DECIMAL NOT NULL DEFAULT 0.0,
    "septiembre" DECIMAL NOT NULL DEFAULT 0.0,
    "octubre" DECIMAL NOT NULL DEFAULT 0.0,
    "noviembre" DECIMAL NOT NULL DEFAULT 0.0,
    "diciembre" DECIMAL NOT NULL DEFAULT 0.0
);
INSERT INTO "new_StaticticsForYear" ("abril", "agosto", "diciembre", "enero", "febrero", "julio", "junio", "marzo", "mayo", "noviembre", "octubre", "septiembre", "staticticsForYearId", "year") SELECT "abril", "agosto", "diciembre", "enero", "febrero", "julio", "junio", "marzo", "mayo", "noviembre", "octubre", "septiembre", "staticticsForYearId", "year" FROM "StaticticsForYear";
DROP TABLE "StaticticsForYear";
ALTER TABLE "new_StaticticsForYear" RENAME TO "StaticticsForYear";
PRAGMA foreign_key_check("StaticticsForYear");
PRAGMA foreign_keys=ON;
