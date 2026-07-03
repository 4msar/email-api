interface Env {
  EMAIL: SendEmail;
  API_KEY: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
}

interface SendEmailRequest {
  to?: unknown;
  subject?: unknown;
  text?: unknown;
  html?: unknown;
  replyTo?: unknown;
}

interface EmailError extends Error {
  code?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_SUBJECT_LENGTH = 998;
const MAX_BODY_LENGTH = 1_000_000;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (url.pathname === "/health" && request.method === "GET") {
      return json({
        success: true,
        status: "ok",
      });
    }

    if (url.pathname !== "/send") {
      return json(
        {
          success: false,
          error: "Not found",
        },
        404,
      );
    }

    if (request.method !== "POST") {
      return json(
        {
          success: false,
          error: "Method not allowed",
        },
        405,
        {
          Allow: "POST",
        },
      );
    }

    if (!isAuthorized(request, env.API_KEY)) {
      return json(
        {
          success: false,
          error: "Unauthorized",
        },
        401,
      );
    }

    const contentType = request.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      return json(
        {
          success: false,
          error: "Content-Type must be application/json",
        },
        415,
      );
    }

    let body: SendEmailRequest;

    try {
      body = await request.json<SendEmailRequest>();
    } catch {
      return json(
        {
          success: false,
          error: "Invalid JSON body",
        },
        400,
      );
    }

    const validationError = validate(body);

    if (validationError) {
      return json(
        {
          success: false,
          error: validationError,
        },
        422,
      );
    }

    const to = body.to as string;
    const subject = body.subject as string;

    const text =
      typeof body.text === "string"
        ? body.text
        : undefined;

    const html =
      typeof body.html === "string"
        ? body.html
        : undefined;

    const replyTo =
      typeof body.replyTo === "string"
        ? body.replyTo
        : undefined;

    try {
      const result = await env.EMAIL.send({
        from: {
          email: env.FROM_EMAIL,
          name: env.FROM_NAME,
        },
        to,
        subject,
        text,
        html,
        replyTo,
      });

      return json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
      });
    } catch (error) {
      const emailError = error as EmailError;

      console.error("Email sending failed", {
        code: emailError.code,
        message: emailError.message,
      });

      if (
        emailError.code === "E_RATE_LIMIT_EXCEEDED" ||
        emailError.code === "E_DAILY_LIMIT_EXCEEDED"
      ) {
        return json(
          {
            success: false,
            error: "Email sending limit exceeded",
          },
          429,
        );
      }

      if (
        emailError.code === "E_VALIDATION_ERROR" ||
        emailError.code === "E_FIELD_MISSING" ||
        emailError.code === "E_RECIPIENT_NOT_ALLOWED" ||
        emailError.code === "E_SENDER_NOT_VERIFIED" ||
        emailError.code === "E_SENDER_DOMAIN_NOT_AVAILABLE"
      ) {
        return json(
          {
            success: false,
            error: emailError.message || "Email rejected",
            code: emailError.code,
          },
          400,
        );
      }

      return json(
        {
          success: false,
          error: "Failed to send email",
          code: emailError.code,
        },
        500,
      );
    }
  },
} satisfies ExportedHandler<Env>;

function isAuthorized(
  request: Request,
  apiKey: string,
): boolean {
  const authorization =
    request.headers.get("Authorization");

  return authorization === `Bearer ${apiKey}`;
}

function validate(
  body: SendEmailRequest,
): string | null {
  if (
    typeof body.to !== "string" ||
    !EMAIL_PATTERN.test(body.to)
  ) {
    return "A valid to email address is required";
  }

  if (
    typeof body.subject !== "string" ||
    body.subject.trim().length === 0 ||
    body.subject.length > MAX_SUBJECT_LENGTH
  ) {
    return "A valid subject is required";
  }

  const hasText =
    typeof body.text === "string" &&
    body.text.length > 0;

  const hasHtml =
    typeof body.html === "string" &&
    body.html.length > 0;

  if (!hasText && !hasHtml) {
    return "At least one of text or html is required";
  }

  if (
    (
      hasText &&
      (body.text as string).length > MAX_BODY_LENGTH
    ) ||
    (
      hasHtml &&
      (body.html as string).length > MAX_BODY_LENGTH
    )
  ) {
    return "Email body is too large";
  }

  if (
    body.replyTo !== undefined &&
    (
      typeof body.replyTo !== "string" ||
      !EMAIL_PATTERN.test(body.replyTo)
    )
  ) {
    return "replyTo must be a valid email address";
  }

  return null;
}

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Authorization, Content-Type",
    "Access-Control-Allow-Methods":
      "POST, OPTIONS",
  };
}

function json(
  data: unknown,
  status = 200,
  extraHeaders: HeadersInit = {},
): Response {
  return Response.json(data, {
    status,
    headers: {
      ...corsHeaders(),
      ...extraHeaders,
      "Cache-Control": "no-store",
    },
  });
}