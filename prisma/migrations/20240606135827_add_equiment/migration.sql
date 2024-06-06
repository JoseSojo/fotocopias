-- CreateTable
CREATE TABLE "Equipment" (
    "equipmentId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "servicesTypeId" TEXT NOT NULL,
    CONSTRAINT "Equipment_servicesTypeId_fkey" FOREIGN KEY ("servicesTypeId") REFERENCES "ServiceType" ("serviceTypeId") ON DELETE RESTRICT ON UPDATE CASCADE
);
