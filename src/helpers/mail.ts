import httpStatus from "http-status";
import ApiError from '../errors/ApiError';
import twilio from 'twilio';
import { logger } from "../shared/logger";
import config from "../config";
import sgMail from '@sendgrid/mail';
import puppeteer from "puppeteer";

const accountSid = config.twilio.accountSid;
const authToken = config.twilio.authToken;
const twilioPhoneNumber = config.twilio.phoneNumber;


sgMail.setApiKey(config.sendgrid.apiKey as string);

const client = twilio(accountSid, authToken);

// import { Resend } from 'resend';

// const resend = new Resend('re_ML11Sbgc_Pp91NPMwdRKsATgpB6NGoNAU');

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




// export async function sendResetOtpEmail(to: string, otp: string): Promise<void> {
//   try {
//     await resend.emails.send({
//       from: `Brandable-pr <noreply@app.brandable-pr.com>`,
//       to:[to],
//       subject: 'Your One-Time Password (OTP) for Password Reset',
//       html: `    <div style="max-width: 600px; margin: 0 auto;background-color: #ffffff; box-shadow: 0px 0px 10px 1px #0000001A;border-radius: 12px; padding:12px">
//       <!-- header section -->
//       <div
//         style="background-color: #004a87; border-radius: 8px; padding: 10px 0px"
//       >
//         <img
//           style="display: block; margin: 0 auto; height: 54px;"
//           src="https://media.brandable-pr.com/upload/brandable-pr-mail-logo-otp.png"
//           alt=""
//         />
//         <p style="margin:0;margin-top: 8px;color: white; text-align: center; font-size: 14px">
//           Secure Email Verification
//         </p>
//       </div>
//       <!-- body section -->
//       <div style="margin-top: 12px; padding:20px;">
//         <h3
//           style="
//           margin:0;
//             color: #222425;
//             font-size: 24px;
//             font-weight: 600;
//             line-height: 32px;
//             text-align: center;
//             margin-top: 20px;
//           "
//         >
//           Your Verification OTP
//         </h3>
//         <h2
//           style="
//           margin:0;
//           margin-top: 24px;
//             color: #004a87;
//             font-size: 40px;
//             font-weight: 700;
//             text-align: center;
//             line-height: 130%;
//             margin-top: 24px;
//           "
//         >
//           ${otp}
//         </h2>
//         <p style="margin:0; text-align: center; margin-top: 12px; color:#6A7282;font-size: 12px; font-weight: 400; line-height: 16px;">Enter this code to verify your account</p>
//         <div style="margin-top:24px; background-color: #FFFBEB; border-left: 4px solid #FFB900;padding:16px; padding-left:20px;">
//             <div style="display: flex; align-items: start; gap:12px;">
//               <svg style="height: 15px; fill:#E17100;margin-top: 3px;" xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 640 640">
//                 <path
//                   d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z" />
//               </svg>
//               <div>
//                 <p style="margin:0; color: #973C00; font-size: 14px; font-weight: 600;line-height: 20px;">Time Sensitive</p>
//                 <p style="margin:0;color: #BB4D00; font-size: 14px; font-weight: 400;line-height: 20px;">This code will expire in <b>30 minutes</b>. Please use it soon.</p>
//               </div>
//             </div>
//         </div>
//       </div>
//       <!-- footer section -->
//       <div style="margin-top:12px;padding:20px;background-color: #F6F7F7; border-top:1px solid #DCDEDF;">
//         <p style="margin:0;text-align: center;color:#878C91; font-size: 12px;font-weight: 400; line-height: 16px">&copy; 2026 Brandable-PR All rights reserved.</p>
//         <p style="margin:0;margin-top: 8px; text-align: center; color: #222425; font-size: 16px; font-weight: 500; line-height: 140%;">Austin, Texas</p>
//       </div>
//     </div>`,
//     });
//   } catch (err) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to send OTP email');
//   }
// }

export async function sendNotificationMail(to: string, subject: string, html: string): Promise<void> {
  try {
    const msg = {
      to: to,
      from: 'Brandable-pr <noreply@brandable-pr.com>',
      subject,
      html
    };

    await sgMail.send(msg);
  } catch (err) {
    // Console logging the SendGrid error object is very helpful for debugging
    logger.error('SendGrid Error:', err);

    // Assuming ApiError and httpStatus are imported elsewhere in your file
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to send OTP email');
  }
}

