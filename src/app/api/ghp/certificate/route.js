/**
 * app/api/ghp/certificate/route.js
 * Retrieves GHP certificate information
 */

import { NextResponse } from "next/server";
import { getAccreditedList } from "@/lib/googleSheets";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const certNumber = searchParams.get("certNumber");
    const email = searchParams.get("email");

    if (!certNumber && !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Either certNumber or email parameter is required",
        },
        { status: 400 },
      );
    }

    // Get accredited list
    const accreditedList = await getAccreditedList();

    // Search for certificate
    let certificate = null;

    if (certNumber) {
      certificate = accreditedList.find(
        (item) => item.cert_number === certNumber,
      );
    } else if (email) {
      certificate = accreditedList.find(
        (item) => item.email?.toLowerCase() === email.toLowerCase(),
      );
    }

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          error: "Certificate not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        certificate,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Certificate fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch certificate",
      },
      { status: 500 },
    );
  }
}
