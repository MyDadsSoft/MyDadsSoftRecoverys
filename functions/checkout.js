import Stripe from 'stripe';


export async function onRequestPost(context) {
const stripe = new Stripe(context.env.STRIPE_SECRET);
const data = await context.request.json();


let price = 500;
if (data.pkg === '50m') price = 1500;
if (data.pkg === '100m') price = 2500;
if (data.pkg === 'custom') price = (Number(data.customAmount) || 1) * 200; // $2 per million


const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
mode: 'payment',
line_items: [{ price_data:{ currency:'usd', product_data:{ name:'GTA V Recovery' }, unit_amount:price }, quantity:1 }],
success_url: context.env.BASE_URL + '/?success=true',
cancel_url: context.env.BASE_URL + '/?cancel=true',
metadata: data
});


return new Response(JSON.stringify({ url: session.url }), {
headers: { 'Content-Type': 'application/json' }
});
}