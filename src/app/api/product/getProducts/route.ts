import { randomUUID } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";

const RequestBodySchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(40),
  searchName: z.string().optional(),
  searchManufacturer: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const body = RequestBodySchema.parse(req);

    const result = await db.product.findMany({
      take: body.pageSize,
      skip: (body.page - 1) * body.pageSize,
      orderBy: {
        createdDate: "desc",
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
