import type { Metadata, Viewport } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Navbar } from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
	title: "Hostels",
	description:
		"Explore VIT hostels with virtual tours, student reviews, photos, maps, and detailed descriptions to help you choose the perfect accommodation.",
	keywords:
		"VIT hostels, VIT accommodation, hostel reviews, hostel photos, VIT campus living, VIT hostel maps, hostel virtual tour",
	authors: [{ name: "VTech Team" }],
	creator: "VTech Team",
	publisher: "VITrendz",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://hostels.vitrendz.in"),
	alternates: {
		canonical: "/",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

	const appContent = (
		<html lang="en" suppressHydrationWarning>
			<body cz-shortcut-listen="true">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);

	if (!publishableKey) {
		return appContent;
	}

	return (
		<ClerkProvider publishableKey={publishableKey}>
			{appContent}
		</ClerkProvider>
	);
}
