"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/services/session";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerUser(statusMessage, formData) {
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

export async function loginUser(statusMessage, formData) {
  const cookieStore = cookies();
  const email = formData.get("email");
  const password = formData.get("password");

  let user = null;

  try {
    user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
  } catch (error) {
    console.log("Error saat mencari user:", error);
    return {
      message: "Terjadi kesalahan saat mencari user",
    };
  }

  if (!user) {
    console.log("User tidak ditemukan");
    return {
      message: "Email tidak ditemukan",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log("Password tidak cocok");
    return {
      message: "Password salah",
    };
  }

  const newSession = await prisma.session.create({
    data: {
      userId: user.id,
    },
  });

  cookieStore.set("sessionId", newSession.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    expires: 1000 * 60 * 60 * 24,
  });
  redirect("/dashboard");
}

export async function logoutUser(formDatas) {
  const cookieStore = cookies();
  const session = await getSession();

  await prisma.session.delete({
    where: {
      id: session.id,
    },
  });

  cookieStore.delete("sessionId");
  redirect("/");
}
