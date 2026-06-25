import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Menampilkan Data
export async function GET() {
  try {
    const totalPemilihResult = await pool.query('SELECT COUNT(*) FROM pemilih');
    const totalPemilih = parseInt(totalPemilihResult.rows[0].count);

    const suaraMasukResult = await pool.query('SELECT COUNT(*) FROM suara');
    const suaraMasuk = parseInt(suaraMasukResult.rows[0].count);

    const belumMemilih = totalPemilih - suaraMasuk;

    // BUG FIXED: Menambahkan k.visi_misi ke dalam perintah SELECT
    const kandidatQuery = `
      SELECT k.id_kandidat, k.nomor_urut, k.nama_paslon, k.visi_misi, k.foto, COUNT(s.id_suara) as perolehan_suara
      FROM kandidat k
      LEFT JOIN suara s ON k.id_kandidat = s.id_kandidat
      GROUP BY k.id_kandidat
      ORDER BY k.nomor_urut ASC
    `;
    const kandidatResult = await pool.query(kandidatQuery);

    return NextResponse.json({
      status: 'Sukses',
      statistik: { totalPemilih, suaraMasuk, belumMemilih },
      kandidat: kandidatResult.rows
    });
  } catch (error) {
    return NextResponse.json({ status: 'Error', pesan: 'Gagal mengambil data.' }, { status: 500 });
  }
}

// POST: Menambah Kandidat Baru
export async function POST(request: Request) {
  try {
    const { nomor_urut, nama_paslon, visi_misi, foto } = await request.json();
    await pool.query(
      'INSERT INTO kandidat (nomor_urut, nama_paslon, visi_misi, foto) VALUES ($1, $2, $3, $4)', 
      [nomor_urut, nama_paslon, visi_misi, foto]
    );
    return NextResponse.json({ status: 'Sukses' });
  } catch (error) {
    return NextResponse.json({ status: 'Error', pesan: 'Gagal menambah.' }, { status: 500 });
  }
}

// PUT: Mengedit/Update Kandidat
export async function PUT(request: Request) {
  try {
    const { id_kandidat, nomor_urut, nama_paslon, visi_misi, foto } = await request.json();
    await pool.query(
      'UPDATE kandidat SET nomor_urut = $1, nama_paslon = $2, visi_misi = $3, foto = $4 WHERE id_kandidat = $5',
      [nomor_urut, nama_paslon, visi_misi, foto, id_kandidat]
    );
    return NextResponse.json({ status: 'Sukses' });
  } catch (error) {
    return NextResponse.json({ status: 'Error', pesan: 'Gagal mengupdate.' }, { status: 500 });
  }
}

// DELETE: Menghapus Kandidat
export async function DELETE(request: Request) {
  try {
    const { id_kandidat } = await request.json();
    await pool.query('DELETE FROM kandidat WHERE id_kandidat = $1', [id_kandidat]);
    return NextResponse.json({ status: 'Sukses' });
  } catch (error) {
    return NextResponse.json({ status: 'Error', pesan: 'Gagal menghapus.' }, { status: 500 });
  }
}