# Cloudflare Email API

Minimal authenticated HTTP email API built with Cloudflare Workers and Cloudflare Email Service.

## Endpoints

- `GET /health`
- `POST /send`

## URLs

- Production: https://email-api.msar.me
- Development: https://email-api.msar.workers.dev

## Setup

### 1. Configure Cloudflare Email Service

Onboard your sending domain in Cloudflare Email Service.

Update `allowed_sender_addresses` in `wrangler.jsonc` to match your verified sender addresses.

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure environment variables

The Worker requires three values: `API_KEY`, `FROM_EMAIL`, and `FROM_NAME`. These are declared in `wrangler.jsonc` and are not committed to the repo.

```jsonc
{
  "secrets": {
    "required": ["API_KEY", "FROM_EMAIL", "FROM_NAME"]
  }
}
```

#### Local development

Copy the example file and set your values:

```bash
cp .dev.vars.example .dev.vars
```

```env
FROM_EMAIL=noreply@msar.me
FROM_NAME=Saiful Alam
API_KEY=replace-with-a-long-random-secret
```

Never commit `.dev.vars`.

#### Production

Set each value as a Wrangler secret:

```bash
yarn wrangler secret put API_KEY
yarn wrangler secret put FROM_EMAIL
yarn wrangler secret put FROM_NAME
```

`wrangler deploy` will fail if any required secret is missing.

### 4. Start development server

```bash
yarn dev
```

### 5. Deploy

```bash
yarn deploy
```

## Health check

```bash
curl https://email-api.msar.me/health
```

Response:

```json
{
  "success": true,
  "status": "ok"
}
```

## Send an email

```bash
curl -X POST \
  "https://email-api.msar.me/send" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Hello from Cloudflare",
    "text": "Plain text fallback",
    "html": "<h1>Hello</h1><p>Sent from my Worker.</p>",
    "replyTo": "hello@msar.me"
  }'
```

At least one of `text` or `html` is required.

## Successful response

```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "..."
}
```

## Validation error

```json
{
  "success": false,
  "error": "A valid to email address is required"
}
```

## Unauthorized response

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

## Security

The sender email address is configured server-side.

The API does not accept a `from` field from the request body.

The `/send` endpoint requires Bearer token authentication.

Do not expose the API key in frontend or browser-side JavaScript.

Use this API from trusted backend applications.