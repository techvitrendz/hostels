"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function HeroSection() {
	const router = useRouter();
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [comingSoonMessage, setComingSoonMessage] = useState("");

	const images = [
		"/img1.png",
		"/img2.png",
		"/img3.png",
		"/img4.png",
	];

	// 🔁 Auto change image every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prevIndex) =>
				prevIndex === images.length - 1 ? 0 : prevIndex + 1
			);
		}, 5000);

		return () => clearInterval(interval);
	}, [images.length]);

	const handleSelect = (gender: "men" | "women") => {
		if (gender === "women") {
			setComingSoonMessage("Women hostels are coming soon.");
			return;
		}
		setComingSoonMessage("");
		router.push(`/${gender}/hostels`);
	};

	return (
		<div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
			{/* Background Image Carousel */}
			{images.map((image, index) => (
				<Image
					key={index}
					src={image}
					alt={`Hostel view ${index + 1}`}
					fill
					sizes="100vw"
					className="absolute top-0 left-0 w-full h-full object-cover"
					style={{
						opacity: index === currentImageIndex ? 1 : 0,
						transition: "opacity 0.5s ease-in-out",
						zIndex: index === currentImageIndex ? 1 : 0,
					}}
				/>
			))}

			{/* Dark Overlay */}
			<div className="absolute inset-0 bg-black/40 z-10" />

			{/* Content */}
			<div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4">
				<h2 className="text-white text-center text-2xl md:text-4xl lg:text-7xl font-bold drop-shadow-lg">
					Welcome to Hostels of VIT.
				</h2>
				<p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-200 text-center">
					Which one would you like to see?
				</p>
				<div className="flex gap-16 mt-10">
					<Button>
						<div onClick={() => handleSelect("men")}>Men&apos;s</div>
					</Button>
					<Button>
						<div onClick={() => handleSelect("women")}>Women&apos;s</div>
					</Button>
				</div>
				{comingSoonMessage && (
					<p className="mt-4 text-sm md:text-base text-neutral-200 text-center">
						{comingSoonMessage}
					</p>
				)}
			</div>

			{/* Indicators */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
				{images.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentImageIndex(index)}
						className={`h-1 rounded-full transition-all duration-300 ${
							index === currentImageIndex
								? "bg-white w-12"
								: "bg-white/50 w-8"
						}`}
					/>
				))}
			</div>
		</div>
	);
}
