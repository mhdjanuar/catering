// app/api/foods/route.js
import { db } from "../../utils/db";

export async function GET() {
  try {
    const [rows] = await db.execute("SELECT * FROM foods");
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
    const { name, price, image } = await request.json(); // Get data from the request body

    // Validate that the name is provided
    if (!name) {
      return new Response(JSON.stringify({ error: "Food name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert data into the database
    const [result] = await db.execute(
      "INSERT INTO foods (name, price, image) VALUES (?, ?, ?)",
      [name, price, image]
    );

    return new Response(
      JSON.stringify({ id: result.insertId, name, price, image }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error inserting food" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
