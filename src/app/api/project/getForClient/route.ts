import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { Offer, OfferProduct, Client, Project } from "@prisma/client";

const RequestBodySchema = z.object({
  clientMobile: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const body = RequestBodySchema.parse(req);

    console.log("Body: ", body);

    const result = await db.project.findMany({
      where: {
        mobile: body.clientMobile,
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