export async function sendResetOtpEmail(to: string, otp: string): Promise<void> {
  try {
    const msg = {
      to: to,
      from: 'Brandable-pr <noreply@brandable-pr.com>',
      subject: 'Your One-Time Password (OTP) for Password Reset',
      html: `     <div style="max-width: 600px; margin: 0 auto;background-color: #ffffff; box-shadow: 0px 0px 10px 1px #0000001A;border-radius: 12px; padding:12px;box-shadow: 0px 0px 10px #0000001A; margin-top: 10px;">
      <!-- header section -->
      <div
        style="background-color: #004a87; border-radius: 8px; padding: 10px 0px"
      >
        <img
          style="display: block; margin: 0 auto; height: 54px;"
          src="https://media.brandable-pr.com/upload/brandable-pr-mail-logo-otp.png"
          alt=""
        />
        <p style="margin:0;margin-top: 8px;color: white; text-align: center; font-size: 14px">
          Secure Email Verification
        </p>
      </div>
      <!-- body section -->
      <div style="margin-top: 12px; padding:20px;">
        <h3
          style="
          margin:0;
            color: #222425;
            font-size: 24px;
            font-weight: 600;
            line-height: 32px;
            text-align: center;
            margin-top: 20px;
          "
        >
          Your Verification OTP
        </h3>
        <h2
          style="
          margin:0;
          margin-top: 24px;
            color: #004a87;
            font-size: 40px;
            font-weight: 700;
            text-align: center;
            line-height: 130%;
            margin-top: 24px;
          "
        >
          ${otp}
        </h2>
        <p style="margin:0; text-align: center; margin-top: 12px; color:#6A7282;font-size: 12px; font-weight: 400; line-height: 16px;">Enter this code to verify your account</p>
        <div style="margin-top:24px; background-color: #FFFBEB; border-left: 4px solid #FFB900;padding:16px; padding-left:20px;">
            <div style="display: flex; align-items: start; gap:12px;">
              <svg style="height: 15px; fill:#E17100;margin-top: 3px;" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640">
                <path
                  d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z" />
              </svg>
              <div>
                <p style="margin:0; color: #973C00; font-size: 14px; font-weight: 600;line-height: 20px;">Time Sensitive</p>
                <p style="margin:0;color: #BB4D00; font-size: 14px; font-weight: 400;line-height: 20px;">This code will expire in <b>30 minutes</b>. Please use it soon.</p>
              </div>
            </div>
        </div>
      </div>
      <!-- footer section -->
      <div style="margin-top:12px;padding:20px;background-color: #F6F7F7; border-top:1px solid #DCDEDF;">
        <p style="margin:0;text-align: center;color:#878C91; font-size: 12px;font-weight: 400; line-height: 16px">&copy; 2026 Brandable-PR All rights reserved.</p>
        <p style="margin:0;margin-top: 8px; text-align: center; color: #222425; font-size: 16px; font-weight: 500; line-height: 140%;">Austin, Texas</p>
      </div>
    </div>`,
    };

    await sgMail.send(msg);
  } catch (err) {
    // Console logging the SendGrid error object is very helpful for debugging
    console.error('SendGrid Error:', err);

    // Assuming ApiError and httpStatus are imported elsewhere in your file
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to send OTP email');
  }
}

