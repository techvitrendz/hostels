
import { Name } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server';


const query = prisma


export async function GET(request: Request) {
    try {
        const url = new URL(request.url)

        const img_reqd = url.searchParams.get('type')
        if (!img_reqd || !['hostelList', 'blockData'].includes(img_reqd)) {
            return NextResponse.json(
                { error: 'Invalid or missing type parameter' },
                { status: 400 }
            )
        }

        const rawBlock = url.searchParams.get('block') || 'A'
        const block = rawBlock.trim().toUpperCase().replace(/\s+/g, '_')
        const normalizedBlockWithSpaces = block.replace(/_/g, ' ')
        const normalizedBlockNoSpaces = block.replace(/_/g, '')
        const blockCandidates = Array.from(
            new Set([block, normalizedBlockWithSpaces, normalizedBlockNoSpaces])
        )
        if (!/^[A-Z0-9_]+$/.test(block)) {
            return NextResponse.json(
                { error: 'Invalid block parameter' },
                { status: 400 }
            )
        }

        const rawCategory = url.searchParams.get('category')
        if (!rawCategory || !['MEN', 'WOMEN'].includes(rawCategory)) {
            return NextResponse.json(
                { error: 'Invalid or missing category parameter' },
                { status: 400 }
            )
        }
        const category = rawCategory === 'MEN' ? Name.MEN : Name.WOMEN

        let data;

        switch (img_reqd) {
            case 'hostelList':
                data = await query.block.findMany({
                    where: {
                        category: { name: category }
                    },
                    select: {
                        name: true,
                        images: {
                            take: 1,
                            orderBy: {
                                id: "asc"
                            },
                            select: {
                                image_url: true
                            }
                        },
                        ac: true,
                        bedType: true,
                        rooms: {
                            select: {
                                bed_type: true
                            }
                        },
                        blockType: true,
                        sharing: true
                    }
                })
                data = data.map(block => {
                    const roomBedTypes = Array.from(
                        new Set(
                            block.rooms
                                .map((room) => room.bed_type)
                                .filter((value) => Boolean(value))
                        )
                    )

                    const normalizedBedType = roomBedTypes.length > 0
                        ? roomBedTypes
                        : block.bedType
                            ? [block.bedType]
                            : []

                    return {
                        ...block,
                        bedType: normalizedBedType,
                        image: block.images[0] ?? null,
                        images: undefined,
                        rooms: undefined
                    }
                })

                break;

            case 'blockData': {
                const [blockImages, roomsf] = await Promise.all([
                    query.block.findMany({
                        where: {
                            category: { name: category },
                            name: {
                                in: blockCandidates
                            }
                        },
                        select: {
                            images: {
                                select: { image_url: true }
                            }
                        }
                    }),

                    query.room.findMany({
                        where: {
                            block: {
                                name: {
                                    in: blockCandidates
                                },
                                category: { name: category }
                            }
                        },
                        select: {
                            room_type: true,
                            images: {
                                take: 1,
                                select: { image_url: true }
                            },
                        }
                    })
                ])
                
                const rooms = roomsf.map(change =>({
                    ...change,
                    image: change.images[0]??null,
                    images:undefined
                }))

                data = { blockImages, rooms }
                break;
            }

        }
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return NextResponse.json(
                { error: 'Coming soon' },
                { status: 404 }
            )
        }
        return NextResponse.json(data, { status: 200 })
    }
    catch (error) {
        console.error('[IMAGE_API_ERROR]', error)

        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 'P1001'
        ) {
            return NextResponse.json(
                { error: 'Database connection failed. Please try again in a moment.' },
                { status: 503 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}