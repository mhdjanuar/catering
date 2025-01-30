import mysql from "mysql2/promise";

// Buat koneksi ke database
export const db = mysql.createPool({
  host: "localhost", // Host database
  user: "root", // Username
  password: "", // Password
  database: "catering", // Nama database
});
