export async function onRequestGet(context){
  const kv=context.env.ORDERS;
  const list=await kv.list();
  const orders=[];
  for(const key of list.keys){const o=await kv.get(key.name,{type:'json'});orders.push(o);}
  return new Response(JSON.stringify(orders),{headers:{'Content-Type':'application/json'}});
}
