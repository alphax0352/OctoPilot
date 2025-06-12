import { NextResponse } from "next/server";
import prisma from "@/../prisma/client";
import { applicationSchema, Application } from "@/types/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const company = searchParams.get("company") || "";
    const status = searchParams.get("status") || "";

    const where = {
      user: {
        email: session.user.email,
      },
      ...(company && {
        company: {
          contains: company,
          mode: "insensitive",
        },
      }),
      ...(status && {
        status,
      }),
    };

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.application.count({
        where,
      }),
    ]);

    const validatedApplications = applications.map((app: Application) =>
      applicationSchema.parse({
        id: app.id,
        title: app.title,
        company: app.company,
        description: app.description,
        resumePath: app.resumePath,
        coverLetter: app.coverLetter,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        status: app.status,
      }),
    );

    return NextResponse.json({
      data: validatedApplications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Handle bulk update
    if (Array.isArray(body)) {
      const updates = body.map(({ id, status }) => ({
        id: Number(id),
        status,
      }));

      await prisma.application.updateMany({
        where: {
          id: {
            in: updates.map((update) => update.id),
          },
          user: {
            email: session.user.email,
          },
        },
        data: {
          status: updates[0].status, // This is a limitation of Prisma's updateMany
        },
      });

      return NextResponse.json({ success: true });
    }

    // Handle single update
    const { id, status } = body;
    const updatedApplication = await prisma.application.update({
      where: {
        id: Number(id),
        user: {
          email: session.user.email,
        },
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids")?.split(",").map(Number);

    if (!ids?.length) {
      return NextResponse.json(
        { error: "No application IDs provided" },
        { status: 400 },
      );
    }

    await prisma.application.deleteMany({
      where: {
        id: {
          in: ids,
        },
        user: {
          email: session.user.email,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting applications:", error);
    return NextResponse.json(
      { error: "Failed to delete applications" },
      { status: 500 },
    );
  }
}
