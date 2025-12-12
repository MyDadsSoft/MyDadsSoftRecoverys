export default {
  async fetch(request, env) {
    // Allow only POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 405
      });
    }

    try {
      // Extract data from request
      const { id, email, discord, platform, pkg, transferMethod, status } = await request.json();

      if (!id || !email) {
        return new Response(JSON.stringify({ success: false, error: 'Missing id or email' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        });
      }

      // Build order object
      const order = {
        id,
        email,
        discord: discord || '',
        platform: platform || '',
        package: pkg || '', // note: object key stays 'package'
        transferMethod: transferMethod || '',
        status: status || 'pending',
        created: Date.now()
      };

      // Save to KV
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
