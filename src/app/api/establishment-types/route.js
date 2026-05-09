import { NextResponse } from "next/server";
import { getEstablishmentTypes } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getEstablishmentTypes();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Establishment type fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load establishment types.",
        data: [],
      },
      { status: 500 },
    );
  }
}
