// app/api/auth/login.js
export async function POST(request) {
  const { username, password } = await request.json();

  // Check username and password (simplified, use real authentication logic)
  if (username === "admin" && password === "admin") {
    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Invalid credentials" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
