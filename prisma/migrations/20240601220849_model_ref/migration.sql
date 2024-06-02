-- DropIndex
DROP INDEX "PaymentMethod_moneyId_key";

-- CreateTable
CREATE TABLE "_ServiceToServiceType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ServiceToServiceType_A_fkey" FOREIGN KEY ("A") REFERENCES "Service" ("serviceId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ServiceToServiceType_B_fkey" FOREIGN KEY ("B") REFERENCES "ServiceType" ("serviceTypeId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ServiceToServiceType_AB_unique" ON "_ServiceToServiceType"("A", "B");

-- CreateIndex
CREATE INDEX "_ServiceToServiceType_B_index" ON "_ServiceToServiceType"("B");