export async function sendOrderMail(to: string, order: any, user: any): Promise<void> {
  if (!to || !to.includes('@')) {
    console.error("Error: 'to' email address is invalid:", to);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid recipient email');
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const totalAmount = order.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);

  const tableRows = order?.map((item: any) => {
    const quantity = 1;
    const price = item.publication?.price ? item.publication.price.toFixed(2) : '0.00';
    const amount = item.amount ? item.amount.toFixed(2) : '0.00';
    const title = item.publication?.title || 'N/A';

    return `
    <tr>
      <td style="padding:12px;font-size: 14px;font-weight: 500;color:#36383A;border:1px solid #DCDEDF;border-collapse: collapse;">${title}</td>
      <td style="padding:12px;font-size: 14px;font-weight: 500;color:#36383A;border:1px solid #DCDEDF;border-collapse: collapse;">${quantity}</td>
      <td style="padding:12px;font-size: 14px;font-weight: 500;color:#36383A;border:1px solid #DCDEDF;border-collapse: collapse;">$${price}</td>
      <td style="padding:12px;font-size: 14px;font-weight: 500;color:#36383A;border:1px solid #DCDEDF;border-collapse: collapse;">$${amount}</td>
    </tr>`;
  }).join('');

  const mailTemplate = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border: 1px solid #e0e0e0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
            <tr>
              <td valign="top" style="width: 60%;">
                <img src="https://media.brandable-pr.com/upload/brandable-pr-mail-logo.png" alt="Brandable PR" style="height: 54px; display: block;" />
                <p style="margin: 0; margin-top: 20px; color: #222425; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 500; line-height: 140%;">Austin, Texas</p>
                <p style="margin: 0; margin-top: 8px; color: #222425; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; line-height: 140%;">&#9742; (512) 698-7373</p>
                <p style="margin: 0; margin-top: 8px; color: #222425; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; line-height: 140%;">&#9993; hello@brandable-pr.com</p>
              </td>
              <td valign="top" style="text-align: right;">
                <h3 style="margin: 0; text-transform: uppercase; color: #222425; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; line-height: 140%;">Invoice</h3>
                <p style="margin: 0; margin-top: 4px; color: #5F6368; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 500; line-height: 20px;">Date: ${formattedDate}</p>
              </td>
            </tr>
          </table>
         
          <div style="border-top: 1px solid #B2B5B8; padding-top: 24px;"></div>
         
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <p style="margin: 0; text-transform: uppercase; color: #004A87; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; line-height: 20px;">Bill to:</p>
                <p style="margin: 0; margin-top: 12px; color: #0A0A0A; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; line-height: 20px;">${user?.name || 'Customer'}</p>
                <p style="margin: 0; margin-top: 8px; color: #4A5565; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; line-height: 20px;">${user?.email || ''}</p>
                <p style="margin: 0; margin-top: 4px; color: #4A5565; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; line-height: 20px;">${user?.phoneNumber || ''}</p>
              </td>
            </tr>
          </table>
         
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #F2F2F3;">
                <th style="padding: 8px 12px; color: #36383A; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; border: 1px solid #DCDEDF; text-align: left;">Publication</th>
                <th style="padding: 8px 12px; color: #36383A; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; border: 1px solid #DCDEDF; text-align: center;">QTY</th>
                <th style="padding: 8px 12px; color: #36383A; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; border: 1px solid #DCDEDF; text-align: right;">UNIT PRICE</th>
                <th style="padding: 8px 12px; color: #36383A; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; border: 1px solid #DCDEDF; text-align: right;">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
         
          <table width="40%" cellpadding="0" cellspacing="0" border="0" align="right" style="margin-top: 28px;">
            <tr>
              <td style="padding: 8px 0; color: #364153; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; line-height: 20px; border-bottom: 1px solid #E5E7EB;">Subtotal:</td>
              <td style="padding: 8px 0; color: #36383A; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; line-height: 20px; border-bottom: 1px solid #E5E7EB; text-align: right;">$${totalAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #222425; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; line-height: 28px;">Total:</td>
              <td style="padding: 12px 0; color: #222425; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; line-height: 28px; text-align: right;">$${totalAmount.toFixed(2)}</td>
            </tr>
          </table>
         
          <div style="clear: both;"></div>
         
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 60px;">
            <tr>
              <td style="padding: 20px; text-align: center;">
                <p style="margin: 0; color: #004A87; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 600; line-height: 28px;">Thank you for your business!</p>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>`;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(mailTemplate, { waitUntil: 'load' });

    await page.waitForNetworkIdle({ idleTime: 500 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    await browser.close();

    const msg = {
      to: to,
      from: 'Brandable-pr <noreply@brandable-pr.com>', 
      subject: 'Order Confirmation Invoice',
      html: mailTemplate,
      attachments: [
        {
          content: Buffer.from(pdfBuffer).toString('base64'),
          filename: `Invoice_${formattedDate}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    await sgMail.send(msg);
  } catch (err: any) {

    if (err.response && err.response.body) {
      console.error('SendGrid Detailed Error:', JSON.stringify(err.response.body, null, 2));
    } else {
      console.error('SendGrid Error:', err);
    }

    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to send invoice email');
  }
}

// mobile sms
export async function sendResetOtpSms(to: string, otp: string): Promise<void> {
  try {
    const messageBody = `Brandable PR: Your password reset OTP is ${otp}. This code is valid for 30 minutes. Do not share it.`;

    const message = await client.messages.create({
      body: messageBody,
      from: twilioPhoneNumber,
      to: to,
    });

    console.log('OTP SMS sent successfully. Message SID:', message.sid);
  } catch (err) {
    logger.error('Twilio Error:', err);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to send OTP SMS');
  }
}