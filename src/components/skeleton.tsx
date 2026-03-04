import React from "react";

// Enhanced shimmer effect using Tailwind animations
const shimmerClass = "animate-pulse";

export function CardSkeleton() {
  return (
    <div className="rounded-lg bg-black border border-neutral-800 overflow-hidden shadow-lg">
      {/* Image Skeleton with animated shimmer */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
        <div className={`w-full h-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 ${shimmerClass}`}></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-3 w-full">
            {/* Title */}
            <div className={`h-5 bg-neutral-800 rounded ${shimmerClass} w-3/4`}></div>
            
            {/* Subtitle */}
            <div className={`h-4 bg-neutral-800 rounded ${shimmerClass} w-1/2`}></div>
            
            {/* Price */}
            <div className={`h-4 bg-neutral-800 rounded ${shimmerClass} w-2/3 mt-2`}></div>
          </div>

          {/* Rating Badge */}
          <div className={`h-6 w-12 bg-neutral-800 rounded-full ${shimmerClass} flex-shrink-0`}></div>
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RoomCardSkeleton() {
  return (
    <div className="border border-neutral-700 rounded p-4 mb-4 w-full max-w-md bg-neutral-950">
      <div className="space-y-3">
        {/* AC Type */}
        <div className={`h-4 bg-neutral-800 rounded ${shimmerClass} w-1/2`}></div>
        
        {/* Bed Type */}
        <div className={`h-4 bg-neutral-800 rounded ${shimmerClass} w-1/2`}></div>
        
        {/* Price */}
        <div className={`h-4 bg-neutral-800 rounded ${shimmerClass} w-1/3`}></div>
        
        {/* Image Skeleton */}
        <div className="mt-4">
          <div className={`w-full h-48 bg-neutral-800 rounded ${shimmerClass}`}></div>
        </div>
      </div>
    </div>
  );
}

export function RoomListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <div className={`h-8 bg-neutral-800 rounded ${shimmerClass} w-64 mb-8`}></div>
      <div className="space-y-4 w-full flex flex-col items-center">
        {Array.from({ length: count }).map((_, i) => (
          <RoomCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function NavbarSkeleton() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className={`h-10 w-32 bg-neutral-800 rounded ${shimmerClass} flex-shrink-0`}></div>

        {/* Navigation Links */}
        <div className="flex-1 flex items-center justify-center space-x-12 md:space-x-16">
          <div className={`h-5 w-20 bg-neutral-800 rounded ${shimmerClass}`}></div>
          <div className={`h-5 w-20 bg-neutral-800 rounded ${shimmerClass}`}></div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className={`h-9 w-9 bg-neutral-800 rounded ${shimmerClass}`}></div>
          <div className={`h-9 w-9 bg-neutral-800 rounded-full ${shimmerClass}`}></div>
        </div>
      </div>
    </nav>
  );
}
