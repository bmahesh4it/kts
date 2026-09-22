const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");

const smtpUser = defineSecret("SMTP_USER");
const smtpPass = defineSecret("SMTP_PASS");
const NOTIFY_TO = "techsupportkw@gmail.com";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

exports.notifyEnquiry = onDocumentCreated(
  {
    document: "enquiries/{enquiryId}",
    secrets: [smtpUser, smtpPass],
    region: "us-central1",
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) {
      logger.warn("Enquiry created with no data");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: smtpUser.value(),
        pass: smtpPass.value(),
      },
    });

    const subject = `New enquiry from ${data.name || "website"} — ${data.company || "Kuwait Tech Support"}`;
    const text = [
      "A new enquiry was submitted on Kuwait Tech Support.",
      "",
      `Name: ${data.name || "—"}`,
      `Company: ${data.company || "—"}`,
      `Email: ${data.email || "—"}`,
      `Language: ${data.language || "—"}`,
      "",
      data.message || "",
    ].join("\n");

    const html = `
      <p>A new enquiry was submitted on Kuwait Tech Support.</p>
      <p>
        <strong>Name:</strong> ${escapeHtml(data.name)}<br>
        <strong>Company:</strong> ${escapeHtml(data.company)}<br>
        <strong>Email:</strong> ${escapeHtml(data.email)}<br>
        <strong>Language:</strong> ${escapeHtml(data.language)}
      </p>
      <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
    `;

    await transporter.sendMail({
      from: `"Kuwait Tech Support" <${smtpUser.value()}>`,
      to: NOTIFY_TO,
      replyTo: data.email || NOTIFY_TO,
      subject,
      text,
      html,
    });

    logger.info("Enquiry notification email sent", { enquiryId: event.params.enquiryId });
  }
);
