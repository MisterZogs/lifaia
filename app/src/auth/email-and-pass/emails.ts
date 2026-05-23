import {
  type GetPasswordResetEmailContentFn,
  type GetVerificationEmailContentFn,
} from "wasp/server/auth";

export const getVerificationEmailContent: GetVerificationEmailContentFn = ({
  verificationLink,
}) => ({
  subject: 'Lifaia — Vérifiez votre adresse email',
  text: `Cliquez sur le lien ci-dessous pour vérifier votre adresse email : ${verificationLink}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1d4ed8;">Lifaia</h2>
      <p>Bonjour,</p>
      <p>Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte.</p>
      <a href="${verificationLink}"
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
        Vérifier mon email
      </a>
      <p style="color: #6b7280; font-size: 12px;">
        Si vous n'avez pas créé de compte sur Lifaia, ignorez cet email.
      </p>
    </div>
  `,
})

export const getPasswordResetEmailContent: GetPasswordResetEmailContentFn = ({
  passwordResetLink,
}) => ({
  subject: 'Lifaia — Réinitialisation de votre mot de passe',
  text: `Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe : ${passwordResetLink}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1d4ed8;">Lifaia</h2>
      <p>Bonjour,</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous.</p>
      <a href="${passwordResetLink}"
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
        Réinitialiser mon mot de passe
      </a>
      <p style="color: #6b7280; font-size: 12px;">
        Ce lien est valable 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
      </p>
    </div>
  `,
})
