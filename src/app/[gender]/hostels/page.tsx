"use client";
import React, { useState, useEffect, use } from "react";
import HostelCard from "@/components/HostelCard";
import Filter, { FilterState } from "@/components/filter";
import { Navbar } from "@/components/navbar";
import { GridSkeleton } from "@/components/skeleton";

const FALLBACK_IMAGE_URL =
	"https://vit.ac.in/wp-content/uploads/2025/03/327A0201-copy-1024x683.webp";

type HostelApiBlock = {
	name: string;
	image?: { image_url?: string } | null;
	ac?: boolean;
	sharing?: number[];
	bedType?: string[];
	blockType?: string; // received from server (lowercase)
};

type HostelCardData = {
	name: string;
	image: string;
	ac: boolean;
	sharing: number[];
	bedType: string[];
	blockType: string;
};

export default function HostelList({
	params,
}: {
	params: Promise<{ gender: string }>;
}) {
	const { gender } = use(params);
	const [hostels, setHostels] = useState<HostelCardData[]>([]);
	const [filter, setFilter] = useState<FilterState>({
		ac: null,
		sharing: [],
		bedType: [],
		blockType: [],
		search: "",
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const loadHostels = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch(
					`/api/queryMaster?category=${gender.toUpperCase()}&type=hostelList`,
				);

				if (!response.ok) {
					let apiMessage = "Failed to load hostels";
					try {
						const errorData = await response.json();
						if (errorData?.error) {
							apiMessage = errorData.error;
						}
					} catch {
						// no-op: keep fallback message
					}
					throw new Error(apiMessage);
				}

				const data = await response.json();
				if (cancelled) return;

				const normalizedHostels: HostelCardData[] = Array.isArray(data)
					? (data as HostelApiBlock[])
							.map((block) => ({
								name: block.name,
								image: block.image?.image_url || FALLBACK_IMAGE_URL,
								ac: block.ac ?? false,
								sharing: block.sharing ?? [],
								bedType: block.bedType ?? [],
								// make sure the value is lowercase to match UI expectations
								blockType: block.blockType
									? block.blockType.toLowerCase()
									: block.name,
							}))
							.sort((a, b) => a.name.localeCompare(b.name))
					: [];

				setHostels(normalizedHostels);

				if (normalizedHostels.length === 0) {
					setError("No hostels found for the selected category");
				}
			} catch (err) {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : "Failed to load hostels");
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		loadHostels();

		return () => {
			cancelled = true;
		};
	}, [gender]);

	const filteredHostels = hostels.filter((hostel) => {
		const acMatch = filter.ac === null || hostel.ac === filter.ac;
		const sharingMatch =
			filter.sharing.length === 0 ||
			hostel.sharing.some((s) => filter.sharing.includes(s));
		const bedTypeMatch =
			filter.bedType.length === 0 ||
			hostel.bedType.some((b) => filter.bedType.includes(b));
		const blockTypeMatch =
			filter.blockType.length === 0 ||
			filter.blockType.includes(hostel.blockType);
		const searchMatch =
			filter.search.trim() === "" ||
			hostel.name.toLowerCase().includes(filter.search.trim().toLowerCase());
		return (
			acMatch && sharingMatch && bedTypeMatch && blockTypeMatch && searchMatch
		);
	});

	if (loading)
		return (
			<>
				<Navbar
					searchValue={filter.search}
					onSearchChange={(value) => setFilter({ ...filter, search: value })}
				/>
				<div className="flex flex-col justify-center p-4 pt-40 md:pt-44 bg-black min-h-screen">
					<div className="max-w-7xl mx-auto w-full">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-bold">Hostels</h1>
								<span className="text-gray-400">›</span>
								<h2 className="text-2xl font-bold text-gray-300">
									{gender.charAt(0).toUpperCase() + gender.slice(1)}
								</h2>
							</div>
							<Filter filter={filter} setFilter={setFilter} />
						</div>
						<GridSkeleton count={6} />
					</div>
				</div>
			</>
		);
	if (error)
		return (
			<>
				<Navbar
					searchValue={filter.search}
					onSearchChange={(value) => setFilter({ ...filter, search: value })}
				/>
				<div className="flex flex-col justify-center p-4 pt-40 md:pt-44 bg-black min-h-screen">
					<div className="max-w-7xl mx-auto w-full">
						<div className="text-center text-red-400">{error}</div>
					</div>
				</div>
			</>
		);

	return (
		<>
			<Navbar
				searchValue={filter.search}
				onSearchChange={(value) => setFilter({ ...filter, search: value })}
			/>
			<div className="flex flex-col justify-center p-4 pt-40 md:pt-44 bg-black min-h-screen">
				<div className="max-w-7xl mx-auto w-full">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							<h1 className="text-2xl font-bold">Hostels</h1>
							<span className="text-gray-400">›</span>
							<h2 className="text-2xl font-bold text-gray-300">
								{gender.charAt(0).toUpperCase() + gender.slice(1)}
							</h2>
						</div>
						<Filter filter={filter} setFilter={setFilter} />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-6">
						{filteredHostels.map((hostel) => (
							<HostelCard
								key={hostel.name}
								gender={gender}
								name={hostel.name}
								image={hostel.image}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
