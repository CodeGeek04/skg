//Get Unique Manufacturers from db

import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";

const RequestBodySchema = z.object({});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const body = RequestBodySchema.parse(req);

    const result = await db.product.findMany({
      select: {
        manufacturer: true,
      },
      distinct: ["manufacturer"],
    });

    const manufacturers = result.map((item) => item.manufacturer);

    return NextResponse.json(manufacturers);
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      body: error.message,
    });
  }
}
