import { NextResponse } from "next/server";
import {
  DASHBOARD_SESSION_COOKIE,
  createDashboardSession,
  credentialsAreConfigured,
  validateDashboardCredentials,
} from "@/lib/dashboardAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  try {
    if (!credentialsAreConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Dashboard login is not configured. Add DASHBOARD_USERNAME and DASHBOARD_PASSWORD to .env.",
        },
        { status: 500 },
      );
    }

    const body = await request.json();
    const username = String(body.username || "");
    const password = String(body.password || "");

    if (!validateDashboardCredentials(username, password)) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const session = createDashboardSession(username);
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: DASHBOARD_SESSION_COOKIE,
      value: session.value,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(session.expiresAt),
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unable to sign in.",
      },
      { status: 500 },
    );
  }
}
