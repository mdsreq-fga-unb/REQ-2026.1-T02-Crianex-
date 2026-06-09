// Email service scaffold — ready for production configuration.
//
// To enable email sending, install a mailer (e.g. nodemailer or resend) and
// set the required environment variables, then replace the stub body below.
//
// nodemailer example:
//   Required env vars: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM
//
// Resend example:
//   Required env vars: RESEND_API_KEY, EMAIL_FROM

export type WelcomeEmailPayload = {
  to: string;
  name: string;
  password: string;
};

/**
 * Sends a welcome email to a newly created member with their initial credentials.
 * Currently a no-op stub — configure the mailer above to activate.
 */
export async function sendWelcomeEmail({ to, name, password }: WelcomeEmailPayload): Promise<void> {
  // --- Uncomment and adapt when mailer is configured ---
  //
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: Number(process.env.EMAIL_PORT ?? 587),
  //   secure: false,
  //   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  // });
  //
  // await transporter.sendMail({
  //   from: process.env.EMAIL_FROM ?? 'noreply@crianex.com.br',
  //   to,
  //   subject: 'Bem-vindo ao Painel Crianex — suas credenciais de acesso',
  //   html: buildWelcomeHtml(name, to, password),
  // });

  console.info(`[email] Welcome email pendente para ${to} — ative o mailer para enviar.`);
  // password is intentionally not logged for security
  void password;
}

function buildWelcomeHtml(name: string, email: string, password: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><title>Bem-vindo ao Painel Crianex</title></head>
<body style="font-family:sans-serif;background:#f5f5f5;margin:0;padding:24px;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e0e0e0;">
    <h1 style="font-size:22px;margin:0 0 8px;">Bem-vindo ao Crianex, ${escapeHtml(name)}!</h1>
    <p style="color:#555;margin:0 0 24px;">Você foi adicionado ao painel administrativo da Crianex. Suas credenciais de acesso inicial são:</p>

    <div style="background:#f8f8f8;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:.05em;">E-mail</p>
      <p style="margin:0 0 16px;font-family:monospace;font-size:15px;color:#111;">${escapeHtml(email)}</p>
      <p style="margin:0 0 8px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:.05em;">Senha inicial</p>
      <p style="margin:0;font-family:monospace;font-size:15px;color:#111;letter-spacing:.05em;">${escapeHtml(password)}</p>
    </div>

    <p style="color:#ef4444;font-size:13px;margin:0 0 24px;">
      Por segurança, <strong>altere sua senha</strong> logo após o primeiro acesso em Meu Perfil → Alterar senha.
    </p>

    <a href="https://admin.crianex.com.br/admin/login"
       style="display:inline-block;background:#7f3fe5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Acessar o Painel
    </a>

    <p style="color:#aaa;font-size:12px;margin-top:32px;margin-bottom:0;">
      Crianex · Este é um e-mail automático, não responda.
    </p>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
