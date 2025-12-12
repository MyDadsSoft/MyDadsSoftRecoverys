export default {
  async fetch(request, env) {
    // Optional: protect with a simple admin API key
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('apiKey');
    if (apiKey !== 'YOUR_ADMIN_KEY') {
      return new Response('Unauthorized', { status: 401 });
    }

    const list = await env.ORDERS.list();
    const orders = [];

    for (const key of list.keys) {
      const order = await env.ORDERS.get(key.name, { type: 'json' });
      orders.push(order);
    }

    return new Response(JSON.stringify(orders), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
