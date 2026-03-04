"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { FeedbackModal } from "@/components/feedback-modal";

interface NavbarProps {
	searchValue?: string;
	onSearchChange?: (value: string) => void;
}

export function Navbar({ searchValue, onSearchChange }: NavbarProps) {
	const pathname = usePathname();
	const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
	const isAdminPortal = pathname === "/admin-vitrendz";

	if (isAdminPortal) {
		return null;
	}

	const isHomePage = pathname === "/";
	// Only show search on list pages, not on detail pages
	// Show search on hostels/messes except hostel block detail page and bed detail page
	const isHostelsRoute = pathname.includes("/hostels");
	const isMessesRoute = pathname.includes("/messes");
	const isHostelDetailRoute = /^\/(men|women)\/hostels\/[^/]+(\/[^/]+)?\/?$/.test(pathname);
	const showSearch = (isHostelsRoute || isMessesRoute) && !isHostelDetailRoute;

	return (
		<nav className={`fixed top-0 left-0 right-0 z-50 ${isHomePage ? "bg-transparent" : "bg-black"}`}>
			{/* Top Navigation Bar */}
			<div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
				{/* Logo */}
				<Link href="/" className="flex-shrink-0">
					<Image
						src="/vitrendz-logo.svg"
						alt="iTrondz Logo"
						width={120}
						height={40}
						className="h-10 w-auto"
						priority
					/>
				</Link>

				{/* Center Navigation - Hostels & Messes */}
				{/* <div className="flex-1 flex items-center justify-center space-x-12 md:space-x-16">
					<Link
						href="/men/hostels"
						className={`text-base font-medium transition-colors relative pb-2 ${
							isHostelsActive && pathname.includes("/men")
								? "text-blue-500"
								: "text-gray-300 hover:text-white"
						}`}
					>
						Hostels
						{isHostelsActive && pathname.includes("/men") && (
							<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
						)}
					</Link>
					<Link
						href="/men/messes"
						className={`text-base font-medium transition-colors relative pb-2 ${
							isMessesActive && pathname.includes("/men")
								? "text-blue-500"
								: "text-gray-300 hover:text-white"
						}`}
					>
						Messes
						{isMessesActive && pathname.includes("/men") && (
							<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
						)}
					</Link>
				</div> */}

				{/* Right Side - Sign In */}
				<div className="flex-shrink-0">
					<button
						onClick={() => setIsFeedbackOpen(true)}
						className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
					>
						Give Feedback
					</button>
				</div>
			</div>

			{/* Search Bar Section - only show on hostels/messes pages */}
			{showSearch && (
				<div className="bg-black">
					<div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
						<div className="relative max-w-2xl mx-auto">
							<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
							<input
								type="text"
								placeholder="Search Block Name"
								value={searchValue || ""}
								onChange={(e) => onSearchChange?.(e.target.value)}
								className="w-full rounded-lg bg-neutral-800/60 px-4 py-3 pl-12 text-sm text-white placeholder:text-neutral-500 outline-none border border-transparent focus:border-neutral-600 transition"
							/>
						</div>
					</div>
				</div>
			)}
			<FeedbackModal
				open={isFeedbackOpen}
				onClose={() => setIsFeedbackOpen(false)}
				defaultPage={pathname}
			/>
		</nav>
	);
}
