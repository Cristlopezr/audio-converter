-- CreateTable
CREATE TABLE "Audio" (
    "id" UUID NOT NULL,
    "originalName" TEXT NOT NULL,
    "originalNameWithOutExt" TEXT NOT NULL,
    "ext" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "Audio_pkey" PRIMARY KEY ("id")
);
