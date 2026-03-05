import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn("JWT_SECRET is missing. Using development fallback secret.");
    return "dev-only-jwt-secret-change-me";
  }

  return null;
}
  
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role} = body;


    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== role) {
      return NextResponse.json({ error: "Role mismatch. Wrong login portal." }, { status: 403 });
    }

    if (password !== user.password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      console.error("❌ Missing JWT_SECRET in environment variables");
      return NextResponse.json(
        { error: "Server config missing. Contact admin." },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { username: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      status: 200
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response


  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
