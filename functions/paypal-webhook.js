export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const data = await request.json();

      // Example PayPal order object
      const order = {
        id: data.id,                 // PayPal order ID
        email: data.email,
        discord: data.discord,
        platform: data.platform,
        package: data.package,
        transferMethod: data.transferMethod,
        status: 'paid',
        created: Date.now()
      };

      await env.ORDERS.put(order.id, JSON.stringify(order));

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
