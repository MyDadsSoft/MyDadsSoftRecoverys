export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const { id, email, discord, platform, package, transferMethod, status } = await request.json();

      if (!id || !email) {
        return new Response(JSON.stringify({ success: false, error: 'Missing id or email' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const order = {
        id, // unique ID, you can generate manually or via frontend
        email,
        discord: discord || '',
        platform: platform || '',
        package: package || '',
        transferMethod: transferMethod || '',
        status: status || 'paid', // default status is paid
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
