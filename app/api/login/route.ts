import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    // 1. Menangkap data yang dikirim dari form Frontend
    const body = await request.json();
    const { nim, token } = body;

    // Validasi input kosong
    if (!nim || !token) {
      return NextResponse.json(
        { status: 'Gagal', pesan: 'NIM dan Token wajib diisi!' },
        { status: 400 }
      );
    }

    // 2. Mencari data pemilih di database (Mencegah SQL Injection dengan $1, $2)
    const query = 'SELECT * FROM pemilih WHERE nim_nis = $1 AND token = $2';
    const result = await pool.query(query, [nim, token]);

    // 3. Logika Validasi Pengecekan
    if (result.rows.length === 0) {
      // Jika data tidak ditemukan
      return NextResponse.json(
        { status: 'Gagal', pesan: 'NIM atau Token salah, atau Anda tidak terdaftar!' },
        { status: 401 }
      );
    }

    const pemilih = result.rows[0];

    // 4. Aturan Keamanan RPL: Validasi "Satu Akun, Satu Suara"
    if (pemilih.status_vote === 1) {
      return NextResponse.json(
        { status: 'Gagal', pesan: 'Akses ditolak! Anda sudah menggunakan hak suara sebelumnya.' },
        { status: 403 }
      );
    }

    // 5. Jika lolos semua validasi, Login Sukses
    return NextResponse.json({
      status: 'Sukses',
      pesan: 'Login berhasil! Selamat datang di Pemira Digital.',
      data: {
        id_pemilih: pemilih.id_pemilih,
        nim_nis: pemilih.nim_nis
      }
    });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { status: 'Error', pesan: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}