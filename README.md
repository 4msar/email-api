# Cloudflare Email API

Minimal authenticated HTTP email API built with Cloudflare Workers and Cloudflare Email Service.

## Endpoints

- `GET /health`
- `POST /send`

## Setup

### 1. Configure Cloudflare Email Service

Onboard your sending domain in Cloudflare Email Service.

Update the sender configuration in:

```text
wrangler.jsonc
```

Example:

```json
{
  "vars": {
    "FROM_EMAIL": "noreply@msar.me",
    "FROM_NAME": "MSAR"
  }
}
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API key

For production:

```bash
npx wrangler secret put API_KEY
```

Enter a long random API key.

For local development:

```bash
cp .dev.vars.example .dev.vars
```

Then update:

```env
API_KEY=your-local-api-key
```

### 4. Start development server

```bash
npm run dev
```

### 5. Deploy

```bash
npm run deploy
```

## Health check

```bash
curl https://email-api.YOUR_SUBDOMAIN.workers.dev/health
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
  "https://email-api.YOUR_SUBDOMAIN.workers.dev/send" \
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