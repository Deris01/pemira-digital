"use client"; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [daftarKandidat, setDaftarKandidat] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKandidat = async () => {
      try {
        const res = await fetch('/api/kandidat');
        const result = await res.json();
        
        if (result.status === 'Sukses') {
          setDaftarKandidat(result.data); 
        }
      } catch (error) {
        console.error("Gagal mengambil data", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchKandidat();
  }, []);

  const handleLogout = () => {
    alert("Anda berhasil keluar.");
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="font-extrabold text-xl text-blue-600">PEMIRA DIGITAL</h1>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 mt-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800">Surat Suara Digital</h2>
          <p className="text-slate-500 mt-2">Pilih salah satu kandidat Ketua BEM / OSIS terbaik menurut Anda.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-slate-500 font-bold animate-pulse">Mengambil data kandidat dari server...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {daftarKandidat.map((kandidat) => (
              <div key={kandidat.id_kandidat} className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                
                {/* LOGIKA MENAMPILKAN FOTO */}
                {kandidat.foto ? (
                  <img 
                    src={kandidat.foto} 
                    alt={`Foto ${kandidat.nama_paslon}`} 
                    className="w-full h-64 object-cover object-top"
                  />
                ) : (
                  <div className="bg-slate-200 h-64 flex flex-col justify-center items-center text-slate-400">
                    <span className="text-6xl font-black text-slate-300 mb-2">0{kandidat.nomor_urut}</span>
                    <span>(Area Foto Paslon)</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-slate-800">{kandidat.nama_paslon}</h3>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-700 uppercase mb-2">Visi & Misi:</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      "{kandidat.visi_misi}"
                    </p>
                  </div>

                  <button 
                    onClick={async () => {
                      const confirmVote = confirm("Apakah Anda yakin dengan pilihan ini?");
                      if (confirmVote) {
                        const res = await fetch('/api/vote', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id_pemilih: 1, id_kandidat: kandidat.id_kandidat }),
                        });
                        const data = await res.json();
                        alert(data.pesan);
                        if (data.status === 'Sukses') window.location.reload();
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md flex justify-center items-center gap-2"
                  >
                    PILIH PASLON 0{kandidat.nomor_urut}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}