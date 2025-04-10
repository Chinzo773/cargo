import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const GET = async () => {
    try{
        const packages = await prisma.packages.findMany({
            where: {
                delivery: true
            }
        })

        return NextResponse.json(packages)
    }catch(err){
        console.log(err)
    }
}