"use client";
import React, { useState, useEffect, use } from "react";
import { RoomListSkeleton } from "@/components/skeleton";
import { Navbar } from "@/components/navbar";
import Image from "next/image";

const FALLBACK_IMAGE_URL = "https://vit.ac.in/wp-content/uploads/2025/03/327A0201-copy-1024x683.webp";

type Room = {
  room_type: string;
  image?: { image_url?: string } | null;
  price?: number | string | null;
};
type BlockDataResponse = {
  rooms?: Room[];
};

const Bed = ({
  params,
}: {
  params: Promise<{ gender: string; hostel: string; bed: string }>;
}) => {
  const { gender, hostel, bed } = use(params);
  const [roomData, setRoomData] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    fetch(`/api/queryMaster?category=${gender.toUpperCase()}&type=blockData&block=${hostel.toUpperCase()}`)
      .then((res) => res.json())
      .then((data: BlockDataResponse) => {
        const rooms =
          data.rooms?.filter(
            (room) => room.room_type.toLowerCase() === bed.toLowerCase()
          ) || [];

        setRoomData(rooms);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load room data");
        setLoading(false);
      });
  }, [gender, hostel, bed]);

  if (loading) return (
    <>
      <Navbar />
      <RoomListSkeleton count={4} />
    </>
  );
  if (error) return (
    <>
      <Navbar />
      <div className="pt-40 text-center text-red-400">{error}</div>
    </>
  );
  if (!roomData.length)
    return (
      <>
        <Navbar />
        <div className="pt-40 text-center">Coming Soon</div>
      </>
    );

  const room = roomData[0]; // showing first room as main

  return (
    <>
      <Navbar />
      <div className="bg-black text-white min-h-screen pt-32 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2 text-white">
            {bed.replace("_", " ").toUpperCase()}
          </h1>

          {/* <div className="text-lg text-white mb-6">
            {room.ac_type} • {room.bed_type}
          </div> */}



          {/* Main Image */}
          <div className="relative w-full h-[450px] rounded-xl mb-6 overflow-hidden">
            <Image
              src={room.image?.image_url || FALLBACK_IMAGE_URL}
              alt="Room"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          </div>

          {/* Price */}
          {/* <div className="text-2xl font-semibold text-blue-400 mb-6">
            ₹ {room.price} / sem
          </div> */}

        </div>
      </div>
    </>
  );

};

export default Bed;
