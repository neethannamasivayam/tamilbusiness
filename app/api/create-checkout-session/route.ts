import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { business_id, business_name } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `Premium Listing - ${business_name}`,
              description: 'Featured placement at the top of search results',
            },
            unit_amount: 999, // $9.99 CAD
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/business/${business_id}?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/business/${business_id}`,
      metadata: {
        business_id: String(business_id),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}