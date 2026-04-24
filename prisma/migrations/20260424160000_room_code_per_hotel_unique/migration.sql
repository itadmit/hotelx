-- DropIndex
DROP INDEX IF EXISTS "Room_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "Room_hotelId_code_key" ON "Room"("hotelId", "code");
