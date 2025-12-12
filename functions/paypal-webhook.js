export async function onRequestPost(context) {
const data = await context.request.json();
const kv = context.env.ORDERS;
const order = {
id: data.orderID,
email: data.email,
discord: data.discord,
platform: data.platform,
transferMethod: data.transferMethod,
package: data.package,
status: 'paid',
created: Date.now()
};
await kv.put(order.id, JSON.stringify(order));
return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type':'application/json' } });
}