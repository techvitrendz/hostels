export default async function MessDetails({
	params,
}: {
	params: Promise<{ mess: string }>;
}) {
	const { mess } = await params;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">
				{mess.replace(/-/g, " ").toUpperCase()}
			</h1>
			<p>
				This mess offers both vegetarian and non-vegetarian options. Meals
				include breakfast, lunch, snacks, and dinner.
			</p>
		</div>
	);
}
