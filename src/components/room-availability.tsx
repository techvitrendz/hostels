"use client";

import {
  Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Filter, { FilterState } from "./filter";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const FALLBACK_IMAGE_URL = "https://vit.ac.in/wp-content/uploads/2025/03/327A0201-copy-1024x683.webp";

interface RoomAvailabilityProps {
  showFilter?: boolean;
  roomType: {
    gender: string;
    block: string;
    type: string;
    acAvailable: boolean;
    nonAcAvailable: boolean;
    bunker: boolean;
    price: {
      ac: string;
      nonAc: string;
    };
    mess: string;
    description: string;
  }[];
}

export function RoomAvailability({ roomType, showFilter = true }: RoomAvailabilityProps) {
  const [filter, setFilter] = useState<FilterState>({
    ac: null,
    sharing: [],
    bedType: [],
    blockType: [],
    search: "",
  });

  // const roomTypes: RoomType[] = [
  //   {
  //     gender: "men",
  //     block: "r",
  //     type: "2-Bed Room",
  //     acAvailable: true,
  //     nonAcAvailable: true,
  //     bunker: false,
  //     price: { ac: "₹1200", nonAc: "₹800" },
  //     mess: "SRRC",
  //     description:
  //       "Spacious room with 4 single beds, personal lockers, and shared bathroom.",
  //   },
  //   {
  //     gender: "men",
  //     block: "r",
  //     type: "3-Bed Room",
  //     acAvailable: false,
  //     nonAcAvailable: true,
  //     bunker: false,
  //     price: { ac: "₹1500", nonAc: "₹1000" },
  //     mess: "SRRC",
  //     description:
  //       "Cozy room with 2 single beds, personal lockers, and shared bathroom.",
  //   },
  //   {
  //     gender: "men",
  //     block: "r",
  //     type: "4-Bed Room",
  //     acAvailable: false,
  //     nonAcAvailable: true,
  //     bunker: true,
  //     price: { ac: "₹1500", nonAc: "₹1000" },
  //     mess: "Darling",
  //     description:
  //       "Cozy room with 2 single beds, personal lockers, and shared bathroom.",
  //   },
  // ];

  if (!roomType || roomType.length === 0) {
    return (
      <>
        <div className="mb-6 my-10">
          <h2 className="text-3xl font-bold">Types of Rooms available</h2>
          <p className="mt-2 text-gray-600">
            Choose from our range of comfortable accommodation options
          </p>
        </div>
        <div className="text-center text-gray-500 my-10 text-2xl font-bold">
          <p>Coming Soon</p>
        </div>
      </>
    );
  }

  const filteredRooms = roomType.filter((room) => {
    const acMatch = filter.ac === null ? true : filter.ac ? room.acAvailable : room.nonAcAvailable;
    const bedTypeMatch =
      filter.bedType.length === 0
        ? true
        : filter.bedType.includes(room.bunker ? "bunker" : "normal");
    return acMatch && bedTypeMatch;
  });

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Rooms Available</h2>
          <p className="mt-1 text-neutral-400 text-sm">
            Choose from our range of comfortable accommodations options
          </p>
        </div>
        {showFilter && <Filter filter={filter} setFilter={setFilter} />}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredRooms.map((room, index) => (
          <Card
            key={index}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-0">
              {/* Image */}
              <div className="relative col-span-1 h-28 md:h-36">
                <Image
                  src={FALLBACK_IMAGE_URL}
                  alt={room.type}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 right-2 px-2 py-1 text-[10px] rounded-full bg-green-500 text-white">open</span>
              </div>

              {/* Content */}
              <div className="col-span-2 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm md:text-base font-semibold">{room.type}</h3>
                    <p className="text-xs md:text-sm text-neutral-400">₹{room.price?.nonAc || room.price?.ac || "—"}/sem</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                    ★ <span>4.3</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  {room.acAvailable && (
                    <Badge className="bg-neutral-800 text-white">AC</Badge>
                  )}
                  {room.nonAcAvailable && (
                    <Badge className="bg-neutral-800 text-white">Non-AC</Badge>
                  )}
                  <Badge className="bg-neutral-800 text-white">
                    {room.bunker ? "Bunker" : "Non-Bunker"}
                  </Badge>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Link
                    href={`/${room.gender}/hostels/${room.block.toLowerCase()}/${room.type.toLowerCase()}`}
                    className="px-3 py-1 text-xs rounded-md bg-neutral-800 text-white hover:bg-neutral-700"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/${room.gender}/hostels/${room.block.toLowerCase()}/${room.type.toLowerCase()}`}
                    className="text-xs text-neutral-500 hover:text-neutral-300"
                  >
                    Know More
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
