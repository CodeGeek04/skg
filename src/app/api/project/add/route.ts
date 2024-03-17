import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { Offer, OfferProduct, Client, Project } from "@prisma/client";

const RequestBodySchema = z.object({
  projectName: z.string(),
  clientMobile: z.string(),
  clientName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const body = RequestBodySchema.parse(req);

    console.log("Request body: ", body);

    // Fetch client details using the provided mobile number
    const client = await db.client.findUnique({
      where: { mobile: body.clientMobile },
    });

    if (!client) {
      throw new Error("Client not found");
    }

    const result = await db.project.create({
      data: {
        projectId: randomUUID(),
        projectName: body.projectName,
        client: {
          connect: {
            mobile: body.clientMobile,
          },
        },
        clientName: client.clientName, // Add clientName to the Project creation
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
