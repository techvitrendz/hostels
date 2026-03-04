import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (password !== user.password) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        if (!process.env.JWT_SECRET) {
            console.error("❌ Missing JWT_SECRET in environment variables");
            return NextResponse.json(
                { error: "Server config missing. Contact admin." },
                { status: 500 }
            );
        }


        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const response = NextResponse.json({
            message: "Login successful",
            status: 200
        });

        response.headers.set(
            "Set-Cookie",
            `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
        );

        return response


    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
