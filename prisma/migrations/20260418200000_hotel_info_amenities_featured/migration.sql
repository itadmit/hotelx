-- Hotel info: Wi-Fi, About, Helpful info (one row per hotel)
CREATE TABLE "HotelInfo" (
  "hotelId" TEXT NOT NULL,
  "wifiName" TEXT,
  "wifiPassword" TEXT,
  "wifiNotes" TEXT,
  "about" TEXT,
  "helpfulInfo" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HotelInfo_pkey" PRIMARY KEY ("hotelId")
);

ALTER TABLE "HotelInfo"
  ADD CONSTRAINT "HotelInfo_hotelId_fkey"
  FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Hotel amenities (gym, pool, spa…)
CREATE TABLE "HotelAmenity" (
  "id" TEXT NOT NULL,
  "hotelId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "icon" TEXT,
  "hours" TEXT,
  "location" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HotelAmenity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HotelAmenity_hotelId_order_idx" ON "HotelAmenity"("hotelId", "order");

ALTER TABLE "HotelAmenity"
  ADD CONSTRAINT "HotelAmenity_hotelId_fkey"
  FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Service: featured / upsell flag
ALTER TABLE "Service" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "Service_hotelId_isFeatured_idx" ON "Service"("hotelId", "isFeatured");
