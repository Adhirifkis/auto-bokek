import { prisma } from '@/lib/prisma';
import { getAuthSession } from "@/lib/auth";
import Link from 'next/link';
import TransactionChart from '@/components/TransactionChart'; 

const formatRupiah = (nominal) => {
  const numberAmount = Math.abs(parseFloat(nominal));
  if (isNaN(numberAmount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numberAmount);
};

const processDataForChart = (transactions) => {
  const grouped = transactions.reduce((acc, trx) => {
    if (!trx.kategori) return acc;

    const date = new Date(trx.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    if (!acc[date]) {
      acc[date] = { Pemasukan: 0, Pengeluaran: 0 };
    }

    if (trx.kategori.tipe.toUpperCase() === 'PEMASUKAN') {
      acc[date].Pemasukan += parseFloat(trx.nominal);
    } else {
      acc[date].Pengeluaran += Math.abs(parseFloat(trx.nominal));
    }
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([dateKey, values]) => {
      const [day, monthStr] = dateKey.split(' ');
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].indexOf(monthStr);
      const sortableDate = new Date(new Date().getFullYear(), monthIndex, parseInt(day));
      return {
        tanggal: dateKey,
        ...values,
        sortableDate: sortableDate
      };
    })
    .sort((a, b) => a.sortableDate - b.sortableDate)
    .map(({ ...rest }) => rest);
};

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return (
      <div className="text-center p-8">
        <p>Silakan login dulu untuk melihat data.</p>
        <Link href="/login" className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const allTransactionsForChart = await prisma.Transaction.findMany({
    where: {
      user_id: session.user.id,
      tanggal: {
        gte: thirtyDaysAgo,
      },
    },
    include: { kategori: true },
    orderBy: { tanggal: 'asc' },
  });

  const chartData = processDataForChart(allTransactionsForChart);

  const recentTransactions = allTransactionsForChart
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-lg text-gray-600 mb-6">Hai, {session.user.name}</p>

      <div className="mb-8">
        <Link href="/transaksi" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-semibold shadow-md transition-transform transform hover:scale-105">
          Tambah Transaksi
        </Link>
      </div>

      <TransactionChart data={chartData} />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Transaksi Terakhir</h2>
        <ul className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map(trx => (
              <li key={trx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-800">{trx.judul}</p>
                  <p className="text-sm text-gray-500">{trx.kategori.name_kategori}</p>
                </div>
                <span className={`font-bold ${trx.kategori.tipe.toUpperCase() === 'PEMASUKAN' ? 'text-green-600' : 'text-red-600'}`}>
                  {trx.kategori.tipe.toUpperCase() === 'PENGELUARAN' && '- '}
                  {formatRupiah(trx.nominal)}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Belum ada transaksi.</p>
          )}
        </ul>
      </div>
    </div>
  );
}