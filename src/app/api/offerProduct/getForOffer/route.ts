import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { Offer, OfferProduct, Client, Project } from "@prisma/client";

const RequestBodySchema = z.object({
  offerNumber: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const body = RequestBodySchema.parse(req);

    const result = await db.offerProduct.findMany({
      where: {
        offerNumber: body.offerNumber,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      body: error.message,
    });
  }
}
