import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

// Send notification to admin
export async function sendAdminNotification(subject: string, html: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured, skipping notification");
    return { success: false, error: "ADMIN_EMAIL not configured" };
  }

  return sendEmail({
    to: adminEmail,
    subject: `[HotelX] ${subject}`,
    html,
  });
}

// Email templates
export const emailTemplates = {
  newRequest: (hotelName: string, roomNumber: string, service: string) => ({
    subject: `New Request from Room ${roomNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .badge { display: inline-block; background: #3b82f6; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Guest Request</h1>
            </div>
            <div class="content">
              <div class="info">
                <h2 style="margin-top: 0;">📍 ${hotelName}</h2>
                <p><strong>Room:</strong> <span class="badge">${roomNumber}</span></p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p>A new request has been received. Please check your dashboard to manage it.</p>
              <a href="${process.env.NEXTAUTH_URL}/dashboard/requests" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Dashboard</a>
            </div>
            <div class="footer">
              <p>This is an automated notification from HotelX</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  newComplaint: (
    hotelName: string,
    roomNumber: string,
    type: string,
    description: string,
    priority: string
  ) => ({
    subject: `⚠️ New Complaint - ${priority} Priority`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fef2f2; padding: 30px; border-radius: 0 0 10px 10px; }
            .badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .badge-urgent { background: #dc2626; color: white; }
            .badge-high { background: #f59e0b; color: white; }
            .badge-medium { background: #3b82f6; color: white; }
            .badge-low { background: #6b7280; color: white; }
            .info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ New Guest Complaint</h1>
            </div>
            <div class="content">
              <div class="info">
                <h2 style="margin-top: 0;">📍 ${hotelName}</h2>
                <p><strong>Room:</strong> ${roomNumber}</p>
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Priority:</strong> <span class="badge badge-${priority.toLowerCase()}">${priority}</span></p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px;">
                  <strong>Description:</strong>
                  <p style="margin: 10px 0 0 0;">${description}</p>
                </div>
              </div>
              <p style="color: #dc2626; font-weight: bold;">⚡ Immediate attention required</p>
              <a href="${process.env.NEXTAUTH_URL}/dashboard/complaints" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Complaints</a>
            </div>
            <div class="footer">
              <p>This is an automated notification from HotelX</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  newReview: (
    hotelName: string,
    roomNumber: string,
    rating: number,
    category: string,
    comment?: string
  ) => ({
    subject: `${rating === 5 ? "⭐" : rating >= 4 ? "✨" : "📝"} New Guest Review - ${rating}/5 Stars`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 10px 10px; }
            .stars { font-size: 32px; margin: 10px 0; }
            .info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${rating === 5 ? "🌟" : "✨"} New Guest Review</h1>
            </div>
            <div class="content">
              <div class="info">
                <h2 style="margin-top: 0;">📍 ${hotelName}</h2>
                <p><strong>Room:</strong> ${roomNumber}</p>
                <p><strong>Category:</strong> ${category}</p>
                <div class="stars">${"⭐".repeat(rating)}${"☆".repeat(5 - rating)}</div>
                <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${rating}/5 Stars</p>
                ${
                  comment
                    ? `
                <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px;">
                  <strong>Comment:</strong>
                  <p style="margin: 10px 0 0 0; font-style: italic;">"${comment}"</p>
                </div>
                `
                    : ""
                }
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              </div>
              ${
                rating >= 4
                  ? '<p style="color: #059669; font-weight: bold;">🎉 Great feedback from your guest!</p>'
                  : '<p style="color: #f59e0b; font-weight: bold;">⚠️ Consider following up on this feedback</p>'
              }
              <a href="${process.env.NEXTAUTH_URL}/dashboard/reviews" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View All Reviews</a>
            </div>
            <div class="footer">
              <p>This is an automated notification from HotelX</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  requestStatusUpdate: (
    guestEmail: string,
    hotelName: string,
    service: string,
    status: string
  ) => ({
    subject: `Your ${hotelName} Request - ${status}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .status { display: inline-block; background: #10b981; color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; margin: 15px 0; }
            .info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📱 Order Update</h1>
            </div>
            <div class="content">
              <div class="info">
                <h2 style="margin-top: 0;">${hotelName}</h2>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Status:</strong> <span class="status">${status}</span></p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              </div>
              ${
                status === "COMPLETED"
                  ? '<p>✅ Your request has been completed. We hope you enjoyed our service!</p>'
                  : status === "IN_PROGRESS"
                    ? '<p>⏳ Your request is being prepared and will be delivered soon.</p>'
                    : '<p>📋 Your request has been received and will be processed shortly.</p>'
              }
            </div>
            <div class="footer">
              <p>Thank you for staying with us!</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};


