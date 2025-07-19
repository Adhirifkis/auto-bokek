"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 flex flex-col">
      <nav className="flex justify-between items-center px-6 py-4 shadow">
        <h1 className="text-2xl font-bold text-green-600">Auto Bokek</h1>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Masuk</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-green-600 text-white hover:bg-green-700">
              Daftar
            </Button>
          </Link>
        </div>
      </nav>

      <section className="flex-1 flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 bg-[#fdf6e3]">
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Catat. Pantau.{" "}
            <span className="text-green-600">Atur Keuanganmu</span>
          </h2>
          <p className="text-gray-700 text-lg">
            Hindari bokek di akhir bulan dengan Auto Bokek. Aplikasi pencatat
            keuangan harian, budget bulanan, dan pengingat keuangan pribadi.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Link href="/register">
              <Button className="bg-green-600 text-white hover:bg-green-700">
                Mulai Gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Saya sudah punya akun</Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src="/dolar.avif"
            alt="Mockup Auto Bokek"
            width={300}
            height={600}
            className="rounded-xl shadow-card"
          />
        </div>
      </section>
      <footer className="text-center text-sm py-4 bg-black text-white">
        &copy; {new Date().getFullYear()} Auto Bokek. Semua hak dilindungi.
      </footer>
    </main>
  );
}
