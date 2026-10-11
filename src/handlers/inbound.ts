export async function handleInbound(
    message: ForwardableEmailMessage,
    env: Env,
): Promise<void> {
    console.log("Inbound email received", {
        from: message.from,
        to: message.to,
        subject: message.headers.get("subject") ?? "(no subject)",
        rawSize: message.rawSize,
    });

    if (message.to.toLowerCase().startsWith("noreply@")) {
        message.setReject("This address does not accept incoming mail");
        return;
    }

    if (!env.FORWARD_TO) {
        message.setReject("Inbound email is not configured");
        return;
    }

    try {
        await message.forward(
            env.FORWARD_TO,
            new Headers({ "X-Original-Recipient": message.to }),
        );
    } catch (err) {
        console.error("Inbound email forwarding failed", {
            from: message.from,
            to: message.to,
            error: err instanceof Error ? err.message : String(err),
        });

        message.setReject("Unable to process email at this time");
    }
}
