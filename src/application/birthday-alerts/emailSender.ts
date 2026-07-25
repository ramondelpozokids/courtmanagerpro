import {
  BIRTHDAY_ALERT_RECIPIENT_EMAILS,
  BIRTHDAY_ALERT_RECIPIENTS,
  BIRTHDAY_EMAIL_SUBJECT,
} from '@/config/birthday-alerts';
import { formatBirthDateEs } from './dateUtils';
import type { BirthdayEmailSendResult, BirthdayPerson } from './types';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function recipientsLabel(): string {
  return BIRTHDAY_ALERT_RECIPIENTS.map((r) => `${r.name} <${r.email}>`).join(' · ');
}

export function buildBirthdayEmailHtml(people: BirthdayPerson[]): string {
  const cards = people
    .map((p) => {
      const photo = p.photo_url
        ? `<img src="${p.photo_url}" alt="${p.full_name}" width="96" height="128" style="border-radius:8px;object-fit:cover;background:#111;" />`
        : `<div style="width:96px;height:128px;border-radius:8px;background:#1e293b;color:#94a3b8;display:flex;align-items:center;justify-content:center;font-size:12px;">Sin foto</div>`;
      return `
      <tr>
        <td style="padding:16px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:16px;">${photo}</td>
            <td style="font-family:Arial,sans-serif;color:#0f172a;font-size:14px;line-height:1.5;">
              <strong style="font-size:16px;">${p.full_name}</strong><br/>
              Cargo: ${p.role}<br/>
              Edad que cumple: ${p.turning_age}<br/>
              Fecha de nacimiento: ${formatBirthDateEs(p.birth_date)}
            </td>
          </tr></table>
        </td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr><td style="background:#0f172a;color:#fff;padding:20px 24px;font-family:Arial,sans-serif;">
          <div style="font-size:12px;letter-spacing:1px;color:#fb923c;font-weight:bold;">COURTMANAGER PRO</div>
          <div style="font-size:20px;font-weight:bold;margin-top:6px;">🎂 Recordatorio de cumpleaños</div>
        </td></tr>
        <tr><td style="padding:24px;font-family:Arial,sans-serif;color:#334155;font-size:15px;line-height:1.6;">
          <p>Buenos días,</p>
          <p>CourtManager Pro ha detectado que mañana cumple años un miembro del Primer Equipo de Baloncesto del Real Madrid.</p>
          <p><strong>Información:</strong></p>
        </td></tr>
        ${cards}
        <tr><td style="padding:20px 24px;font-family:Arial,sans-serif;font-size:12px;color:#94a3b8;">
          Enviado automáticamente a ${recipientsLabel()}. Fuente: plantilla oficial Real Madrid.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildBirthdayEmailText(people: BirthdayPerson[]): string {
  const blocks = people
    .map(
      (p) =>
        `• ${p.full_name}\n  Cargo: ${p.role}\n  Edad que cumple: ${p.turning_age}\n  Fecha de nacimiento: ${formatBirthDateEs(p.birth_date)}`
    )
    .join('\n\n');

  return `Buenos días,

CourtManager Pro ha detectado que mañana cumple años un miembro del Primer Equipo de Baloncesto del Real Madrid.

Información:

${blocks}

Destinatarios: ${recipientsLabel()}
`;
}

async function sendViaResend(html: string, text: string): Promise<{ ok: boolean; error: string | null }> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, error: 'RESEND_API_KEY no configurada' };

  const from =
    process.env.BIRTHDAY_EMAIL_FROM?.trim() ||
    'CourtManager Pro <noreply@ramondelpozorott.es>';

  if (from.toLowerCase().includes('resend.dev') || from.toLowerCase().includes('onboarding@')) {
    return {
      ok: false,
      error:
        'BIRTHDAY_EMAIL_FROM no puede usar resend.dev. Verifica el dominio ramondelpozorott.es en Resend y usa noreply@ramondelpozorott.es',
    };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [...BIRTHDAY_ALERT_RECIPIENT_EMAILS],
      subject: BIRTHDAY_EMAIL_SUBJECT,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: `Resend HTTP ${res.status}: ${body.slice(0, 300)}` };
  }
  return { ok: true, error: null };
}

async function sendViaSmtp(html: string, text: string): Promise<{ ok: boolean; error: string | null }> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return { ok: false, error: 'SMTP no configurado' };

  try {
    const nodemailer = await import('nodemailer');
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    const from = process.env.BIRTHDAY_EMAIL_FROM?.trim() || user;
    await transporter.sendMail({
      from,
      to: BIRTHDAY_ALERT_RECIPIENT_EMAILS.join(', '),
      subject: BIRTHDAY_EMAIL_SUBJECT,
      html,
      text,
    });
    return { ok: true, error: null };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function sendBirthdayEmailWithRetries(
  people: BirthdayPerson[],
  maxAttempts = 3
): Promise<BirthdayEmailSendResult> {
  if (people.length === 0) {
    return { ok: true, attempts: 0, error: null, provider: 'none' };
  }

  const html = buildBirthdayEmailHtml(people);
  const text = buildBirthdayEmailText(people);

  const hasResend = Boolean(process.env.RESEND_API_KEY?.trim());
  const hasSmtp = Boolean(
    process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim()
  );

  if (!hasResend && !hasSmtp) {
    return {
      ok: false,
      attempts: 0,
      error:
        'Falta proveedor real de correo: configura RESEND_API_KEY + dominio verificado, o SMTP completo',
      provider: 'none',
    };
  }

  let lastError: string | null = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const viaResend = hasResend ? await sendViaResend(html, text) : { ok: false, error: 'skip' };
    if (viaResend.ok) {
      return { ok: true, attempts: attempt, error: null, provider: 'resend' };
    }

    const viaSmtp = hasSmtp ? await sendViaSmtp(html, text) : { ok: false, error: viaResend.error };
    if (viaSmtp.ok) {
      return { ok: true, attempts: attempt, error: null, provider: 'smtp' };
    }

    lastError = viaSmtp.error || viaResend.error || 'Error de envío';
    console.warn(`[birthday-email] attempt ${attempt}/${maxAttempts} failed:`, lastError);
    if (attempt < maxAttempts) await sleep(800 * attempt);
  }

  return {
    ok: false,
    attempts: maxAttempts,
    error: lastError,
    provider: hasResend ? 'resend' : 'smtp',
  };
}
