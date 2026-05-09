import { NextResponse } from "next/server";
import { getEstablishmentNames } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getEstablishmentNames();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Establishment name fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load establishment names.",
        data: [],
      },
      { status: 500 },
    );
  }
}
