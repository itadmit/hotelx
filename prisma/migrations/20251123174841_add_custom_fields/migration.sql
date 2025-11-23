-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('RADIO', 'CHECKBOX', 'SELECT');

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "customFieldsData" JSONB;

-- CreateTable
CREATE TABLE "ServiceCustomField" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fieldType" "CustomFieldType" NOT NULL,
    "options" JSONB NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "ServiceCustomField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceCustomField_serviceId_idx" ON "ServiceCustomField"("serviceId");

-- AddForeignKey
ALTER TABLE "ServiceCustomField" ADD CONSTRAINT "ServiceCustomField_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
