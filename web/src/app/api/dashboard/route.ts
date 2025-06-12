import { NextResponse } from "next/server";
import prisma from "@/../prisma/client";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { Application, ApplicationStatus } from "@/types/server";

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current date and last week's date
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get all applications for the user
    const applications = await prisma.application.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate total applications
    const totalApplications = applications.length;

    // Calculate applications by status
    const statusCounts = applications.reduce(
      (acc: Record<ApplicationStatus, number>, app: Application) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<ApplicationStatus, number>,
    );

    // Calculate active applications (STEP_1 to STEP_6)
    const activeApplications = applications.filter((app: Application) =>
      app.status.startsWith("STEP_"),
    ).length;

    // Calculate applications created this week and last week
    const thisWeekApplications = applications.filter(
      (app: Application) => app.createdAt >= lastWeek,
    ).length;
    const lastWeekApplications = applications.filter(
      (app: Application) =>
        app.createdAt >=
          new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000) &&
        app.createdAt < lastWeek,
    ).length;

    // Calculate today's applications
    const todayApplications = applications.filter(
      (app: Application) => app.createdAt >= today,
    ).length;

    // Calculate growth rate
    const growthRate =
      lastWeekApplications === 0
        ? 100
        : ((thisWeekApplications - lastWeekApplications) /
            lastWeekApplications) *
          100;

    // Calculate average time in each status
    const statusDurations = applications.reduce(
      (acc: Record<ApplicationStatus, number>, app: Application) => {
        const duration = app.updatedAt.getTime() - app.createdAt.getTime();
        acc[app.status] = (acc[app.status] || 0) + duration;
        return acc;
      },
      {} as Record<ApplicationStatus, number>,
    );

    const averageStatusDurations = Object.entries(statusDurations).reduce(
      (acc: Record<ApplicationStatus, number>, [status, totalDuration]) => {
        const count = statusCounts[status as ApplicationStatus] || 1;
        acc[status as ApplicationStatus] =
          (totalDuration as number) / count / (1000 * 60 * 60 * 24); // Convert to days
        return acc;
      },
      {} as Record<ApplicationStatus, number>,
    );

    // Calculate success rate (FINAL / (FINAL + REJECTED))
    const finalCount = statusCounts["FINAL"] || 0;
    const rejectedCount = statusCounts["REJECTED"] || 0;
    const successRate =
      finalCount + rejectedCount === 0
        ? 0
        : (finalCount / (finalCount + rejectedCount)) * 100;

    // Calculate applications by company
    const companyStats = applications.reduce(
      (acc: Record<string, number>, app: Application) => {
        acc[app.company] = (acc[app.company] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Get top 5 companies by application count
    const topCompanies = Object.entries(companyStats)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([company, count]) => ({ company, count: count as number }));

    return NextResponse.json({
      totalApplications,
      statusCounts,
      activeApplications,
      thisWeekApplications,
      lastWeekApplications,
      todayApplications,
      growthRate,
      averageStatusDurations,
      successRate,
      topCompanies,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
