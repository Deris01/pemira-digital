import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { id_pemilih, id_kandidat } = await request.json();

    // 1. Memulai transaksi database agar data konsisten
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 2. Cek apakah pemilih sudah pernah memilih
      const checkStatus = await client.query(
        'SELECT status_vote FROM pemilih WHERE id_pemilih = $1 FOR UPDATE',
        [id_pemilih]
      );

      if (checkStatus.rows[0].status_vote === 1) {
        throw new Error('Anda sudah menggunakan hak suara!');
      }

      // 3. Merekam suara ke tabel suara
      await client.query(
        'INSERT INTO suara (id_kandidat) VALUES ($1)',
        [id_kandidat]
      );

      // 4. Mengunci akun pemilih (status_vote menjadi 1)
      await client.query(
        'UPDATE pemilih SET status_vote = 1 WHERE id_pemilih = $1',
        [id_pemilih]
      );

      await client.query('COMMIT'); // Simpan semua perubahan

      return NextResponse.json({ status: 'Sukses', pesan: 'Terima kasih, suara Anda telah direkam!' });
    } catch (error: any) {
      await client.query('ROLLBACK'); // Batalkan jika ada error
      return NextResponse.json({ status: 'Gagal', pesan: error.message }, { status: 400 });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ status: 'Error', pesan: 'Terjadi kesalahan sistem.' }, { status: 500 });
  }
}