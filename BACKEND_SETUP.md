# Backend Setup Instructions

This directory contains a Node.js backend example for Stripe integration.

## Prerequisites

- Node.js 18+ installed
- Stripe account with API keys
- Environment variables configured

## Installation

```bash
# Install dependencies
npm install express stripe cors dotenv

# Or use package.json
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Frontend URL
FRONTEND_URL=https://avila.inc

# Internal API (optional)
INTERNAL_API_URL=https://api-internal.avila.inc

# Server Port
PORT=3000
```

## Running the Server

### Development Mode
```bash
node backend-example.js
```

### Production Mode (with PM2)
```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start backend-example.js --name avilaops-api

# View logs
pm2 logs avilaops-api

# Restart
pm2 restart avilaops-api

# Stop
pm2 stop avilaops-api
```

## Setting Up Stripe Webhook

1. **Install Stripe CLI** (for local testing):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

2. **Production Webhook**:
   - Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - URL: `https://api.avila.inc/api/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

## Creating Products in Stripe

### Using Stripe Dashboard

1. Go to [Products](https://dashboard.stripe.com/products)
2. Click "Add product"
3. Fill in details and pricing
4. Copy the `price_id` (starts with `price_`)
5. Update `PRICE_IDS` in `backend-example.js`

### Using Stripe CLI

```bash
# SaaS Starter Plan
stripe products create --name "Starter Plan" --description "For small teams"
stripe prices create --product prod_xxxxx --unit-amount 3900 --currency usd --recurring interval=month --lookup-key saas-starter

# Professional Plan
stripe products create --name "Professional Plan" --description "For professional teams"
stripe prices create --product prod_xxxxx --unit-amount 14900 --currency usd --recurring interval=month --lookup-key saas-pro

# Business Plan
stripe products create --name "Business Plan" --description "For large teams"
stripe prices create --product prod_xxxxx --unit-amount 39900 --currency usd --recurring interval=month --lookup-key saas-business

# Enterprise License (one-time)
stripe products create --name "Enterprise License" --description "Perpetual license"
stripe prices create --product prod_xxxxx --unit-amount 999900 --currency usd --lookup-key ent-license
```

## API Endpoints

### Create Checkout Session
```bash
POST /api/create-checkout-session
Content-Type: application/json

{
  "items": [
    { "id": "saas-starter" },
    { "id": "mp-plugin-auth" }
  ],
  "customerEmail": "customer@example.com",
  "trialDays": 14
}

Response:
{
  "id": "cs_test_xxxxx",
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxxxx"
}
```

### Get Session Details
```bash
GET /api/session/:sessionId

Response:
{
  "id": "cs_test_xxxxx",
  "status": "paid",
  "customerEmail": "customer@example.com",
  "amountTotal": 3900,
  "currency": "usd"
}
```

### Create Customer Portal
```bash
POST /api/create-portal-session
Content-Type: application/json

{
  "customerId": "cus_xxxxx"
}

Response:
{
  "url": "https://billing.stripe.com/session/xxxxx"
}
```

### Webhook
```bash
POST /api/webhook
Stripe-Signature: t=xxxxx,v1=xxxxx

(Stripe will send event data)
```

## Testing

### Test Cards

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires 3DS**: 4000 0027 6000 3184

Use any future expiry date, any CVC, any ZIP code.

### Test Webhook Locally

```bash
# Terminal 1: Start server
node backend-example.js

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3000/api/webhook

# Terminal 3: Trigger event
stripe trigger checkout.session.completed
```

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Add environment variables in Vercel dashboard.

### Deploy to AWS Lambda

Use Serverless Framework:

```bash
npm install -g serverless
serverless deploy
```

### Deploy to Heroku

```bash
heroku create avilaops-api
heroku config:set STRIPE_SECRET_KEY=sk_xxx
git push heroku main
```

## Security Checklist

- ✅ Use HTTPS in production
- ✅ Validate webhook signatures
- ✅ Keep secret keys secure (never commit to Git)
- ✅ Rate limit API endpoints
- ✅ Implement CORS properly
- ✅ Log all transactions
- ✅ Handle errors gracefully
- ✅ Monitor webhook failures

## Monitoring

Add logging and monitoring:

```javascript
// Example with Winston
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('Checkout session created', { sessionId: session.id });
```

## Support

For questions about integration:
- Email: support@avila.inc
- Docs: https://docs.avila.inc
- Stripe Docs: https://stripe.com/docs

## License

Proprietary - Avila Ops © 2026