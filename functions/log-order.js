export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      // rename 'package' to 'pkg' here
      const { id, email, discord, platform, pkg, transferMethod, status } = await request.json();

      if (!id || !email) {
        return new Response(JSON.stringify({ success: false, error: 'Missing id or email' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        });
      }

      // keep the object key as 'package', value comes from 'pkg'
      const order = {
        id,
        email,
        discord: discord || '',
        platform: platform || '',
        package: pkg || '',   // <-- renamed variable
        transferMethod: transferMethod || '',
        status: status || 'paid',
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
