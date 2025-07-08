import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return Response.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: "credentials",
      },
    });

    return Response.json(
      { message: "Registrasi berhasil", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
