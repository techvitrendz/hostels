import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function POST(req: Request) {
	try {
		const { userId } = await req.json();

		if (!userId) {
			return NextResponse.json({ error: "Missing userId" }, { status: 400 });
		}

		await clerkClient.users.updateUser(userId, {
			publicMetadata: { role: "user" },
		});

		return NextResponse.json({ message: "Role assigned successfully" }, { status: 200 });
	} catch {
		return NextResponse.json({ error: "Failed to assign role" }, { status: 500 });
	}
}
