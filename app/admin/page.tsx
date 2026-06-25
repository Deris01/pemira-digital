"use client";

import React, { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [statistik, setStatistik] = useState({ totalPemilih: 0, suaraMasuk: 0, belumMemilih: 0 });
  const [daftarKandidat, setDaftarKandidat] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // STATE DIPERBARUI: Sekarang memiliki "foto"
  const [formKandidat, setFormKandidat] = useState({ nomor_urut: '', nama_paslon: '', visi_misi: '', foto: '' });

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin');
      const result = await res.json();
      
      if (result.status === 'Sukses') {
        setStatistik(result.statistik);
        setDaftarKandidat(result.kandidat || []);
      }
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const tambahKandidat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formKandidat),
      });
      const data = await res.json();
      
      if (data.status === 'Sukses') {
        alert('Mantap! Kandidat baru berhasil ditambahkan!');
        // KOSONGKAN FORM SETELAH SUKSES
        setFormKandidat({ nomor_urut: '', nama_paslon: '', visi_misi: '', foto: '' }); 
        fetchAdminData();
      } else {
        alert('Gagal menambah kandidat.');
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
    }
  };

  const hapusKandidat = async (id: number) => {
    if (confirm("AWAS! Yakin ingin menghapus kandidat ini? Semua perolehan suaranya juga akan ikut terhapus!")) {
      try {
        const res = await fetch('/api/admin', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_kandidat: id }),
        });
        const data = await res.json();
        
        if (data.status === 'Sukses') {
          alert('Kandidat berhasil dihapus!');
          fetchAdminData();
        }
      } catch (error) {
        alert('Terjadi kesalahan jaringan.');
      }
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Memuat data Admin...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-8">DASHBOARD PANITIA</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Total Hak Suara</p>
          <p className="text-5xl font-black text-slate-800 mt-2">{statistik?.totalPemilih || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-blue-500">
          <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Suara Masuk</p>
          <p className="text-5xl font-black text-blue-600 mt-2">{statistik?.suaraMasuk || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-red-500">
          <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Belum Memilih</p>
          <p className="text-5xl font-black text-red-500 mt-2">{statistik?.belumMemilih || 0}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Kelola Kandidat</h3>
          <div className="space-y-4">
            {daftarKandidat.length === 0 ? (
              <p className="text-slate-400 italic">Belum ada kandidat terdaftar.</p>
            ) : (
              daftarKandidat.map((k) => (
                <div key={k.id_kandidat} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {/* Tampilkan thumbnail foto kecil jika ada */}
                    {k.foto ? (
                      <img src={k.foto} alt="foto paslon" className="w-12 h-12 object-cover rounded-full shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-400">No Pic</div>
                    )}
                    <div>
                      <span className="font-bold text-slate-800 block text-lg">{k.nomor_urut}. {k.nama_paslon}</span>
                      <span className="text-sm font-bold text-blue-600">{k.perolehan_suara} Suara Terkumpul</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => hapusKandidat(k.id_kandidat)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Tambah Paslon Baru</h3>
          
          <form onSubmit={tambahKandidat} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nomor Urut</label>
              <input 
                type="number" 
                required 
                value={formKandidat.nomor_urut} 
                onChange={(e) => setFormKandidat({...formKandidat, nomor_urut: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                placeholder="Contoh: 3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap Paslon</label>
              <input 
                type="text" 
                required 
                value={formKandidat.nama_paslon} 
                onChange={(e) => setFormKandidat({...formKandidat, nama_paslon: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                placeholder="Contoh: Joko & Widodo"
              />
            </div>

            {/* FORM INPUT FOTO BARU */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Link Foto (atau nama file)</label>
              <input 
                type="text" 
                value={formKandidat.foto} 
                onChange={(e) => setFormKandidat({...formKandidat, foto: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                placeholder="Contoh: /paslon3.jpg atau Link Unsplash"
              />
              <p className="text-xs text-slate-500 mt-1">*Masukkan file foto ke folder public, lalu ketik namanya disini (misal: /foto.png)</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Visi & Misi</label>
              <textarea 
                required 
                value={formKandidat.visi_misi} 
                onChange={(e) => setFormKandidat({...formKandidat, visi_misi: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                rows={3}
                placeholder="Deskripsikan visi dan misi paslon..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-slate-800 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors duration-300 shadow-md"
            >
              + Simpan ke Database
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}