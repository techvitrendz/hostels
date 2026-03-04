import Image from "next/image";
import Link from "next/link";

export default function MessCard({
	gender,
	name,
	image,
	block,
}: {
	gender: string;
	name: string;
	image: string;
	block: string;
}) {
	return (
		<Link
			href={`/${gender}/messes/${name.toLowerCase().replace(/\s/g, "-")}`}
			className="border rounded-lg p-4 shadow hover:shadow-lg"
		>
			<Image
				src={image}
				alt={name}
				height={200}
				width={200}
				className="w-full h-48 object-cover rounded"
			/>
			<h2 className="text-xl mt-2 font-semibold">{name}</h2>
			<p className="text-sm text-gray-500">Located in: {block}</p>
		</Link>
	);
}
