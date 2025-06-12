import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: { path: string } },
) {
  try {
    const session = await getUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filePath = path.join(process.env.RESUME_BASE_PATH!, params.path);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `inline; filename="${path.basename(filePath)}"`,
    );

    return new NextResponse(fileBuffer, {
      headers,
    });
  } catch (error) {
    console.error("Error serving resume file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
