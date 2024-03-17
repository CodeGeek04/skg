import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";

const RequestBodySchema = z.object({
  manufacturer: z.string(),
  productName: z.string(),
  sizeUnit: z.string(),
  size: z.number(),
  listPrice: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    console.log("req: ", req);
    const body = RequestBodySchema.parse(req);

    const result = await db.product.create({
      data: {
        manufacturer: body.manufacturer,
        productName: body.productName,
        sizeUnit: body.sizeUnit,
        size: body.size,
        listPrice: body.listPrice,
      },
    });

    return NextResponse.json({
      status: 200,
      body: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      body: error.message,
    });
  }
}
