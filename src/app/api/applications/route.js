/**
 * app/api/applications/route.js
 * Handles MTV application submissions
 */

import { NextResponse } from "next/server";
import { generateRefNumber } from "@/lib/refNumber";
import { saveApplication } from "@/lib/googleSheets";
import {
  createApplicationFolder,
  uploadFileToDrive,
  base64ToBuffer,
} from "@/lib/driveService";
import { sendApplicationConfirmation } from "@/lib/sendMail";

export async function POST(request) {
  try {
    const body = await request.json();

    // Generate reference number
    const refNumber = generateRefNumber();

    // Create folder in Google Drive
    const folderName = `MTV-${refNumber}_${body.firstname}_${body.lastname}`;
    const folderId = await createApplicationFolder(folderName);

    // Upload documents to Drive
    if (body.documents && typeof body.documents === "object") {
      for (const [docId, docData] of Object.entries(body.documents)) {
        const { buffer, mimeType } = base64ToBuffer(docData.base64);
        const fileName = `${refNumber}_${docId}_${docData.name}`;

        await uploadFileToDrive({
          fileName,
          mimeType,
          buffer,
          folderId,
        });
      }
    }

    // Save application to Google Sheets
    const applicationData = {
      refNumber,
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      contact: body.contact,
      address: body.address,
      province: body.province,
      plate: body.plate,
      vtype: body.vtype,
      vmake: body.vmake,
      vmodel: body.vmodel,
      vyear: body.vyear,
      capacity: body.capacity,
      bname: body.bname,
      btype: body.btype,
      baddress: body.baddress,
      driveFolderId: folderId,
    };

    await saveApplication(applicationData);

    // Send confirmation email
    try {
      await sendApplicationConfirmation(body.email, refNumber, body.firstname);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Don't fail the application if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        refNumber,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit application",
      },
      { status: 500 },
    );
  }
}
