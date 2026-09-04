import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

function encodeSubject(subject) {
  return `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`;
}

function makeRawEmail({ to, subject, html }) {
  const message = [
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    html,
  ].join("\r\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendEmail({ to, subject, html, text }) {
  try {
    const raw = makeRawEmail({ to, subject, html: html || text });
    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });
    console.log("Email sent", result.data);
    return result.data;
  } catch (err) {
    console.error("Failed to send email:", err.message);
    return { error: `Could not send email to ${to}: ${err.message}` };
  }
}