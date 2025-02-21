import { db } from "../../utils/db";

export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT o.id, o.name as customer_name, f.name as food_name, o.qty, o.phone, o.address, o.status FROM orders as o INNER JOIN foods as f ON o.food_id = f.id where o.status = 'approved'"
    );
    return new Response(JSON.stringify(rows), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching foods" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
