import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const GET = async (_req: Request) => {
  try {

    const packages = await prisma.packages.findMany({});

    if (!packages) return NextResponse.json({ message: 'Package not found' })

    let pending = 0
    let delivered = 0
    let inTransit = 0
    let shipped = 0

    packages.forEach(obj => {
      if (obj.status === 'Pending') {
        pending += 1;
      } else if (obj.status === 'Delivered') {
        delivered += 1
      } else if (obj.status === 'In Transit') {
        inTransit += 1
      } else if (obj.status === 'Shipped') {
        shipped += 1
      }
    });

    return NextResponse.json({ data: [{ "pending": pending }, { "delivered": delivered }, { "inTransit": inTransit }, { "shipped": shipped }] })
  } catch (err) {
    return NextResponse.json(err, { status: 500 })
  }
}

export const PUT = async (req: Request) => {
  try {
    const body = await req.json();

    const packageIds = body.packageId;
    const newStatus = body.status;

    await prisma.packages.updateMany({
      where: {
        id: {
          in: Array.isArray(packageIds) ? packageIds.map((id: string) => String(id)) : [String(packageIds)]
        }
      },
      data: {
        status: newStatus
      }
    });
    return NextResponse.json('Done');
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
};