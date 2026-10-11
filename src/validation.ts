const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_SUBJECT_LENGTH = 998;
const MAX_BODY_LENGTH = 1_000_000;

export interface SendEmailInput {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
}

export type ValidationResult =
    | { ok: true; value: SendEmailInput }
    | { ok: false; error: string };

function isEmail(value: unknown): value is string {
    return typeof value === "string" && EMAIL_PATTERN.test(value);
}

function nonEmptyString(value: unknown): string | undefined {
    return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function validateSendEmail(body: unknown): ValidationResult {
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return { ok: false, error: "Request body must be a JSON object" };
    }

    const { to, subject, text, html, replyTo } = body as Record<string, unknown>;

    if (!isEmail(to)) {
        return { ok: false, error: "A valid to email address is required" };
    }

    if (
        typeof subject !== "string" ||
        subject.trim().length === 0 ||
        subject.length > MAX_SUBJECT_LENGTH
    ) {
        return { ok: false, error: "A valid subject is required" };
    }

    const textBody = nonEmptyString(text);
    const htmlBody = nonEmptyString(html);

    if (!textBody && !htmlBody) {
        return { ok: false, error: "At least one of text or html is required" };
    }

    if (
        (textBody?.length ?? 0) > MAX_BODY_LENGTH ||
        (htmlBody?.length ?? 0) > MAX_BODY_LENGTH
    ) {
        return { ok: false, error: "Email body is too large" };
    }

    if (replyTo !== undefined && !isEmail(replyTo)) {
        return { ok: false, error: "replyTo must be a valid email address" };
    }

    return {
        ok: true,
        value: { to, subject, text: textBody, html: htmlBody, replyTo },
    };
}
