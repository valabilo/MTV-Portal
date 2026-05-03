/**
 * app/api/contact/route.js
 * Handles contact form submissions
 */

import { NextResponse } from "next/server";
import { saveContactMessage } from "@/lib/googleSheets";
import { sendContactReply } from "@/lib/sendMail";

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Save to Google Sheets
    const contactData = {
      name,
      email,
      phone: phone || "",
      subject,
      message,
    };

    await saveContactMessage(contactData);

    // Send confirmation email
    try {
      await sendContactReply(email, subject, message);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message received. We will respond shortly.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit message",
      },
      { status: 500 },
    );
  }
}
