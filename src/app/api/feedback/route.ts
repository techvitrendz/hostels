import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET() {
    try {
        const data = await prisma.feedback.findMany({
            orderBy: { created_at: "desc" }
        });

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: "Data access denied." },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const val = await req.json();

        if (!val.page || !val.response) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        await prisma.feedback.create({
            data: {
                page: val.page,
                response: val.response,
            },
        });

        return NextResponse.json({msg: "Feedback Submitted"}, { status: 201 });

    } catch {
        return NextResponse.json(
            { error: "Failed to submit feedback." },
            { status: 500 }
        );
    }
}
