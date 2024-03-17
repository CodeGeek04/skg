import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { Offer, OfferProduct, Client, Project } from "@prisma/client";

const RequestBodySchema = z.object({
  offerNumber: z.number(),
  mobile: z.string(),
  projectId: z.string(),
  discount: z.number().default(0),
  totalPrice: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const body = RequestBodySchema.parse(req);

    const result = await db.offer.update({
      where: {
        offerNumber: body.offerNumber,
      },
      data: {
        mobile: body.mobile,
        discount: body.discount,
        totalPrice: body.totalPrice,
        projectId: body.projectId,
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
