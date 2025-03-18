import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const GET = async(req: Request) => {
    try{
        console.log('sdsa')
        const packages = await prisma.packages.findMany();
        console.log(packages)

        if(!packages) return NextResponse.json({message: 'Package not found'})

        return NextResponse.json({ packages})
    }catch(err){
        return NextResponse.json(err, {status: 500})
    }
}