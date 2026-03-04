import { footerCommunityLinks, footerServicesLinks } from "@/lib/links";
import Link from "next/link";

export default function Footer() {
	return (
		<>
			<div className="dark:bg-gray-950 bg-gray-100 backdrop-blur-lg px-4 md:px-28 z-50 py-8 text-black bottom-0 w-full dark:text-white">
				<div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between space-y-8 md:space-y-0">
					<div className="services-column w-full md:w-auto">
						<h3 className="text-2xl font-bold mb-4 section-title">Services</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{footerServicesLinks.map(({ name, site }) => (
								<Link
									key={site}
									href={site}
									target="_blank"
									rel="noopener noreferrer"
									className="contactSectionLinks hover:text-purple-300 transition-colors"
								>
									{name}
								</Link>
							))}
						</div>
					</div>

					<div className="community-column w-full md:w-auto">
						<h3 className="text-2xl font-bold mb-4 section-title">Community</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{footerCommunityLinks.map(({ name, site }) => (
								<Link
									key={site}
									href={site}
									target="_blank"
									rel="noopener noreferrer"
									className="contactSectionLinks cursor-pointer hover:text-purple-300 transition-colors"
								>
									{name}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
