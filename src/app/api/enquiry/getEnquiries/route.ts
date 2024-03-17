import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { Offer, OfferProduct, Client, Project, Enquiry } from "@prisma/client";

const RequestBodySchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const body = RequestBodySchema.parse(req);

    const result = await db.enquiry.findMany({
      where: {
        AND: [
          {
            createdDate: {
              gte: new Date(body.startDate),
            },
          },
          {
            createdDate: {
              lte: new Date(body.endDate),
            },
          },
        ],
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
