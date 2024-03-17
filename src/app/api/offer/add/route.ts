import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { Offer, Client, Project } from "@prisma/client";

const RequestBodySchema = z.object({
  mobile: z.string(),
  projectId: z.string(),
  discount: z.number().default(0),
  totalPrice: z.number().default(0),
  clientName: z.string(),
  projectName: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const body = RequestBodySchema.parse(req);

    console.log("Body: ", body);

    const result = await db.offer.create({
      data: {
        mobile: body.mobile,
        discount: body.discount,
        totalPrice: body.totalPrice,
        projectId: body.projectId,
        clientName: body.clientName,
        projectName: body.projectName,
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
