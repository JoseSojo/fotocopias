-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "appId" TEXT NOT NULL PRIMARY KEY,
    "mount_total" REAL NOT NULL,
    "app_name" TEXT NOT NULL DEFAULT 'Fotocopia',
    "app_description" TEXT NOT NULL DEFAULT 'Fotocopia',
    "app_phone" TEXT NOT NULL DEFAULT 'Fotocopia'
);
INSERT INTO "new_App" ("appId", "app_name", "mount_total") SELECT "appId", "app_name", "mount_total" FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
PRAGMA foreign_key_check("App");
PRAGMA foreign_keys=ON;
