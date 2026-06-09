import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import db from '@/app/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const businessId = session.metadata?.business_id;

    if (businessId) {
      await db.query(
        'UPDATE businesses SET is_premium = 1 WHERE id = ?',
        [businessId]
      );
      console.log(`Business ${businessId} upgraded to premium!`);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any;
    const businessId = subscription.metadata?.business_id;

    if (businessId) {
      await db.query(
        'UPDATE businesses SET is_premium = 0 WHERE id = ?',
        [businessId]
      );
      console.log(`Business ${businessId} premium cancelled!`);
    }
  }

  return NextResponse.json({ received: true });
}