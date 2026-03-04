/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Name" AS ENUM ('MEN', 'WOMEN');

-- CreateEnum
CREATE TYPE "public"."RoomType" AS ENUM ('TWO_BED', 'THREE_BED', 'FOUR_BED', 'SIX_BED');

-- CreateEnum
CREATE TYPE "public"."AC" AS ENUM ('AC', 'NON_AC');

-- CreateEnum
CREATE TYPE "public"."Bed" AS ENUM ('BUNK_BED', 'NORMAL');

-- CreateEnum
CREATE TYPE "public"."ImageType" AS ENUM ('TOILET', 'BATHING');

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "public"."Post";

-- DropTable
DROP TABLE "public"."Profile";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" "public"."Name" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Block" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlockImage" (
    "id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Room" (
    "id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "room_type" "public"."RoomType" NOT NULL,
    "ac_type" "public"."AC" NOT NULL,
    "bed_type" "public"."Bed" NOT NULL,
    "bed_length_cm" INTEGER NOT NULL,
    "bed_width_cm" INTEGER NOT NULL,
    "cupboard_height_cm" INTEGER NOT NULL,
    "cupboard_width_cm" INTEGER NOT NULL,
    "table_length_cm" INTEGER NOT NULL,
    "table_width_cm" INTEGER NOT NULL,
    "price" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "table_image" TEXT NOT NULL,
    "cupboard_image" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoomImage" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reviews" (
    "id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlockWashroomImage" (
    "id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "image_type" "public"."ImageType" NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockWashroomImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Block" ADD CONSTRAINT "Block_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlockImage" ADD CONSTRAINT "BlockImage_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "public"."Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Room" ADD CONSTRAINT "Room_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "public"."Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomImage" ADD CONSTRAINT "RoomImage_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reviews" ADD CONSTRAINT "Reviews_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "public"."Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlockWashroomImage" ADD CONSTRAINT "BlockWashroomImage_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "public"."Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
