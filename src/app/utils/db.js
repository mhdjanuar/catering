import mysql from "mysql2/promise";

// Buat koneksi ke database
export const db = mysql.createPool({
  host: "sql12.freesqldatabase.com", // Host database
  user: "sql12763898", // Username
  password: "BaUVXwzECe", // Password
  database: "sql12763898", // Nama database
});
