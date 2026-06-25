import { Pool } from 'pg';

// Membuat antrean koneksi ke database menggunakan kredensial dari file .env.local
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;