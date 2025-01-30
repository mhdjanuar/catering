import { db } from "../../../utils/db";

// PUT: Update order status
export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Extract ID from URL

    if (!id) {
      return new Response(JSON.stringify({ error: "Order ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { status } = await request.json();

    // Validate input
    if (!status) {
      return new Response(JSON.stringify({ error: "Status is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update order status in the database
    const [result] = await db.execute(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        message: "Order status updated successfully",
        id,
        status,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error updating order status" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
