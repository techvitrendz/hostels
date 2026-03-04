/*
  Warnings:

  - A unique constraint covering the columns `[image_url]` on the table `BedImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[image_url]` on the table `BlockImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[image_url]` on the table `BlockWashroomImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[image_url]` on the table `RoomImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BedImage_image_url_key" ON "BedImage"("image_url");

-- CreateIndex
CREATE UNIQUE INDEX "BlockImage_image_url_key" ON "BlockImage"("image_url");

-- CreateIndex
CREATE UNIQUE INDEX "BlockWashroomImage_image_url_key" ON "BlockWashroomImage"("image_url");

-- CreateIndex
CREATE UNIQUE INDEX "RoomImage_image_url_key" ON "RoomImage"("image_url");
