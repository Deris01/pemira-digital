import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Mencegah Next.js melakukan caching agar data yang ditarik selalu real-time
export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    // 1. Menghitung Total Hak Suara (Semua pemilih yang terdaftar)
    const totalPemilihResult = await pool.query('SELECT COUNT(*) FROM pemilih');
    const totalPemilih = parseInt(totalPemilihResult.rows[0].count);

    // 2. Menghitung Suara Masuk (Berdasarkan log di tabel suara)
    const suaraMasukResult = await pool.query('SELECT COUNT(*) FROM suara');
    const suaraMasuk = parseInt(suaraMasukResult.rows[0].count);

    // 3. Menghitung Belum Memilih
    const belumMemilih = totalPemilih - suaraMasuk;

    // 4. Mengambil data kandidat sekaligus menghitung perolehan suara masing-masing (LEFT JOIN)
    const kandidatQuery = `
      SELECT 
        k.id_kandidat, 
        k.nomor_urut, 
        k.nama_paslon, 
        COUNT(s.id_suara) as perolehan_suara
      FROM kandidat k
      LEFT JOIN suara s ON k.id_kandidat = s.id_kandidat
      GROUP BY k.id_kandidat
      ORDER BY k.nomor_urut ASC
    `;
    const kandidatResult = await pool.query(kandidatQuery);

    return NextResponse.json({
      status: 'Sukses',
      statistik: {
        totalPemilih,
        suaraMasuk,
        belumMemilih
      },
      kandidat: kandidatResult.rows
    });

  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json(
      { status: 'Error', pesan: 'Gagal mengambil data pemantauan dari database.' },
      { status: 500 }
    );
  }
}