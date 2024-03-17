import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { Offer, OfferProduct, Client, Project } from "@prisma/client";

const RequestBodySchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  clientMobile: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const body = RequestBodySchema.parse(req);

    const result = await db.project.update({
      where: {
        projectId: body.projectId,
      },
      data: {
        projectName: body.projectName,
        client: {
          update: {
            mobile: body.clientMobile,
          },
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
