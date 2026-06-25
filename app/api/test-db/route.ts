import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Mencoba mengambil waktu saat ini dari database server Neon
    const result = await pool.query('SELECT NOW()');
    
    return NextResponse.json({
      status: 'Sukses',
      pesan: 'Halo anak RPL! Koneksi database ke Neon berhasil 100%!',
      waktu_server_database: result.rows[0].now
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { status: 'Gagal', pesan: 'Waduh, koneksi database terputus atau URL salah.' },
      { status: 500 }
    );
  }
}