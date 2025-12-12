export default {
  async fetch(request, env) {
    try {
      const list = await env.ORDERS.list();
      const orders = [];

      for (const key of list.keys) {
        const order = await env.ORDERS.get(key.name, { type: 'json' });
        orders.push(order);
      }

      return new Response(JSON.stringify(orders), {
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
