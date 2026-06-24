/**
 * Email notifications for STRhub Verified using Resend.
 * Requires RESEND_API_KEY in the environment.
 * Silently skips if the key is not set (dev/staging without email configured).
 */
import { Resend } from "resend";

const ADMIN_EMAIL = "tfronta@gmail.com";
const FROM = process.env.RESEND_FROM_EMAIL || "STRhub <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://strhub.io";

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function notifyNewPendingSubmission(params: {
  slug: string;
  toolName: string;
  toolVersion: string;
  repo: string;
  ip: string;
}): Promise<void> {
  const client = getClient();
  if (!client) return;

  const dashboardUrl = `${SITE_URL}/admin/dashboard`;

  await client.emails.send({
    from: FROM,
    to: [ADMIN_EMAIL],
    subject: `[STRhub Verified] Nueva tool pendiente: ${params.toolName} ${params.toolVersion}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e; margin-bottom: 8px;">Nueva tool pendiente de aprobación</h2>
        <p style="color: #666; margin-bottom: 24px;">
          Una herramienta nueva fue enviada a STRhub Verified y está esperando tu aprobación.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600; width: 120px; border-radius: 4px 0 0 0;">Tool</td>
            <td style="padding: 10px 12px; background: #fafafa;">${params.toolName} <span style="color: #888;">${params.toolVersion}</span></td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600;">Slug</td>
            <td style="padding: 10px 12px; background: #fafafa; font-family: monospace;">${params.slug}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600;">Repo</td>
            <td style="padding: 10px 12px; background: #fafafa;">
              <a href="${params.repo}" style="color: #4f46e5;">${params.repo.replace("https://github.com/", "")}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600; border-radius: 0 0 0 4px;">IP</td>
            <td style="padding: 10px 12px; background: #fafafa; font-family: monospace; color: #888;">${params.ip}</td>
          </tr>
        </table>

        <a href="${dashboardUrl}"
           style="display: inline-block; background: #4f46e5; color: white; text-decoration: none;
                  padding: 12px 24px; border-radius: 6px; font-weight: 600; margin-bottom: 24px;">
          Aprobar en el dashboard →
        </a>

        <p style="color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 16px; margin-top: 16px;">
          STRhub Verified · Aprobá la tool en el panel admin para que el run se dispare automáticamente.
        </p>
      </div>
    `,
  });
}
