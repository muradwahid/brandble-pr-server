import httpStatus from "http-status";
import ApiError from '../errors/ApiError';

// const transporter = nodemailer.createTransport({
//   service: 'gmail',           // or use Resend, SendGrid, Brevo etc.
//   auth: {
//     user: config.mailer.email,
//     pass: config.mailer.password,   // App password if Gmail
//   },
// });

// export interface ResetOtpMailOptions {
//   from: string;
//   to: string;
//   subject: string;
//   html: string;
// }

// export async function sendResetOtpEmail(to: string, otp: string): Promise<void> {
//   console.log({to,otp});
//   const mailOptions: ResetOtpMailOptions = {
//     from: `"Brandable-pr" <${config.mailer.email}>`,
//     to,
//     subject: 'Your One-Time Password (OTP) for Password Reset',
//     html: `
//       <div style="font-family: sans-serif; font-size: 16px; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #1a1a1a; margin-bottom: 24px;">Password Reset Request</h2>

//         <p>Hello,</p>

//         <p>You requested to reset your password. Use the following one-time code to proceed:</p>

//         <h1 style="letter-spacing: 12px; color: #2563eb; font-size: 36px; margin: 32px 0; text-align: center; font-weight: bold;">
//           ${otp}
//         </h1>
        
//         <p style="text-align: center;">
//           This code is valid for <strong>10 minutes</strong> and should not be shared with anyone.
//         </p>
        
//         <p>If you did not request a password reset, please ignore this email or contact support if you have concerns about your account security.</p>
        
//         <br/>
        
//         <p style="font-size: 14px; color: #666;">
//           Thank you,<br/>
//           Brandable-pr Team
//         </p>
        
//         <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        
//         <p style="font-size: 12px; color: #888; text-align: center;">
//           This is an automated message. Please do not reply directly to this email.
//         </p>
//       </div>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//   } catch (err: unknown) {
//     throw new ApiError(httpStatus.BAD_REQUEST,'Failed to send OTP email');
//   }
// }


import { Resend } from 'resend';

const resend = new Resend('re_ML11Sbgc_Pp91NPMwdRKsATgpB6NGoNAU');

export async function sendResetOtpEmail(to: string, otp: string): Promise<void> {
  try {
    await resend.emails.send({
      from: `Brandable-pr <noreply@app.brandable-pr.com>`,
      to:[to],
      subject: 'Your One-Time Password (OTP) for Password Reset',
      html: `<div style="font-family: sans-serif; font-size: 16px; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a; margin-bottom: 24px;">Password Reset Request</h2>

        <p>Hello,</p>

        <p>You requested to reset your password. Use the following one-time code to proceed:</p>

        <h1 style="letter-spacing: 12px; color: #2563eb; font-size: 36px; margin: 32px 0; text-align: center; font-weight: bold;">
          ${otp}
        </h1>
        
        <p style="text-align: center;">
          This code is valid for <strong>10 minutes</strong> and should not be shared with anyone.
        </p>
        
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns about your account security.</p>
        
        <br/>
        
        <p style="font-size: 14px; color: #666;">
          Thank you,<br/>
          Brandable-pr Team
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        
        <p style="font-size: 12px; color: #888; text-align: center;">
          This is an automated message. Please do not reply directly to this email.
        </p>
      </div>`,
    });
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to send OTP email');
  }
}