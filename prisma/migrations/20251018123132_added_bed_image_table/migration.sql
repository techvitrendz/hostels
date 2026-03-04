-- CreateTable
CREATE TABLE "BedImage" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BedImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BedImage" ADD CONSTRAINT "BedImage_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
