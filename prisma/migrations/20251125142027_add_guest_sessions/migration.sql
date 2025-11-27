-- CreateTable
CREATE TABLE "GuestSession" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "roomCode" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isGuestMode" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GuestSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuestSession_phoneNumber_idx" ON "GuestSession"("phoneNumber");

-- CreateIndex
CREATE INDEX "GuestSession_expiresAt_idx" ON "GuestSession"("expiresAt");

-- CreateIndex
CREATE INDEX "GuestSession_hotelId_roomCode_idx" ON "GuestSession"("hotelId", "roomCode");

-- CreateIndex
CREATE UNIQUE INDEX "GuestSession_hotelId_roomCode_phoneNumber_key" ON "GuestSession"("hotelId", "roomCode", "phoneNumber");

-- AddForeignKey
ALTER TABLE "GuestSession" ADD CONSTRAINT "GuestSession_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
