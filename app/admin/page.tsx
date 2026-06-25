"use client";

import React, { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [statistik, setStatistik] = useState({ totalPemilih: 0, suaraMasuk: 0, belumMemilih: 0 });
  const [daftarKandidat, setDaftarKandidat] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // STATE FORM & MODE EDIT
  const [formKandidat, setFormKandidat] = useState({ nomor_urut: '', nama_paslon: '', visi_misi: '', foto: '' });
  const [editId, setEditId] = useState<number | null>(null); // Menyimpan ID kandidat yang sedang diedit

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

  // FUNGSI SIMPAN (Bisa Tambah Baru atau Edit)
  const simpanKandidat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Jika editId ada isinya, panggil PUT. Jika kosong, panggil POST.
      const method = editId ? 'PUT' : 'POST';
      const bodyData = editId ? { ...formKandidat, id_kandidat: editId } : formKandidat;

      const res = await fetch('/api/admin', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      
      if (data.status === 'Sukses') {
        alert(editId ? 'Kandidat berhasil diperbarui!' : 'Kandidat baru berhasil ditambahkan!');
        batalkanEdit(); // Kosongkan form dan reset mode
        fetchAdminData();
      } else {
        alert('Gagal menyimpan data.');
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
    }
  };

  // FUNGSI SAAT TOMBOL EDIT DIKLIK
  const klikEdit = (kandidat: any) => {
    setFormKandidat({
      nomor_urut: kandidat.nomor_urut,
      nama_paslon: kandidat.nama_paslon,
      visi_misi: kandidat.visi_misi,
      foto: kandidat.foto || ''
    });
    setEditId(kandidat.id_kandidat); // Aktifkan mode edit
  };

  // FUNGSI BATAL EDIT
  const batalkanEdit = () => {
    setFormKandidat({ nomor_urut: '', nama_paslon: '', visi_misi: '', foto: '' });
    setEditId(null);
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
          if (editId === id) batalkanEdit(); // Batal edit jika yang dihapus sedang diedit
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
        {/* DAFTAR KANDIDAT */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Kelola Kandidat</h3>
          <div className="space-y-4">
            {daftarKandidat.length === 0 ? (
              <p className="text-slate-400 italic">Belum ada kandidat terdaftar.</p>
            ) : (
              daftarKandidat.map((k) => (
                <div key={k.id_kandidat} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-4">
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
                  
                  <div className="flex gap-2">
                    {/* TOMBOL EDIT BARU */}
                    <button 
                      onClick={() => klikEdit(k)}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Edit
                    </button>
                    {/* TOMBOL HAPUS */}
                    <button 
                      onClick={() => hapusKandidat(k.id_kandidat)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FORM TAMBAH / EDIT KANDIDAT */}
        <div className={`bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all duration-300 ${editId ? 'ring-4 ring-yellow-400/30' : ''}`}>
          {/* Tanda Mode Edit */}
          {editId && (
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-bl-lg">
              MODE EDIT AKTIF
            </div>
          )}

          <h3 className="text-xl font-bold text-slate-800 mb-6">
            {editId ? 'Perbarui Data Paslon' : 'Tambah Paslon Baru'}
          </h3>
          
          <form onSubmit={simpanKandidat} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nomor Urut</label>
              <input 
                type="number" 
                required 
                value={formKandidat.nomor_urut} 
                onChange={(e) => setFormKandidat({...formKandidat, nomor_urut: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
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
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Link Foto (atau nama file)</label>
              <input 
                type="text" 
                value={formKandidat.foto} 
                onChange={(e) => setFormKandidat({...formKandidat, foto: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Visi & Misi</label>
              <textarea 
                required 
                value={formKandidat.visi_misi} 
                onChange={(e) => setFormKandidat({...formKandidat, visi_misi: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                rows={3}
              ></textarea>
            </div>
            
            <div className="flex gap-4">
              <button 
                type="submit" 
                className={`flex-1 text-white font-bold py-4 rounded-xl transition-colors duration-300 shadow-md ${editId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-slate-800 hover:bg-blue-600'}`}
              >
                {editId ? 'Update Database' : '+ Simpan ke Database'}
              </button>
              
              {/* Tombol Batal Muncul Jika Sedang Edit */}
              {editId && (
                <button 
                  type="button" 
                  onClick={batalkanEdit}
                  className="px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors duration-300"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}