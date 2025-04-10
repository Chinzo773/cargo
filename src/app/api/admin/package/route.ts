import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  try {
    const body = await req.json()
    console.log(body)

    const newPackage = await prisma.packages.create({
      data: body.packages,
    });

    let matchingUser = null;

    if (body.packages.senderPhoneNumber) {
      matchingUser = await prisma.users.findUnique({
        where: {
          phoneNumber: body.packages.senderPhoneNumber,
        },
      });
    }

    if (!matchingUser && body.packages.receiverPhoneNumber) {
      matchingUser = await prisma.users.findUnique({
        where: {
          phoneNumber: body.packages.receiverPhoneNumber,
        },
      });
    }

    if (matchingUser) {
      await prisma.packages.update({
        where: { id: newPackage.id },
        data: {
          clerkId: matchingUser.clerkId,
        },
      });
    }

    return new Response("Done");
  } catch(err) {
    return NextResponse.json( err, { status: 500 });
  }
}

export const GET = async (_req: Request) => {
    try {
        const packages = await prisma.packages.findMany();

        if (!packages) return NextResponse.json({ message: 'Package not found' })

        return NextResponse.json({ packages })
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}