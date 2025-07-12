"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function registerUser(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { message: "Email sudah terdaftar" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: "credentials",
      },
    });

    return { message: "Registrasi berhasil!" };
  } catch (error) {
    console.error("Register error:", error);
    return { message: "Terjadi kesalahan saat register" };
  }
}

export async function loginUser(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: "Email tidak ditemukan" };

    const match = await bcrypt.compare(password, user.password);
    if (!match) return { message: "Password salah" };

    return { message: "Login berhasil", redirect: "/dashboard" };
  } catch (err) {
    return { message: "Gagal login" };
  }
}
