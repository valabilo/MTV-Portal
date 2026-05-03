/**
 * lib/sendMail.js
 * Email notifications via Nodemailer
 */

import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      "Missing EMAIL_USER or EMAIL_PASS in environment variables.",
    );
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return transporter;
}

export async function sendApplicationConfirmation(
  email,
  refNumber,
  applicantName,
) {
  const transport = getTransporter();

  return transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `MTV Application Confirmation - ${refNumber}`,
    html: `
      <h2>Application Submitted Successfully</h2>
      <p>Dear ${applicantName},</p>
      <p>Your MTV application has been submitted successfully.</p>
      <p><strong>Reference Number:</strong> ${refNumber}</p>
      <p>You can use this reference number to track your application status.</p>
      <p>We will review your application and contact you soon.</p>
      <br />
      <p>Best regards,<br />MTV Portal Team</p>
    `,
  });
}

export async function sendGHPCompletion(email, name, certNumber, score) {
  const transport = getTransporter();

  return transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `GHP Certificate - ${certNumber}`,
    html: `
      <h2>GHP Orientation Complete</h2>
      <p>Dear ${name},</p>
      <p>Congratulations! You have completed the GHP orientation.</p>
      <p><strong>Certificate Number:</strong> ${certNumber}</p>
      <p><strong>Score:</strong> ${score}%</p>
      <p>You can now proceed with your MTV application.</p>
      <br />
      <p>Best regards,<br />MTV Portal Team</p>
    `,
  });
}

export async function sendVerificationResult(email, name, plate, status) {
  const transport = getTransporter();

  return transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Vehicle Verification Result - ${plate}`,
    html: `
      <h2>Vehicle Verification Result</h2>
      <p>Dear ${name},</p>
      <p>Your vehicle verification has been processed.</p>
      <p><strong>Plate Number:</strong> ${plate}</p>
      <p><strong>Status:</strong> <strong style="color: ${status === "Verified" ? "green" : "red"}">${status}</strong></p>
      <p>If you have any questions, please contact our support team.</p>
      <br />
      <p>Best regards,<br />MTV Portal Team</p>
    `,
  });
}

export async function sendContactReply(email, subject, message) {
  const transport = getTransporter();

  return transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Re: ${subject}`,
    html: `
      <p>Thank you for contacting MTV Portal.</p>
      <p>We have received your message and will respond shortly.</p>
      <p><strong>Your Message:</strong></p>
      <p>${message}</p>
      <br />
      <p>Best regards,<br />MTV Portal Team</p>
    `,
  });
}
