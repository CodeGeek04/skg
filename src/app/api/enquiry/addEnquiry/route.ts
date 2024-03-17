import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { Offer, OfferProduct, Client, Project, Enquiry } from "@prisma/client";

const RequestBodySchema = z.object({
  offerNumber: z.number(),
  mobile: z.string(),
  projectId: z.string(),
  discount: z.number().default(0),
  totalPrice: z.number(),
  offerProducts: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
    }),
  ),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const body = RequestBodySchema.parse(req);

    const result = await db.enquiry.create({
      data: {
        offerNumber: body.offerNumber,
        mobile: body.mobile,
        discount: body.discount,
        totalPrice: body.totalPrice,
        projectId: body.projectId,
        offerProducts: {
          create: body.offerProducts.map((offerProduct) => ({
            product: {
              connect: {
                productId: offerProduct.productId,
              },
            },
            quantity: offerProduct.quantity,
          })),
        },
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
