# 📧 Email Configuration Guide

## Gmail SMTP Setup

To enable email notifications in HotelX, you need to configure Gmail SMTP. Follow these steps:

### Step 1: Create Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Click **Select app** → choose **Mail**
5. Click **Select device** → choose **Other** → enter "HotelX"
6. Click **Generate**
7. Copy the 16-character password (you'll need this for `.env`)

### Step 2: Configure Environment Variables

Add these variables to your `.env` file:

```env
# Email (Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-gmail@gmail.com"          # Your Gmail address
SMTP_PASSWORD="xxxx xxxx xxxx xxxx"       # The 16-character app password from Step 1
SMTP_FROM="your-gmail@gmail.com"          # Same as SMTP_USER
ADMIN_EMAIL="info@hotelx.app"             # Admin email for receiving notifications
```

### Step 3: Restart Development Server

After updating `.env`, restart your development server:

```bash
npm run dev
```

## 📬 Email Notifications

The system automatically sends emails for:

### 1. **New Guest Request** 🔔
- **Recipient:** Admin (`ADMIN_EMAIL`)
- **Trigger:** When a guest creates a new service request
- **Contains:** Hotel name, room number, service name, timestamp
- **Action Button:** Link to dashboard

### 2. **New Complaint** ⚠️
- **Recipient:** Admin (`ADMIN_EMAIL`)
- **Trigger:** When a guest reports an issue
- **Contains:** Hotel name, room number, complaint type, priority, description
- **Priority Colors:**
  - 🔴 URGENT - Red
  - 🟠 HIGH - Orange
  - 🔵 MEDIUM - Blue
  - ⚫ LOW - Gray

### 3. **New Review** ⭐
- **Recipient:** Admin (`ADMIN_EMAIL`)
- **Trigger:** When a guest rates a completed service
- **Contains:** Hotel name, room number, rating (1-5 stars), category, comment
- **Displays:** Star rating visually

### 4. **Request Status Update** 📱
- **Recipient:** Guest (if they provided an email during registration)
- **Trigger:** When staff updates request status (NEW → IN_PROGRESS → COMPLETED)
- **Contains:** Hotel name, service name, new status, timestamp

## 🎨 Email Templates

All emails are professionally designed with:
- **Beautiful gradients** for headers
- **Color-coded** content based on type/priority
- **Responsive** design for mobile and desktop
- **Clear call-to-action** buttons
- **Branding** with HotelX identity

## 🔧 Troubleshooting

### Emails not sending?

1. **Check SMTP credentials:** Verify `SMTP_USER` and `SMTP_PASSWORD` in `.env`
2. **Enable 2-Step Verification:** Required for App Passwords
3. **Check console logs:** Look for error messages in terminal
4. **Test connection:**
   ```bash
   # In your terminal
   node -e "require('./src/lib/email').sendEmail({to: 'test@example.com', subject: 'Test', html: '<h1>Test</h1>'})"
   ```

### Gmail blocking emails?

- Make sure you're using an **App Password**, not your regular Gmail password
- Check Gmail's "Less secure app access" settings (not recommended)
- Verify your account doesn't have suspicious activity flags

### Not receiving admin emails?

- Verify `ADMIN_EMAIL` in `.env` is correct
- Check spam folder
- Ensure the email address is valid

## 📝 Custom Email Templates

Email templates are defined in `/src/lib/email.ts`. You can customize:

- **Colors** and **styling**
- **Email content** and **structure**
- **Call-to-action** buttons
- **Branding** elements

## 🚀 Production Deployment

For production, consider using:

- **SendGrid** (more reliable, better deliverability)
- **Mailgun** (transactional emails)
- **Amazon SES** (cost-effective, scalable)
- **Postmark** (fast delivery)

Update `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASSWORD` accordingly.

---

**Need help?** Contact: info@hotelx.app

