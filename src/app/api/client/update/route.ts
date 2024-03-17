import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { Offer, OfferProduct, Client, Project } from "@prisma/client";

const RequestBodySchema = z.object({
  mobile: z.string(),
  clientName: z.string(),
  address: z.string(),
  mailId: z.string(),
  alternateNumbers: z.array(z.string()).default([]),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const body = RequestBodySchema.parse(req);

    console.log("BODY: ", body);

    const result = await db.client.update({
      where: {
        mobile: body.mobile,
      },
      data: {
        clientName: body.clientName,
        address: body.address,
        mailId: body.mailId,
        alternateNumbers: body.alternateNumbers,
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
