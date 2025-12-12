export async function onRequestPost(context) {
  const kv = context.env.ORDERS;
  const data = await context.request.json();
  const order = await kv.get(data.id, {type:'json'});
  if(!order) return new Response('Order not found',{status:404});
  if(data.action==='completed') order.status='completed';
  if(data.action==='deleted') order.status='credentials_deleted';
  await kv.put(data.id, JSON.stringify(order));
  return new Response(JSON.stringify({ok:true}), {headers:{'Content-Type':'application/json'}});
}
