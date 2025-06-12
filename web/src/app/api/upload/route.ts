import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".docx")) {
      return NextResponse.json(
        { error: "Only .docx files are allowed" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const path = join(process.cwd(), "public", "uploads", filename);

    // Ensure the uploads directory exists
    await writeFile(path, buffer);

    return NextResponse.json({
      path: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
