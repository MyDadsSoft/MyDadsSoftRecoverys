export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method Not Allowed" }), {
        headers: { "Content-Type": "application/json" },
        status: 405,
      });
    }

    try {
      if (!request.headers.get("content-type")?.includes("application/json")) {
        return new Response(JSON.stringify({ success: false, error: "Invalid content type" }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      const data = await request.json();
      const id = data.id || data.orderId;

      if (!id || !data.email) {
        return new Response(JSON.stringify({ success: false, error: "Missing id or email" }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      const order = {
        id,
        email: data.email,
        discord: data.discord || "",
        platform: data.platform || "",
        pkg: data.pkg || "",
        transferMethod: data.transferMethod || "",
        status: data.status || "pending",
        created: Date.now(),
      };

      await env.ORDERS.put(id, JSON.stringify(order));

      return new Response(JSON.stringify({ success: true, order }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  },
};
