import { stripe } from '@/lib/stripe/client';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return new NextResponse('Webhook signature verification failed', { status: 400 });
    }

    const supabase = createSupabaseServiceClient();

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                await supabase
                    .from('organizations')
                    .update({
                        plan: session.metadata?.plan,
                        stripe_subscription_id: session.subscription as string,
                        plan_status: 'active',
                    })
                    .eq('stripe_customer_id', session.customer);
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                if (invoice.subscription) {
                    await supabase
                        .from('organizations')
                        .update({ plan_status: 'active' })
                        .eq('stripe_subscription_id', invoice.subscription);
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                if (invoice.subscription) {
                    await supabase
                        .from('organizations')
                        .update({ plan_status: 'past_due' })
                        .eq('stripe_subscription_id', invoice.subscription);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                await supabase
                    .from('organizations')
                    .update({
                        plan: 'free',
                        plan_status: 'active',
                        stripe_subscription_id: null,
                    })
                    .eq('stripe_subscription_id', subscription.id);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                await supabase
                    .from('organizations')
                    .update({
                        plan_status: subscription.status === 'active' ? 'active' : 'past_due',
                    })
                    .eq('stripe_subscription_id', subscription.id);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (err) {
        console.error('Error handling webhook event:', err);
        return new NextResponse('Webhook handler failed', { status: 500 });
    }

    return new NextResponse('OK', { status: 200 });
}
