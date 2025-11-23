import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  hotelName: z.string().min(2, "Hotel name must be at least 2 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, hotelName } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Hotel slug
    const slug = hotelName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Math.floor(Math.random() * 1000);

    // Create Hotel and User in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const hotel = await tx.hotel.create({
        data: {
          name: hotelName,
          slug: slug,
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "MANAGER", // First user is Manager
          hotelId: hotel.id,
        },
      });

      return { user, hotel };
    });

    return NextResponse.json(
      { 
        message: "User registered successfully",
        userId: result.user.id,
        hotelSlug: result.hotel.slug
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}

