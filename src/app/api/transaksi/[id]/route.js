import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request, { params }) {
    const { id } = await params;

    try {
        const { judul, nominal, tanggal, jam, catatan, bukti } = await request.json();

        if (!judul || !nominal || !tanggal || !jam) {
            return NextResponse.json({ message: 'Data yang dibutuhkan tidak lengkap' }, { status: 400 });
        }

        const client = await pool.connect();
        const queryText = `
            UPDATE transaksi 
            SET judul = $1, nominal = $2, tanggal = $3, jam = $4, catatan = $5, bukti = $6 
            WHERE id = $7 
            RETURNING *
        `;
        const values = [judul, parseFloat(nominal), tanggal, jam, catatan, bukti, id];

        const result = await client.query(queryText, values);
        client.release();

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Transaksi tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error(`Failed to update transaction ${id}:`, error);
        return NextResponse.json({ message: 'Gagal memperbarui transaksi' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        const client = await pool.connect();
        const result = await client.query('DELETE FROM transaksi WHERE id = $1 RETURNING *', [id]);
        client.release();

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Transaksi tidak ditemukan' }, { status: 404 });
        }

        return new NextResponse(null, { status: 204 }); 
    } catch (error) {
        console.error(`Failed to delete transaction ${id}:`, error);
        return NextResponse.json({ message: 'Gagal menghapus transaksi' }, { status: 500 });
    }
}