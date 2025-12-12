import Stripe from 'stripe';


export async function onRequestPost(context) {
const stripe = new Stripe(context.env.STRIPE_SECRET);
const sig = context.request.headers.get('stripe-signature');
const body = await context.request.text();


let event;
try {
event = stripe.webhooks.constructEvent(body, sig, context.env.STRIPE_WEBHOOK_SECRET);
} catch (e) {
return new Response('Invalid signature', { status: 400 });
}


if (event.type === 'checkout.session.completed') {
const session = event.data.object;
const meta = session.metadata;


const order = {
id: session.id,
email: meta.email,
discord: meta.discord,
platform: meta.platform,
transferMethod: meta.transferMethod,
oneTimeUrl: meta.oneTimeUrl,
packageLabel: meta.pkg,
customAmount: meta.customAmount,
status: 'paid',
created: Date.now()
};


const kv = context.env.ORDERS;
await kv.put(order.id, JSON.stringify(order));
}


return new Response('ok');
}