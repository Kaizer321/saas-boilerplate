import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ----- Types -----

interface AppointmentConfirmationProps {
    clientEmail: string;
    clientName: string;
    serviceName: string;
    startsAt: string;
    orgName: string;
}

interface AppointmentCancellationProps {
    clientEmail: string;
    clientName: string;
    serviceName: string;
    startsAt: string;
    orgName: string;
}

interface OrgNotificationProps {
    orgEmail: string;
    clientName: string;
    serviceName: string;
    startsAt: string;
    orgName: string;
}

interface TeamInvitationProps {
    email: string;
    inviterName: string;
    orgName: string;
    inviteUrl: string;
    role: string;
}

interface PaymentFailedProps {
    ownerEmail: string;
    orgName: string;
    planName: string;
}

// ----- Email Functions -----

const FROM_EMAIL = 'bookings@yourdomain.com';

export async function sendAppointmentConfirmation({
    clientEmail,
    clientName,
    serviceName,
    startsAt,
    orgName,
}: AppointmentConfirmationProps) {
    const formattedDate = new Date(startsAt).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
    });

    await resend.emails.send({
        from: FROM_EMAIL,
        to: clientEmail,
        subject: `Appointment Confirmed — ${orgName}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Appointment Confirmed ✓</h2>
        <p>Hi ${clientName},</p>
        <p>Your appointment has been confirmed:</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date & Time:</strong> ${formattedDate}</p>
          <p><strong>Organization:</strong> ${orgName}</p>
        </div>
        <p>If you need to make changes, please contact us directly.</p>
        <p>Thank you,<br/>${orgName}</p>
      </div>
    `,
    });
}

export async function sendAppointmentCancellation({
    clientEmail,
    clientName,
    serviceName,
    startsAt,
    orgName,
}: AppointmentCancellationProps) {
    const formattedDate = new Date(startsAt).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
    });

    await resend.emails.send({
        from: FROM_EMAIL,
        to: clientEmail,
        subject: `Appointment Cancelled — ${orgName}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Appointment Cancelled</h2>
        <p>Hi ${clientName},</p>
        <p>Your appointment has been cancelled:</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date & Time:</strong> ${formattedDate}</p>
        </div>
        <p>If this was a mistake, please rebook through our booking page.</p>
        <p>Thank you,<br/>${orgName}</p>
      </div>
    `,
    });
}

export async function sendOrgNewBookingNotification({
    orgEmail,
    clientName,
    serviceName,
    startsAt,
    orgName,
}: OrgNotificationProps) {
    const formattedDate = new Date(startsAt).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
    });

    await resend.emails.send({
        from: FROM_EMAIL,
        to: orgEmail,
        subject: `New Booking — ${clientName}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Booking Received 📅</h2>
        <p>You have a new appointment:</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date & Time:</strong> ${formattedDate}</p>
        </div>
        <p>Log in to your dashboard to manage this appointment.</p>
      </div>
    `,
    });
}

export async function sendTeamInvitation({
    email,
    inviterName,
    orgName,
    inviteUrl,
    role,
}: TeamInvitationProps) {
    await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `You're invited to join ${orgName}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Team Invitation</h2>
        <p>${inviterName} has invited you to join <strong>${orgName}</strong> as a <strong>${role}</strong>.</p>
        <div style="margin: 24px 0;">
          <a href="${inviteUrl}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
      </div>
    `,
    });
}

export async function sendPaymentFailedNotice({
    ownerEmail,
    orgName,
    planName,
}: PaymentFailedProps) {
    await resend.emails.send({
        from: FROM_EMAIL,
        to: ownerEmail,
        subject: `⚠️ Payment Failed — ${orgName}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Failed</h2>
        <p>We were unable to process payment for your <strong>${planName}</strong> plan.</p>
        <p>Please update your payment method to avoid service interruption.</p>
        <div style="margin: 24px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing" style="background: #dc2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Update Payment Method
          </a>
        </div>
      </div>
    `,
    });
}
