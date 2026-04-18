-- AlterTable
ALTER TABLE "Category" ADD COLUMN "parentId" TEXT;

-- CreateIndex
CREATE INDEX "Category_hotelId_parentId_idx" ON "Category"("hotelId", "parentId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
