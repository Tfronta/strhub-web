/**
 * Email notifications for STRhub Verified using Resend.
 * Requires RESEND_API_KEY in the environment.
 * Silently skips if the key is not set (dev/staging without email configured).
 */
import { Resend } from "resend";

const ADMIN_EMAIL = "tfronta@gmail.com";
const FROM = process.env.RESEND_FROM_EMAIL || "STRhub <onboarding@resend.dev>";
// Fallback must be the real host: the approve button in the notification is the
// only link in it, and pointing it at a domain we do not serve turns a delivered
// email into a dead end.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://strhub.app";

/**
 * Every value below comes from the submission form, and the mail is rendered as
 * HTML in the admin's inbox. Unescaped, a tool name like
 * `<a href="https://evil/approve">Aprobar</a>` becomes a working link in the
 * one message whose whole purpose is to get the admin to click "approve".
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
  const toolName = escapeHtml(params.toolName);
  const toolVersion = escapeHtml(params.toolVersion);
  const slug = escapeHtml(params.slug);
  const repo = escapeHtml(params.repo);
  const repoLabel = escapeHtml(params.repo.replace("https://github.com/", ""));
  const ip = escapeHtml(params.ip);

  const { error } = await client.emails.send({
    from: FROM,
    to: [ADMIN_EMAIL],
    subject: `[STRhub Verified] Nueva tool pendiente: ${params.toolName} ${params.toolVersion}`.replace(/[\r\n]/g, " "),
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e; margin-bottom: 8px;">Nueva tool pendiente de aprobación</h2>
        <p style="color: #666; margin-bottom: 24px;">
          Una herramienta nueva fue enviada a STRhub Verified y está esperando tu aprobación.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600; width: 120px; border-radius: 4px 0 0 0;">Tool</td>
            <td style="padding: 10px 12px; background: #fafafa;">${toolName} <span style="color: #888;">${toolVersion}</span></td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600;">Slug</td>
            <td style="padding: 10px 12px; background: #fafafa; font-family: monospace;">${slug}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600;">Repo</td>
            <td style="padding: 10px 12px; background: #fafafa;">
              <a href="${repo}" style="color: #4f46e5;">${repoLabel}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600; border-radius: 0 0 0 4px;">IP</td>
            <td style="padding: 10px 12px; background: #fafafa; font-family: monospace; color: #888;">${ip}</td>
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
  if (error) throw new Error(`Resend error: ${error.message}`);
}

export async function notifyManualVerificationRequest(params: {
  trialId: string;
  toolName: string;
  repo: string;
  ref: string;
  role: string;
  requesterEmail: string;
  reason: string;
  notes?: string;
  ciRun?: string;
  ip: string;
}): Promise<{ delivered: boolean }> {
  const client = getClient();
  if (!client) return { delivered: false };

  const trialUrl = `${SITE_URL}/verified/trial/${encodeURIComponent(params.trialId)}?as=${encodeURIComponent(params.role)}`;
  const toolName = escapeHtml(params.toolName);
  const repo = escapeHtml(params.repo);
  const repoLabel = escapeHtml(params.repo.replace("https://github.com/", ""));
  const ref = escapeHtml(params.ref);
  const role = escapeHtml(params.role);
  const requesterEmail = escapeHtml(params.requesterEmail);
  const reason = escapeHtml(params.reason);
  const notes = params.notes ? escapeHtml(params.notes) : "";
  const ciRun = params.ciRun ? escapeHtml(params.ciRun) : "";
  const ip = escapeHtml(params.ip);

  const { error } = await client.emails.send({
    from: FROM,
    to: [ADMIN_EMAIL],
    replyTo: params.requesterEmail,
    subject: `[STRhub Verified] Solicitud de revisión manual: ${params.toolName}`.replace(/[\r\n]/g, " "),
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e; margin-bottom: 8px;">Solicitud de verificación manual</h2>
        <p style="color: #555; margin-bottom: 20px;">
          Un usuario (${role}) solicitó verificación manual tras un trial automático en STRhub Verified.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600; width: 140px;">Herramienta</td>
            <td style="padding: 10px 12px; background: #fafafa;">${toolName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600;">Repositorio</td>
            <td style="padding: 10px 12px; background: #fafafa;"><a href="${repo}" style="color: #0d9488;">${repoLabel}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600;">Commit</td>
            <td style="padding: 10px 12px; background: #fafafa; font-family: monospace; font-size: 13px;">${ref}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600;">Contacto</td>
            <td style="padding: 10px 12px; background: #fafafa;"><a href="mailto:${requesterEmail}" style="color: #0d9488;">${requesterEmail}</a> (${role})</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600;">Motivo del freno</td>
            <td style="padding: 10px 12px; background: #fafafa;">${reason}</td>
          </tr>
          ${notes ? `<tr><td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600;">Comentarios</td><td style="padding: 10px 12px; background: #fafafa; white-space: pre-wrap;">${notes}</td></tr>` : ""}
          ${ciRun ? `<tr><td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600;">GitHub Actions</td><td style="padding: 10px 12px; background: #fafafa;"><a href="${ciRun}" style="color: #0d9488;">Ver corrida CI</a></td></tr>` : ""}
          <tr>
            <td style="padding: 10px 12px; background: #f5f5f5; font-weight: 600;">IP</td>
            <td style="padding: 10px 12px; background: #fafafa; font-family: monospace; color: #888;">${ip}</td>
          </tr>
        </table>

        <a href="${trialUrl}"
           style="display: inline-block; background: #0d9488; color: white; text-decoration: none;
                  padding: 12px 24px; border-radius: 6px; font-weight: 600; margin-bottom: 20px;">
          Abrir reporte del trial →
        </a>

        <p style="color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 14px; margin-top: 14px;">
          STRhub Verified · Plazo comunicado al solicitante: 3 a 5 días hábiles.
        </p>
      </div>
    `,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
  return { delivered: true };
}
