import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_URL || 'http://localhost:4000/graphql';

const UPDATE_INVOICE_MUTATION = `
  mutation UpdateInvoice($id: ID!, $input: InvoiceUpdateInput!) {
    updateInvoice(id: $id, input: $input) {
      id
      status
      paid_date
      payment_method
    }
  }
`;

const RECORD_PAYMENT_MUTATION = `
  mutation RecordPayment($input: RecordPaymentInput!) {
    recordPayment(input: $input) {
      id
      total_amount
      payment_date
    }
  }
`;

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function graphqlRequest(query, variables) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.WEBHOOK_API_KEY,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle payment_intent.succeeded event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Check if this payment is for an invoice
    if (paymentIntent.metadata?.db_invoice_id) {
      try {
        const invoiceId = paymentIntent.metadata.db_invoice_id;
        const customerId = paymentIntent.metadata.customer_id;
        const amountPaid = paymentIntent.amount / 100; // Convert cents to dollars

        // Determine payment method
        let paymentMethod = 'online_payment';
        if (paymentIntent.charges?.data[0]?.payment_method_details) {
          const details = paymentIntent.charges.data[0].payment_method_details;
          if (details.type === 'us_bank_account') {
            paymentMethod = 'ach';
          } else if (details.type === 'card') {
            paymentMethod = 'credit_card';
          }
        }

        const now = new Date().toISOString();

        console.log(`Processing payment for invoice ${invoiceId}`);

        // 1. Update invoice status to paid
        await graphqlRequest(UPDATE_INVOICE_MUTATION, {
          id: invoiceId,
          input: {
            status: 'paid',
            paid_date: now,
            payment_method: paymentMethod,
          },
        });

        console.log(`Updated invoice ${invoiceId} to paid status`);

        // 2. Record payment in database
        await graphqlRequest(RECORD_PAYMENT_MUTATION, {
          input: {
            customer_id: customerId,
            payment_method: paymentMethod,
            total_amount: amountPaid,
            payment_date: now,
            notes: `Stripe payment: ${paymentIntent.id}`,
            invoices: [
              {
                invoice_id: invoiceId,
                amount_applied: amountPaid,
              },
            ],
          },
        });

        console.log(`Successfully recorded payment for invoice ${invoiceId}`);
      } catch (error) {
        console.error('Error updating invoice/payment:', error);
        // Don't fail the webhook - payment already succeeded in Stripe
        // This allows manual reconciliation if needed
      }
    }
  }

  res.json({ received: true });
}
