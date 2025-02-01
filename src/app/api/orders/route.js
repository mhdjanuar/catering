import { db } from "../../utils/db";

export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT o.id, o.name as customer_name, f.name as food_name, o.qty, o.phone, o.address, o.status FROM orders as o INNER JOIN foods as f ON o.food_id = f.id"
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

export async function POST(request) {
  try {
    const { name, phone, address, notes, id, qty, status } =
      await request.json(); // Get data from the request body

    // Insert data into the database
    const [result] = await db.execute(
      "INSERT INTO orders (food_id, notes, name, phone, address, qty, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, notes, name, phone, address, qty, status]
    );

    return new Response(
      JSON.stringify({ id: result.insertId, name, phone, address }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.log(error);

    return new Response(JSON.stringify({ error: "Error inserting orders" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
