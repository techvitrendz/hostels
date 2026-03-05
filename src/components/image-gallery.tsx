"use client"

import { useState } from "react"
import Image from "next/image"

interface ImageGalleryProps {
  images: { src: string; alt: string }[];
}

const FALLBACK_IMAGE_URL = "/fallback.png";

export function ImageGallery({ images }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    images = [
      {
        src: FALLBACK_IMAGE_URL,
        alt: "Hostel image",
      },
    ];
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (slideIndex: number) => setCurrentIndex(slideIndex);

  // Prepare small previews (next 3 images)
  const previews = images.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {/* Large image */}
      <div className="relative h-[220px] md:h-[320px] lg:h-[360px] w-full overflow-hidden rounded-lg">
        <Image
          src={images[currentIndex]?.src || FALLBACK_IMAGE_URL}
          alt={images[currentIndex]?.alt || "Image"}
          fill
          unoptimized
          className="object-cover"
          priority
        />
      </div>

      {/* Right side thumbnails grid */}
      <div className="grid grid-cols-2 gap-4">
        {previews.slice(1).map((image, idx) => {
          const actualIndex = idx + 1;
          const isLast = idx === previews.slice(1).length - 1;
          const hasMore = images.length > previews.length && isLast;
          return (
            <div
              key={actualIndex}
              className="relative h-[100px] md:h-[150px] lg:h-[170px] w-full overflow-hidden rounded-lg cursor-pointer"
              onClick={() => goToSlide(actualIndex)}
            >
              <Image src={image?.src || FALLBACK_IMAGE_URL} alt={image?.alt || "Preview"} fill unoptimized className="object-cover" />
              {hasMore && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="px-3 py-1 bg-white/90 text-black text-xs rounded-full">More Photos</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

