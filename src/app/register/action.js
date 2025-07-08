"use client";

export async function registerUser({ name, email, password }) {
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Registrasi gagal");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Terjadi kesalahan");
  }
}
