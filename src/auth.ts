const encoder = new TextEncoder();

/**
 * Checks the `Authorization: Bearer <key>` header in constant time.
 * Both values are hashed first so their lengths always match, which
 * `timingSafeEqual` requires.
 */
export async function isAuthorized(
    request: Request,
    apiKey: string,
): Promise<boolean> {
    const header = request.headers.get("Authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
        return false;
    }

    const [given, expected] = await Promise.all([
        crypto.subtle.digest("SHA-256", encoder.encode(token)),
        crypto.subtle.digest("SHA-256", encoder.encode(apiKey)),
    ]);

    return crypto.subtle.timingSafeEqual(given, expected);
}
