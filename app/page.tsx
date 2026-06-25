"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  const [nim, setNim] = useState('');
  const [token, setToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nim, token }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.pesan);
        router.push('/dashboard');
      } else {
        setErrorMsg(data.pesan);
      }
    } catch (error) {
      setErrorMsg('Terjadi kesalahan jaringan. Cek koneksi internetmu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // WARNA BACKGROUND DIPERTEGAS: dari blue-100 diubah menjadi blue-300, via indigo-100
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300 via-indigo-100 to-white px-4 relative overflow-hidden">
      
      {/* ORNAMEN ABSTRAK DIPERTEGAS: Warna dinaikkan ke 400 dan Opacity dinaikkan jadi 60% */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      <div className="absolute -bottom-8 left-20 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

      {/* Card Login Premium */}
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md border border-white relative z-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 mb-4 shadow-lg shadow-blue-500/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 mb-2">PEMIRA DIGITAL</h1>
          <p className="text-slate-600 text-sm font-medium">
            Sistem E-Voting yang Aman & Transparan
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-slate-700 text-sm font-bold ml-1" htmlFor="nim">
              Nomor Induk (NIM / NIS)
            </label>
            <input 
              id="nim"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 font-medium text-slate-800 placeholder-slate-400 shadow-sm" 
              type="text" 
              placeholder="Masukkan nomor induk Anda" 
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-700 text-sm font-bold ml-1" htmlFor="token">
              Token Keamanan
            </label>
            <input 
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 font-medium text-slate-800 placeholder-slate-400 shadow-sm" 
              type="password" 
              placeholder="Masukkan token rahasia" 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white font-bold py-4 px-4 rounded-2xl transition-all duration-300 flex justify-center items-center gap-2 ${
              isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/40 hover:shadow-blue-600/50 transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? 'Memverifikasi...' : 'Masuk & Berikan Suara'}
          </button>
        </form>

      </div>
    </div>
  );
}