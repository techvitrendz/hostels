import { Name } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const query = prisma;

// Cache hostel list data for 1 hour (3600 seconds)
const getCachedHostelList = unstable_cache(
	async (category: Name) => {
		return await query.block.findMany({
			where: {
				category: { name: category },
			},
			select: {
				name: true,
				images: {
					take: 1,
					orderBy: {
						id: "asc",
					},
					select: {
						image_url: true,
					},
				},
				ac: true,
				bedType: true,
				rooms: {
					select: {
						bed_type: true,
					},
				},
				blockType: true,
				sharing: true,
			},
		});
	},
	["hostelList"],
	{ revalidate: 86400, tags: ["hostelList"] },
);

// Cache block data for 1 hour (3600 seconds)
const getCachedBlockData = unstable_cache(
	async (category: Name, blockCandidates: string[]) => {
		return await Promise.all([
			query.block.findMany({
				where: {
					category: { name: category },
					name: {
						in: blockCandidates,
					},
				},
				select: {
					images: {
						select: { image_url: true },
					},
				},
			}),
			query.room.findMany({
				where: {
					block: {
						name: {
							in: blockCandidates,
						},
						category: { name: category },
					},
				},
				select: {
					room_type: true,
					images: {
						take: 1,
						select: { image_url: true },
					},
				},
			}),
		]);
	},
	["blockData"],
	{ revalidate: 86400, tags: ["blockData"] },
);

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);

		const img_reqd = url.searchParams.get("type");
		if (!img_reqd || !["hostelList", "blockData"].includes(img_reqd)) {
			return NextResponse.json(
				{ error: "Invalid or missing type parameter" },
				{ status: 400 },
			);
		}

		const rawBlock = url.searchParams.get("block") || "A";
		const block = rawBlock.trim().toUpperCase().replace(/\s+/g, "_");
		const normalizedBlockWithSpaces = block.replace(/_/g, " ");
		const normalizedBlockNoSpaces = block.replace(/_/g, "");
		const blockCandidates = Array.from(
			new Set([block, normalizedBlockWithSpaces, normalizedBlockNoSpaces]),
		);
		if (!/^[A-Z0-9_]+$/.test(block)) {
			return NextResponse.json(
				{ error: "Invalid block parameter" },
				{ status: 400 },
			);
		}

		const rawCategory = url.searchParams.get("category");
		if (!rawCategory || !["MEN", "WOMEN"].includes(rawCategory)) {
			return NextResponse.json(
				{ error: "Invalid or missing category parameter" },
				{ status: 400 },
			);
		}
		const category = rawCategory === "MEN" ? Name.MEN : Name.WOMEN;

		let data;

		switch (img_reqd) {
			case "hostelList":
				data = await getCachedHostelList(category);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				data = data.map((block: any) => {
					const roomBedTypes = Array.from(
						new Set(
							block.rooms
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								.map((room: any) => room.bed_type)
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								.filter((value: any) => Boolean(value)),
						),
					);

					const normalizedBedType =
						roomBedTypes.length > 0
							? roomBedTypes
							: block.bedType
								? [block.bedType]
								: [];

					return {
						...block,
						bedType: normalizedBedType,
						image: block.images[0] ?? null,
						images: undefined,
						rooms: undefined,
					};
				});

				break;

			case "blockData": {
				const [blockImages, roomsf] = await getCachedBlockData(
					category,
					blockCandidates,
				);

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const rooms = roomsf.map((change: any) => ({
					...change,
					image: change.images[0] ?? null,
					images: undefined,
				}));

				data = { blockImages, rooms };
				break;
			}
		}
		if (!data || (Array.isArray(data) && data.length === 0)) {
			return NextResponse.json({ error: "Coming soon" }, { status: 404 });
		}

		// Add cache headers for client-side caching
		const response = NextResponse.json(data, { status: 200 });
		response.headers.set(
			"Cache-Control",
			"public, s-maxage=3600, stale-while-revalidate=86400",
		);
		return response;
	} catch (error) {
		console.error("[IMAGE_API_ERROR]", error);

		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			error.code === "P1001"
		) {
			return NextResponse.json(
				{ error: "Database connection failed. Please try again in a moment." },
				{ status: 503 },
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
