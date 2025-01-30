import mysql from "mysql2/promise";

// Buat koneksi ke database
export const db = mysql.createPool({
  host: "sql12.freesqldatabase.com", // Host database
  user: "sql12760294", // Username
  password: "7XBnUEBHwp", // Password
  database: "sql12760294", // Nama database
});
