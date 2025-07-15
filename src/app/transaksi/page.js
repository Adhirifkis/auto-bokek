'use client';

import { useState, useEffect, useRef } from 'react';

const formatRupiah = (nominal) => {
  const numberAmount = typeof nominal === 'string' ? parseFloat(nominal) : nominal;
  if (isNaN(numberAmount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numberAmount);
};

export default function Home() {
  const [transaksi, settransaksi] = useState([]);
  const [formData, setFormData] = useState({ judul: '', nominal: '', tanggal: '', jam: '', catatan: '', bukti: '' });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buktiUrl, setBuktiUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchtransaksi = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/transaksi');
      const data = await res.json();
      settransaksi(data);
    } catch (error) {
      console.error("Gagal mengambil transaksi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchtransaksi();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `/api/transaksi/${editingId}` : '/api/transaksi';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const dataToSubmit = {
        ...formData,
        bukti: buktiUrl 
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (!res.ok) throw new Error('Operasi gagal');

      setFormData({ judul: '', nominal: '', tanggal: '', jam: '', catatan: '', bukti: '' });
      setEditingId(null);
      setBuktiUrl('');

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      await fetchtransaksi();

    } catch (error) {
      console.error("Error saat submit:", error);
    }
  };

  const handleEdit = (transaction) => {
    window.scrollTo(0, 0);
    setEditingId(transaction.id);
    const formattedDate = new Date(transaction.tanggal).toISOString().split('T')[0];
    setFormData({
      judul: transaction.judul,
      nominal: transaction.nominal,
      tanggal: formattedDate,
      jam: transaction.jam,
      catatan: transaction.catatan,
    });
    setBuktiUrl(transaction.bukti || '');
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        const res = await fetch(`/api/transaksi/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Gagal menghapus');
        await fetchtransaksi();
      } catch (error) {
        console.error("Error saat menghapus:", error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ judul: '', nominal: '', tanggal: '', jam: '', catatan: '' });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSizeInBytes = 2 * 1024 * 1024; 

    if (!allowedTypes.includes(file.type)) {
      alert('Error: Hanya file dengan format JPG atau PNG yang diizinkan!');
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      return;
    }

    if (file.size > maxSizeInBytes) {
      alert('Error: Ukuran file maksimal adalah 2MB!');
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      return;
    }

    setIsUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });

      if (!res.ok) throw new Error('Gagal mendapatkan URL upload.');

      const { uploadUrl, publicFileUrl } = await res.json();

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadRes.ok) throw new Error('Upload ke R2 gagal.');

      setBuktiUrl(publicFileUrl);
      console.log('File berhasil diupload:', publicFileUrl);

    } catch (error) {
      console.error(error);
      alert('Upload file gagal!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Catatan Keuangan 📝</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">{editingId ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="judul" value={formData.judul} onChange={handleInputChange} placeholder="Judul" required className="p-3 border rounded-md" />
          <input type="number" name="nominal" value={formData.nominal} onChange={handleInputChange} placeholder="Nominal" required className="p-3 border rounded-md" />
          <input type="date" name="tanggal" value={formData.tanggal} onChange={handleInputChange} required className="p-3 border rounded-md" />
          <input type="time" name="jam" value={formData.jam} onChange={handleInputChange} required className="p-3 border rounded-md" />
          <textarea name="catatan" value={formData.catatan} onChange={handleInputChange} placeholder="Catatan (opsional)" className="p-3 border rounded-md md:col-span-2"></textarea>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
            ref={fileInputRef}
            accept="image/png, image/jpg"
            className="p-3 border rounded-md md:col-span-2"
          />
          {isUploading && <p>Mengupload...</p>}
          {buktiUrl && <p>Upload sukses: <a href={buktiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">Lihat Bukti</a></p>}
          <div className="md:col-span-2 flex items-center gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-semibold">
              {editingId ? 'Update Transaksi' : 'Simpan Transaksi'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 font-semibold">
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Daftar Transaksi</h2>
        {isLoading ? (<p className="text-center text-gray-500">Memuat data...</p>) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left font-semibold text-gray-600">Judul</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Nominal</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Tanggal & Jam</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transaksi.length > 0 ? transaksi.map(t => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <p className="font-medium text-gray-800">{t.judul}</p>
                      <p className="text-sm text-gray-500">{t.catatan}</p>
                    </td>
                    <td className={`p-3 font-bold ${parseFloat(t.nominal) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatRupiah(t.nominal)}</td>
                    <td className="p-3 text-sm text-gray-700">
                      {new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      <span className="text-gray-500 block">{t.jam}</span>
                    </td>
                    <td className="p-3 flex gap-2 items-center">
                      <button onClick={() => handleEdit(t)} className="bg-yellow-400 text-white px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Hapus</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center p-4 text-gray-500">Belum ada transaksi.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}