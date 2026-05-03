/**
 * app/api/ghp/route.js
 *
 * POST /api/ghp
 * Called by CertCard after the user passes the quiz.
 *
 * Flow:
 *  1. Validate score server-side against Quiz_Config pass threshold
 *  2. Append a row to the Quiz_Attempts sheet so the existing Apps Script
 *     generates the control number and emails the PDF certificate.
 *  3. Return { success, queued, submittedAt } to the client.
 */

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { readSheet, appendRow } from "@/lib/googleSheets";

export async function POST(request) {
  try {
    const { name, email, score } = await request.json();

    if (!name || !email || score === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing name, email or score" },
        { status: 400 },
      );
    }

    // ── 1. Fetch config to validate pass threshold ──
    let passThreshold = 0.7;
    let totalQuestions = 10;

    try {
      const configRows = await readSheet("Quiz_Config");
      configRows.forEach((r) => {
        if (r.key === "pass_threshold") passThreshold = parseFloat(r.value);
        if (r.key === "total_questions") totalQuestions = parseInt(r.value, 10);
      });
    } catch (_) {
      /* use defaults */
    }

    const pct = score / totalQuestions;
    const passed = pct >= passThreshold;

    if (!passed) {
      return NextResponse.json(
        {
          success: false,
          error: `Score too low. Need ${Math.round(passThreshold * 100)}% to pass.`,
        },
        { status: 400 },
      );
    }

    // ── 2. Generate identifiers ──
    const attemptId = uuidv4();
    const now = new Date();
    const submittedAt = now.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const pctStr = `${Math.round(pct * 100)}%`;

    // ── 3. Append to Quiz_Attempts (Apps Script reads this) ──
    //   Columns: attempt_id | timestamp | name | email | score | total_questions | pct | status | cert_number | completed_at
    await appendRow("Quiz_Attempts", [
      attemptId,
      now.toISOString(),
      name,
      email,
      score,
      totalQuestions,
      pctStr,
      "PASSED",
      "",
      now.toISOString(),
    ]);

    return NextResponse.json(
      { success: true, queued: true, submittedAt },
      { status: 201 },
    );
  } catch (error) {
    console.error("GHP POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process certificate",
      },
      { status: 500 },
    );
  }
}
