import { db } from "../../../utils/db";

// PUT: Update food
export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Ambil ID dari URL

    if (!id) {
      return new Response(JSON.stringify({ error: "Food ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, price, image } = await request.json();

    // Validasi input
    if (!name) {
      return new Response(JSON.stringify({ error: "Food name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update data makanan berdasarkan ID
    const [result] = await db.execute(
      "UPDATE foods SET name = ?, price = ?, image = ? WHERE id = ?",
      [name, price, image, id]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Food not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        message: "Food updated successfully",
        id,
        name,
        price,
        image,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error updating food" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE: Remove food
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Ambil ID dari URL

    if (!id) {
      return new Response(JSON.stringify({ error: "Food ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hapus data makanan berdasarkan ID
    const [result] = await db.execute("DELETE FROM foods WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Food not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Food deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error deleting food" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
