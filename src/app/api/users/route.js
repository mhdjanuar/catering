// app/api/foods/route.js
import { db } from "../../utils/db";

export async function GET() {
  try {
    const [rows] = await db.execute("SELECT * FROM users");
    return new Response(JSON.stringify(rows), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
