/**
 * app/api/drive/upload-chunk/route.js
 *
 * POST /api/drive/upload-chunk
 *
 * Proxies a single file CHUNK to Google Drive's resumable upload session.
 * Each chunk is ≤ 4 MB, so it stays under Vercel's 4.5 MB body limit.
 *
 * Flow:
 *   1. Client calls POST /api/drive/init-upload  → gets { uploadUrl }
 *   2. Client slices file into chunks (≤ 4 MB each)
 *   3. For each chunk, client calls POST /api/drive/upload-chunk
 *      with the chunk bytes + range metadata
 *   4. On last chunk, Google returns { id } (the file ID)
 *
 * Body (multipart/form-data):
 *   - uploadUrl   : string  — the resumable upload URL from step 1
 *   - chunk       : Blob    — the raw bytes of this chunk
 *   - rangeStart  : number  — byte offset where this chunk starts
 *   - rangeEnd    : number  — byte offset where this chunk ends (inclusive)
 *   - totalSize   : number  — total file size in bytes
 *   - isLast      : "true" | "false"
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Allow up to 4.5 MB (Vercel's hard limit is 4.5 MB for serverless)

export async function POST(request) {
  try {
    const form = await request.formData();

    const uploadUrl = form.get("uploadUrl");
    const chunk = form.get("chunk"); // Blob / File
    const rangeStart = Number(form.get("rangeStart"));
    const rangeEnd = Number(form.get("rangeEnd"));
    const totalSize = Number(form.get("totalSize"));
    const isLast = form.get("isLast") === "true";

    if (
      !uploadUrl ||
      !chunk ||
      isNaN(rangeStart) ||
      isNaN(rangeEnd) ||
      isNaN(totalSize)
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Read the chunk into a Buffer for forwarding
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer());

    // Content-Range header: bytes 0-4194303/8388608
    const contentRange = `bytes ${rangeStart}-${rangeEnd}/${totalSize}`;

    const driveRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Range": contentRange,
        "Content-Type": chunk.type || "application/octet-stream",
        "Content-Length": String(chunkBuffer.length),
      },
      body: chunkBuffer,
      // duplex required for streaming body in newer Node fetch
      duplex: "half",
    });

    // Google returns 308 (Resume Incomplete) for intermediate chunks
    // and 200/201 for the final chunk
    if (driveRes.status === 308) {
      // Intermediate chunk accepted, more to come
      const rangeHeader = driveRes.headers.get("Range") || "";
      return NextResponse.json({
        success: true,
        done: false,
        range: rangeHeader,
      });
    }

    if (driveRes.status === 200 || driveRes.status === 201) {
      // Final chunk — Google returns file metadata
      const fileData = await driveRes.json();
      return NextResponse.json({
        success: true,
        done: true,
        fileId: fileData.id,
        file: fileData,
      });
    }

    // Unexpected status
    const errorText = await driveRes.text();
    console.error(`Drive chunk upload error ${driveRes.status}:`, errorText);
    return NextResponse.json(
      {
        success: false,
        error: `Drive returned ${driveRes.status}: ${errorText}`,
      },
      { status: 500 },
    );
  } catch (error) {
    console.error("Chunk upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Chunk upload failed" },
      { status: 500 },
    );
  }
}
