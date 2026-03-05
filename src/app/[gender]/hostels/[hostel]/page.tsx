"use client";
import { ImageGallery } from "@/components/image-gallery";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { RoomAvailability } from "@/components/room-availability";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const FALLBACK_IMAGE_URL = "https://vit.ac.in/wp-content/uploads/2025/03/327A0201-copy-1024x683.webp";

type BlockImage = { image_url: string };
type HostelRoom = {
  room_type: string;
  ac_type?: "AC" | "NON_AC" | null;
  bed_type?: "BUNK_BED" | "NORMAL" | null;
  price?: number | string | null;
};
type BlockDataResponse = {
  blockImages?: Array<{ images: BlockImage[] }>;
  rooms?: HostelRoom[];
};
type NormalizedBlock = {
  name: string;
  images: BlockImage[];
  rooms: HostelRoom[];
};

function HostelDetailsSkeleton() {
  return (
    <div className="p-6 md:mx-20">
      {/* Title Skeleton */}
      <div className="h-14 bg-neutral-800 rounded animate-pulse w-3/4 mt-20 mb-6"></div>
      
      {/* Badges Skeleton */}
      <div className="flex items-center my-5 gap-x-2">
        <div className="h-8 w-24 bg-neutral-800 rounded-full animate-pulse"></div>
        <div className="h-8 w-28 bg-neutral-800 rounded-full animate-pulse"></div>
        <div className="h-8 w-32 bg-neutral-800 rounded-full animate-pulse"></div>
      </div>
      
      {/* Image Gallery Skeleton */}
      <div className="my-6 h-96 bg-neutral-800 rounded animate-pulse"></div>
      
      {/* Room Availability Skeleton */}
      <div className="space-y-4 my-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-neutral-800 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

export default function HostelDetails() {
  const params = useParams<{ gender: string; hostel: string }>();
  const { hostel, gender } = params;
  const [block, setBlock] = useState<NormalizedBlock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadBlock = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/queryMaster?category=${gender.toUpperCase()}&type=blockData&block=${hostel.toUpperCase()}`
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data: BlockDataResponse = await response.json();
        if (cancelled) return;

        const imagesFromApi = data.blockImages?.[0]?.images || [];
        const normalizedBlock = {
          name: hostel.toUpperCase(),
          images: imagesFromApi,
          rooms: data.rooms || [],
        };

        setBlock(normalizedBlock);
      } catch {
        if (cancelled) return;
        setError("Failed to load hostel details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBlock();

    return () => {
      cancelled = true;
    };
  }, [gender, hostel]);

  if (loading) return <HostelDetailsSkeleton />;
  if (error || !block) return (
    <div className="p-6 md:mx-20 pt-24 text-red-400">
      {error || "Hostel not found"}
    </div>
  );

  // Prepare images for the gallery
  const images =
    block.images?.map((img) => ({ src: img.image_url, alt: block.name })) ||
    [{ src: FALLBACK_IMAGE_URL, alt: "Hostel View" }];

  // Prepare room types for RoomAvailability
  const roomType =
    block.rooms?.map((room) => ({
      gender: gender,
      block: block.name,
      type: room.room_type,
      acAvailable: room.ac_type ? room.ac_type === "AC" : false,
      nonAcAvailable: room.ac_type ? room.ac_type === "NON_AC" : false,
      bunker: room.bed_type ? room.bed_type === "BUNK_BED" : false,
      price: {
        ac: room.price?.toString() || "-",
        nonAc: room.price?.toString() || "-",
      },
      mess: "",
      description: "",
    })) || [];

  const blockTitle = `${block.name} Block`;

  return (
    <div className="p-6 md:mx-20">
      {/* Breadcrumbs */}
      <div className="mt-20 mb-4">
        <Breadcrumbs
          items={[
            { label: "Hostels", href: `/${gender}/hostels` },
            { label: `${gender.charAt(0).toUpperCase() + gender.slice(1)}s`, href: `/${gender}/hostels` },
            { label: blockTitle },
          ]}
        />
      </div>

      {/* Block Title + Badges */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
        {blockTitle}
      </h1>
      <div className="flex items-center my-3 gap-2">
        {/* <Badge className="flex items-center gap-1 bg-green-500 hover:bg-green-600 rounded-full">
          <span className="text-xs">4.9</span>
        </Badge> */}
        <Badge className="bg-neutral-800 text-white rounded-full">AC</Badge>
        <Badge className="bg-neutral-800 text-white rounded-full">Non-AC</Badge>
      </div>

      {/* Gallery */}
      <ImageGallery images={images} />

      {/* Rooms */}
      <RoomAvailability roomType={roomType} showFilter={false} />
    </div>
  );
}
