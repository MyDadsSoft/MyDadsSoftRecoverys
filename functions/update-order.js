export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const apiKey = url.searchParams.get('apiKey');
    if (apiKey !== 'YOUR_ADMIN_KEY') {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
      const { orderId, status } = await request.json();

      const order = await env.ORDERS.get(orderId, { type: 'json' });
      if (!order) {
        return new Response(JSON.stringify({ success: false, error: 'Order not found' }), { status: 404 });
      }

      order.status = status;
      await env.ORDERS.put(orderId, JSON.stringify(order));

      return new Response(JSON.stringify({ success: true, order }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      });
    }
  }
};
