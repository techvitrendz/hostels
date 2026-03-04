import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const { userId } = getAuth(req);

	if (!userId) {
		return NextResponse.redirect(new URL("/sign-in", req.url));
	}

	let role = "user";
	try {
		const user = await clerkClient.users.getUser(userId);
		role = String(user.publicMetadata?.role ?? "user");
	} catch {
		return NextResponse.redirect(new URL("/sign-in", req.url));
	}

	const pathname = req.nextUrl.pathname;

	// Redirect non-admins away from /admin
	if (pathname.startsWith("/admin") && role !== "admin") {
		return NextResponse.redirect(new URL("/unauthorized", req.url));
	}

	return NextResponse.next();
}

// Apply middleware to these routes
export const config = {
	matcher: [
		"/admin/:path*",
		"/dashboard",
		"/admin-dashboard",
		"/user-dashboard",
	],
};
