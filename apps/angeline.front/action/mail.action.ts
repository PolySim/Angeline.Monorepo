"use server";

import { config } from "@/config/config";
import * as brevo from "@getbrevo/brevo";

export const sendMail = async ({
  email,
  name,
  message,
}: {
  email: string;
  name: string;
  message: string;
}) => {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      config.BREVO_API_KEY
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Nouvelle demande de contact depuis le site";
    sendSmtpEmail.htmlContent = `
        <p>Nom: ${name}</p>
        <p>Email: ${email}</p>
        <p>Message: ${message}</p>
        `;
    sendSmtpEmail.sender = {
      name: "Mon Site | Angeline",
      email: "simon.desdevises@gmail.com",
    };
    sendSmtpEmail.to = [{ email: "angeline.desdevises@gmail.com" }];

    // Envoi
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    if (!result) {
      console.log(result);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
