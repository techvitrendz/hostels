import Link from "next/link";
import Image from "next/image";

export default function HostelCard({
	gender,
	name,
	image,
}: {
	gender: string;
	name: string;
	image: string;
}) {
	const hasAC = true;
	const hasNonAC = true;

	return (
		<Link
			href={`/${gender}/hostels/${name.toLowerCase()}`}
			className="group"
		>
			<div className="relative overflow-hidden rounded-lg bg-black border border-neutral-800 hover:border-neutral-700 transition-all">
				{/* Image Container */}
				<div className="relative aspect-[4/3] overflow-hidden">
					<Image
						src={image}
						alt={name}
						fill
						unoptimized
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
					
					{/* AC/Non-AC Badges on Image */}
					<div className="absolute bottom-3 left-3 flex gap-2">
						{hasAC && (
							<span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
								AC
							</span>
						)}
						{hasNonAC && (
							<span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
								Non-AC
							</span>
						)}
					</div>
				</div>

				{/* Card Content */}
				<div className="p-4">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1">
							<h3 className="text-lg font-semibold text-white">
								{name}
							</h3>
							{/* <p className="text-sm text-neutral-400 mt-0.5">
								({blockType})
							</p> */}
							{/* <p className="text-sm text-neutral-300 mt-2">
								{priceRange}
							</p> */}
						</div>
						
						{/* Rating Badge
						<div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
							rating >= 4 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
						}`}>
							<Star className="h-3 w-3 fill-current" />
							<span>{rating.toFixed(1)}</span>
						</div> */}
					</div>
				</div>
			</div>
		</Link>
	);
}
