-- CreateEnum
CREATE TYPE "Type" AS ENUM ('ORIGINAL', 'CONVERTED');

-- CreateTable
CREATE TABLE "Audio" (
    "id" UUID NOT NULL,
    "originalName" TEXT NOT NULL,
    "originalNameWithOutExt" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "extLongName" TEXT NOT NULL,
    "bitRate" INTEGER NOT NULL,
    "ext" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" "Type" NOT NULL,
    "originalId" UUID,

    CONSTRAINT "Audio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Audio" ADD CONSTRAINT "Audio_originalId_fkey" FOREIGN KEY ("originalId") REFERENCES "Audio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
