import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        const body = await req.json()

        const packageId = body.packageId
        const deliveryLocation = body.deliveryLocation

        await prisma.packages.update({
            where: {
                id: packageId
            },
            data: {
                delivery: true,
                deliveryLocation: deliveryLocation
            }
        })

        return NextResponse.json('Done')
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}