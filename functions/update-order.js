export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const { orderId, status } = await request.json();

      if (!orderId || !status) {
        return new Response(JSON.stringify({ success: false, error: 'Missing orderId or status' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        });
      }

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
