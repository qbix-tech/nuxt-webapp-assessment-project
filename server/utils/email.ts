import { render } from "@vue-email/render";
import { SMTPClient, Message } from "emailjs";
import type { AllowedComponentProps, Component, VNodeProps } from "vue";

const console = useLogger().withTag("utils:email");

export type EmailOptions = {
  from?: string;
  replyTo?: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

let _smtpClient: SMTPClient | null = null;

export const useEmail = () => {
  if (!_smtpClient) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_TLS } =
      process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP configuration is missing");
    }

    _smtpClient = new SMTPClient({
      host: SMTP_HOST,
      port: SMTP_PORT ? parseInt(SMTP_PORT) : 587,
      tls: SMTP_TLS === "true",
      user: SMTP_USER,
      password: SMTP_PASS,
    });
  }

  return {
    send: async (emailOptions: EmailOptions) => {
      const { to, subject, html, text } = emailOptions;

      if (!to) throw new Error("Email 'to' is required");

      if (!text && !html) throw new Error("Email 'text' or 'html' is required");

      const message = new Message({
        from: emailOptions.from || process.env.SMTP_FROM_EMAIL,
        "reply-to":
          emailOptions.replyTo ||
          emailOptions.from ||
          process.env.SMTP_REPLY_TO_EMAIL ||
          process.env.SMTP_FROM_EMAIL ||
          undefined,
        to,
        subject,
        text,
        attachment: html ? [{ data: html, alternative: true }] : undefined,
      });

      const { isValid, validationError } = message.checkValidity();

      if (!isValid) throw new Error(validationError);

      try {
        await _smtpClient!.sendAsync(message);
        console.info("Send email is successful");
      } catch (error) {
        console.error("Send email failed with error:", error);
      }
    },
  };
};

export type ExtractComponentProps<TComponent> = TComponent extends new () => {
  $props: infer P;
}
  ? Omit<P, keyof VNodeProps | keyof AllowedComponentProps>
  : never;

export interface VNode {
  type: string;
  props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: Record<string, any>;
    children?: string | VNode | VNode[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;
  };
}

export const renderEmail = async <T extends Component>(
  component: T,
  props?: ExtractComponentProps<T>,
) => {
  const html = await render(component, props);
  const text = await render(component, props, { plainText: true });

  return { html, text };
};
