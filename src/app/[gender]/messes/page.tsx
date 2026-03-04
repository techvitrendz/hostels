import MessCard from "@/components/MessCard";

const mockMesses = {
	men: [
		{ name: "North Mess", image: "/northmess.jpg", block: "R Block" },
		{ name: "South Mess", image: "/southmess.jpg", block: "S Block" },
	],
	women: [
		{ name: "East Mess", image: "/eastmess.jpg", block: "A Block" },
		{ name: "West Mess", image: "/westmess.jpg", block: "B Block" },
	],
};

export default async function MessList({
	params,
}: {
	params: Promise<{ gender: string }>;
}) {
	const { gender } = await params;
	const messes = mockMesses[gender.toLowerCase() as "men" | "women"] || [];

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">
				{gender.toUpperCase()}&apos;s Messes
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{messes.map((mess) => (
					<MessCard
						key={mess.name}
						gender={gender}
						name={mess.name}
						image={mess.image}
						block={mess.block}
					/>
				))}
			</div>
		</div>
	);
}
