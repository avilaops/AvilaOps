// Avila Ops Store - Backend API for Stripe Integration
// Node.js + Express + Stripe example

require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://avila.inc'
}));

// Product price IDs (replace with your Stripe price IDs)
const PRICE_IDS = {
  'saas-starter': 'price_starter_monthly_xxxxx',
  'saas-pro': 'price_pro_monthly_xxxxx',
  'saas-business': 'price_business_monthly_xxxxx',
  'saas-enterprise': 'price_enterprise_monthly_xxxxx',
  'api-basic': 'price_api_basic_monthly_xxxxx',
  'api-premium': 'price_api_premium_monthly_xxxxx',
  'ent-license': 'price_ent_license_once_xxxxx',
  'ent-whitelabel': 'price_ent_whitelabel_once_xxxxx',
  'mp-plugin-auth': 'price_mp_auth_once_xxxxx',
  'mp-plugin-analytics': 'price_mp_analytics_once_xxxxx',
  'mp-theme-dark': 'price_mp_theme_once_xxxxx'
};

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items' });
    }

    // Map cart items to Stripe line items
    const lineItems = items.map(item => {
      const priceId = PRICE_IDS[item.id];

      if (!priceId) {
        throw new Error(`Unknown product: ${item.id}`);
      }

      return {
        price: priceId,
        quantity: 1
      };
    });

    // Determine if this is a subscription or one-time payment
    const hasSubscription = items.some(item =>
      item.id.startsWith('saas-') || item.id.startsWith('api-')
    );

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: hasSubscription ? 'subscription' : 'payment',
      success_url: `${process.env.FRONTEND_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel.html`,
      customer_email: req.body.customerEmail,
      metadata: {
        orderDate: new Date().toISOString(),
        source: 'avilaops_store'
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      // Subscription-specific options
      ...(hasSubscription && {
        subscription_data: {
          trial_period_days: req.body.trialDays || 0,
          metadata: {
            source: 'avilaops_store'
          }
        }
      })
    });

    res.json({ id: session.id, url: session.url });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle Stripe events
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSuccessfulCheckout(session);
      break;

    case 'customer.subscription.created':
      const subscription = event.data.object;
      await handleSubscriptionCreated(subscription);
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await handleSubscriptionCancelled(deletedSubscription);
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      await handleInvoicePaymentSucceeded(invoice);
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      await handleInvoicePaymentFailed(failedInvoice);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Event handlers
async function handleSuccessfulCheckout(session) {
  console.log('Checkout completed:', session.id);

  // 1. Create customer account
  // 2. Send welcome email with credentials
  // 3. Provision API keys
  // 4. Update database

  // Example: Send to your backend
  await fetch(process.env.INTERNAL_API_URL + '/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: session.id,
      customerId: session.customer,
      email: session.customer_email,
      amount: session.amount_total,
      currency: session.currency,
      status: 'completed'
    })
  });
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);

  // 1. Activate subscription features
  // 2. Send onboarding email
  // 3. Update customer tier
}

async function handleSubscriptionCancelled(subscription) {
  console.log('Subscription cancelled:', subscription.id);

  // 1. Revoke API access at period end
  // 2. Send cancellation confirmation
  // 3. Offer win-back incentive
}

async function handleInvoicePaymentSucceeded(invoice) {
  console.log('Invoice paid:', invoice.id);

  // 1. Send receipt
  // 2. Extend service period
  // 3. Update billing records
}

async function handleInvoicePaymentFailed(invoice) {
  console.log('Invoice payment failed:', invoice.id);

  // 1. Send dunning email
  // 2. Retry payment
  // 3. Downgrade if retries exhausted
}

// Get session details
app.get('/api/session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    res.json({
      id: session.id,
      status: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      currency: session.currency
    });
  } catch (error) {
    res.status(404).json({ error: 'Session not found' });
  }
});

// Create customer portal session (for managing subscriptions)
app.post('/api/create-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.FRONTEND_URL
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on port ${PORT}`);
  console.log(`📝 Webhook endpoint: /api/webhook`);
  console.log(`💳 Checkout endpoint: /api/create-checkout-session`);
});

module.exports = app;
