"use client";

import React, { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [statistik, setStatistik] = useState({ totalPemilih: 0, suaraMasuk: 0, belumMemilih: 0 });
  const [daftarKandidat, setDaftarKandidat] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin');
      const result = await res.json();
      
      if (result.status === 'Sukses') {
        setStatistik(result.statistik);
        setDaftarKandidat(result.kandidat);
      }
    } catch (error) {
      console.error("Gagal mengambil data admin", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mengambil data saat halaman pertama kali dimuat
  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-extrabold text-blue-400 mb-8">PANITIA PEMIRA</h1>
        <nav className="flex flex-col gap-4 flex-grow">
          <a href="#" className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold transition">Dashboard Hasil</a>
        </nav>
        <button className="mt-8 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-bold transition w-full">
          Logout Admin
        </button>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Dashboard Pemantauan</h2>
            <p className="text-slate-500 mt-1">Pantau perolehan suara secara real-time.</p>
          </div>
          <button 
            onClick={fetchAdminData} 
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold transition flex items-center gap-2"
          >
            Refresh Data
          </button>
        </header>

        {isLoading ? (
          <p className="text-center text-slate-500 font-bold animate-pulse mt-20">Memuat data dari server...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm font-bold uppercase mb-1">Total Hak Suara</p>
                <p className="text-4xl font-black text-slate-800">{statistik.totalPemilih}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                <p className="text-slate-500 text-sm font-bold uppercase mb-1">Suara Masuk</p>
                <p className="text-4xl font-black text-blue-600">{statistik.suaraMasuk}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
                <p className="text-slate-500 text-sm font-bold uppercase mb-1">Belum Memilih</p>
                <p className="text-4xl font-black text-red-500">{statistik.belumMemilih}</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Perolehan Suara Sementara</h3>
              <div className="space-y-6">
                {daftarKandidat.map((kandidat) => {
                  const perolehan = parseInt(kandidat.perolehan_suara);
                  const persentase = statistik.suaraMasuk === 0 ? 0 : Math.round((perolehan / statistik.suaraMasuk) * 100);
                  
                  return (
                    <div key={kandidat.id_kandidat}>
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-bold text-slate-700">0{kandidat.nomor_urut} - {kandidat.nama_paslon}</span>
                        <span className="font-black text-blue-600 text-xl">{perolehan} <span className="text-sm text-slate-500 font-medium">suara ({persentase}%)</span></span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                        <div className="bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${persentase}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}