import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Menghindari caching statis dari Next.js agar data selalu update
export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    // Mengambil semua data dari tabel kandidat dan mengurutkannya berdasarkan nomor urut
    const query = 'SELECT * FROM kandidat ORDER BY nomor_urut ASC';
    const result = await pool.query(query);

    return NextResponse.json({
      status: 'Sukses',
      data: result.rows
    });
  } catch (error) {
    console.error("API Kandidat Error:", error);
    return NextResponse.json(
      { status: 'Error', pesan: 'Gagal mengambil data kandidat dari database.' },
      { status: 500 }
    );
  }
}