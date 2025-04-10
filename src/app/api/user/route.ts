import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
 
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId"); 

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: {
        clerkId: userId, 
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sanitizedUser = Object.fromEntries(
      Object.entries(user).map(([key, value]) => [
        key, value === null ? "" : value, // replace null with empty string
      ])
    );

    return NextResponse.json(sanitizedUser);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch user info", details: `error: ${err}` },
      { status: 500 }
    );
  }
};

export const PUT = async (req: Request) => {
  try {

    const body = await req.json();

    const { userId, phoneNumber } = body;
    if (!userId || !phoneNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    //Rel
    const matchingPackages = await prisma.packages.findMany({
      where: {
        OR: [
          { senderPhoneNumber: phoneNumber },
          { receiverPhoneNumber: phoneNumber },
        ],
      },
    });

    if (matchingPackages.length > 0) {
      await prisma.packages.updateMany({
        where: {
          id: {
            in: matchingPackages.map(pkg => pkg.id),
          },
        },
        data: {
          clerkId: userId,
        },
      });
    } else {
      // If no matching packages are found, clear the clerkId for this user in the packages table
      await prisma.packages.updateMany({
        where: {
          clerkId: userId,
        },
        data: {
          clerkId: null,
        },
      });
    }

    // Update the user's phone number
    const updatedUser = await prisma.users.update({
      where: {
        clerkId: userId,
      },
      data: {
        phoneNumber,
      },
    });

    return NextResponse.json({
      message: "User info updated successfully!",
      user: updatedUser, 
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update user info", details:`error: ${err}` },
      { status: 500 }
    );
  }
};