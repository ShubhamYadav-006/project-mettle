const { Resend } = require('resend');

// Initialize Resend with API key from environment
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
};

/**
 * Generates the clean, Mettle-branded responsive HTML template
 */
const generateWelcomeEmailHtml = (name) => {
  const safeName = name ? name.trim() : 'Player';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Mettle — Your Journey Starts Here</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0D0D0D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F5F5F5; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0D0D0D; width: 100%; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #141414; border: 1px solid #2A2A2A; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);">
          
          <!-- Header Bar with Electric Lime Accent -->
          <tr>
            <td style="background-color: #1A1A1A; border-bottom: 2px solid #B5E34A; padding: 24px 32px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: 'Space Grotesk', -apple-system, sans-serif; font-size: 20px; font-weight: 900; letter-spacing: 2px; color: #F5F5F5; text-transform: uppercase;">
                      METTLE
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #111111; background-color: #B5E34A; padding: 4px 8px; border-radius: 2px; letter-spacing: 1px; text-transform: uppercase;">
                      Level 1
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #F5F5F5; letter-spacing: -0.5px;">
                Welcome to Mettle, <span style="color: #B5E34A;">${safeName}</span>.
              </h1>
              
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #D1D1D1;">
                Your journey starts here.
              </p>

              <!-- Mission Steps Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1A1A1A; border: 1px solid #2E2E2E; border-left: 3px solid #B5E34A; border-radius: 4px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #B5E34A; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">
                      THE PATH OF PROGRESSION
                    </p>
                    <ul style="margin: 0; padding-left: 18px; color: #E5E5E5; font-size: 13px; line-height: 1.8;">
                      <li>Turn your everyday actions into quests.</li>
                      <li>Complete them.</li>
                      <li>Earn XP &amp; Gold.</li>
                      <li>Build your character attributes.</li>
                      <li>Level up.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 28px 0; font-size: 14px; font-style: italic; color: #8A8A8A; font-family: Georgia, serif;">
                &ldquo;Build yourself. Level by level.&rdquo;
              </p>

              <!-- CTA Button -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" style="background-color: #B5E34A; border-radius: 3px;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 12px; font-weight: 800; font-family: -apple-system, sans-serif; letter-spacing: 1.5px; text-transform: uppercase; color: #111111; text-decoration: none;">
                      Enter Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #A6A6A6; font-weight: 500;">
                &mdash; Team Mettle
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0F0F0F; border-top: 1px solid #222222; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #5F5F5F; font-family: monospace; letter-spacing: 0.5px;">
                METTLE PROGRESSION SYSTEM &bull; &copy; 2026
              </p>
              <p style="margin: 0; font-size: 11px; color: #4A4A4A;">
                You received this email because an account was registered with this address.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Plain text fallback version of the welcome email
 */
const generateWelcomeEmailText = (name) => {
  const safeName = name ? name.trim() : 'Player';
  return `
METTLE

Welcome to Mettle, ${safeName}.

Your journey starts here.

Turn your everyday actions into quests.
Complete them.
Earn XP.
Build your character.
Level up.

Build yourself. Level by level.

— Team Mettle

Enter your dashboard: ${process.env.CLIENT_URL || 'http://localhost:5173'}
  `.trim();
};

/**
 * Generates the clean, Mettle-branded responsive HTML template for Level Up
 */
const generateLevelUpEmailHtml = ({ name, oldLevel, newLevel }) => {
  const safeName = name ? name.trim() : 'Adventurer';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You Leveled Up! — Mettle Level ${newLevel}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0D0D0D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F5F5F5; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0D0D0D; width: 100%; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #141414; border: 1px solid #2A2A2A; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);">
          
          <!-- Header Bar with Electric Lime Accent -->
          <tr>
            <td style="background-color: #1A1A1A; border-bottom: 2px solid #B5E34A; padding: 24px 32px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: 'Space Grotesk', -apple-system, sans-serif; font-size: 20px; font-weight: 900; letter-spacing: 2px; color: #F5F5F5; text-transform: uppercase;">
                      METTLE
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #111111; background-color: #B5E34A; padding: 4px 8px; border-radius: 2px; letter-spacing: 1px; text-transform: uppercase;">
                      LEVEL ${newLevel}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <div style="display: inline-block; margin-bottom: 12px; font-family: monospace; font-size: 12px; font-weight: 800; color: #B5E34A; text-transform: uppercase; letter-spacing: 1.5px;">
                &#9733; LEVEL UP! &#9733;
              </div>

              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 800; color: #F5F5F5; letter-spacing: -0.5px;">
                Congratulations, <span style="color: #B5E34A;">${safeName}</span>.
              </h1>
              
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #F5F5F5; font-weight: 600;">
                You've reached <span style="color: #B5E34A;">Level ${newLevel}</span>.
              </p>

              <!-- Level Transition Badge Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1A1A1A; border: 1px solid #2E2E2E; border-left: 3px solid #B5E34A; border-radius: 4px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="color: #8A8A8A; font-size: 13px; font-family: monospace; font-weight: 600;">
                          Previous: <span style="color: #CCCCCC;">Level ${oldLevel}</span>
                        </td>
                        <td align="center" style="color: #B5E34A; font-size: 16px; font-weight: 900;">
                          &rarr;
                        </td>
                        <td align="right" style="color: #B5E34A; font-size: 13px; font-family: monospace; font-weight: 800;">
                          Current: Level ${newLevel}
                        </td>
                      </tr>
                    </table>
                    
                    <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #282828;">
                      <p style="margin: 0; color: #D1D1D1; font-size: 13px; line-height: 1.6;">
                        Keep completing quests.<br>
                        Keep building your attributes.<br>
                        Keep moving forward.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 28px 0; font-size: 14px; font-style: italic; color: #8A8A8A; font-family: Georgia, serif;">
                &ldquo;Build yourself. Level by level.&rdquo;
              </p>

              <!-- CTA Button -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" style="background-color: #B5E34A; border-radius: 3px;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 12px; font-weight: 800; font-family: -apple-system, sans-serif; letter-spacing: 1.5px; text-transform: uppercase; color: #111111; text-decoration: none;">
                      View Updated Character &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #A6A6A6; font-weight: 500;">
                &mdash; Team Mettle
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0F0F0F; border-top: 1px solid #222222; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #5F5F5F; font-family: monospace; letter-spacing: 0.5px;">
                METTLE PROGRESSION SYSTEM &bull; &copy; 2026
              </p>
              <p style="margin: 0; font-size: 11px; color: #4A4A4A;">
                You received this email because your Mettle character achieved a milestone.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Plain text fallback version of the Level Up email
 */
const generateLevelUpEmailText = ({ name, oldLevel, newLevel }) => {
  const safeName = name ? name.trim() : 'Adventurer';
  return `
METTLE

LEVEL UP!

Congratulations, ${safeName}.

You've reached Level ${newLevel}.

You were Level ${oldLevel}.
Now you're Level ${newLevel}.

Keep completing quests.
Keep building your attributes.
Keep moving forward.

Build yourself. Level by level.

— Team Mettle

View your dashboard: ${process.env.CLIENT_URL || 'http://localhost:5173'}
  `.trim();
};

/**
 * Send a welcome email to a newly registered user using Resend.
 * 
 * Guarantees:
 * - Never throws an unhandled exception that breaks user signup.
 * - Never logs or exposes API keys or sensitive credentials.
 * - Safely logs errors for backend debugging.
 * 
 * @param {Object} params
 * @param {string} params.email - Recipient email address
 * @param {string} params.name - User's full name or display name
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
const sendWelcomeEmail = async ({ email, name }) => {
  try {
    if (!email || typeof email !== 'string') {
      console.warn('[EmailService] Skipping welcome email: No recipient email provided.');
      return { success: false, error: 'Recipient email is required.' };
    }

    const resend = getResendClient();
    if (!resend) {
      console.warn('[EmailService] Resend API key is not configured in environment (RESEND_API_KEY). Welcome email skipped.');
      return { success: false, error: 'RESEND_API_KEY is not configured.' };
    }

    const fromAddress = process.env.EMAIL_FROM || 'Mettle <onboarding@resend.dev>';
    const subject = 'Welcome to Mettle — Your Journey Starts Here';
    const html = generateWelcomeEmailHtml(name);
    const text = generateWelcomeEmailText(name);

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [email.trim().toLowerCase()],
      subject: subject,
      html: html,
      text: text,
    });

    if (error) {
      console.error('[EmailService] Resend email delivery error:', error.message || error);
      return { success: false, error: error.message || 'Email delivery failed' };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (err) {
    console.error('[EmailService] Unexpected error while sending welcome email:', err.message || 'Unknown error');
    return { success: false, error: err.message || 'Unknown email error' };
  }
};

/**
 * Send a level-up notification email using Resend when a user actually levels up.
 * 
 * Guarantees:
 * - Triggered ONLY when newLevel > oldLevel.
 * - Never throws an unhandled exception that breaks quest completion or progression.
 * - Never logs API keys or sensitive credentials.
 * - Single email sent even if a single quest caused a multi-level jump.
 * 
 * @param {Object} params
 * @param {string} params.email - Recipient email address
 * @param {string} params.name - User's display name
 * @param {number} params.oldLevel - Level before quest completion
 * @param {number} params.newLevel - Level reached after quest completion
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
const sendLevelUpEmail = async ({ email, name, oldLevel, newLevel }) => {
  try {
    if (!email || typeof email !== 'string') {
      console.warn('[EmailService] Skipping level-up email: No recipient email provided.');
      return { success: false, error: 'Recipient email is required.' };
    }

    if (Number(newLevel) <= Number(oldLevel)) {
      // Not an actual level transition, skip silently
      return { success: false, error: 'New level must be strictly greater than old level.' };
    }

    const resend = getResendClient();
    if (!resend) {
      console.warn('[EmailService] Resend API key is not configured in environment (RESEND_API_KEY). Level-up email skipped.');
      return { success: false, error: 'RESEND_API_KEY is not configured.' };
    }

    const fromAddress = process.env.EMAIL_FROM || 'Mettle <onboarding@resend.dev>';
    const subject = `You Leveled Up! — Mettle Level ${newLevel}`;
    const html = generateLevelUpEmailHtml({ name, oldLevel, newLevel });
    const text = generateLevelUpEmailText({ name, oldLevel, newLevel });

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [email.trim().toLowerCase()],
      subject: subject,
      html: html,
      text: text,
    });

    if (error) {
      console.error('[EmailService] Resend level-up email delivery error:', error.message || error);
      return { success: false, error: error.message || 'Email delivery failed' };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (err) {
    console.error('[EmailService] Unexpected error while sending level-up email:', err.message || 'Unknown error');
    return { success: false, error: err.message || 'Unknown email error' };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendLevelUpEmail,
  generateWelcomeEmailHtml,
  generateWelcomeEmailText,
  generateLevelUpEmailHtml,
  generateLevelUpEmailText,
};

