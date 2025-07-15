import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        // Pastikan nama kolom di query SELECT sesuai dengan database
        const result = await client.query('SELECT id, judul, nominal, tanggal, jam, catatan, bukti, created_at FROM transaksi ORDER BY tanggal DESC, jam DESC');
        client.release();
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return NextResponse.json({ message: 'Gagal mengambil data transaksi' }, { status: 500 });
    }
}

// ... (fungsi GET Anda ada di sini)

export async function POST(request) {
    try {
        const { judul, nominal, tanggal, jam, catatan, bukti } = await request.json();

        if (!judul || !nominal || !tanggal || !jam) {
            return NextResponse.json({ message: 'Data yang dibutuhkan tidak lengkap' }, { status: 400 });
        }

        const client = await pool.connect();

        // PASTIKAN URUTAN KOLOM DI SINI...
        const queryText = 'INSERT INTO transaksi(judul, nominal, tanggal, jam, catatan, bukti) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

        // ...SAMA PERSIS DENGAN URUTAN VARIABEL DI SINI
        const values = [judul, parseFloat(nominal), tanggal, jam, catatan, bukti];

        const result = await client.query(queryText, values);
        client.release();

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        // Log error yang lebih detail untuk debugging
        console.error('Failed to create transaction:', error);
        return NextResponse.json({ message: 'Gagal membuat transaksi baru', error: error.message }, { status: 500 });
    }
}