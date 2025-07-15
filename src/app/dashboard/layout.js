import { getSession } from "@/services/session";
import { logoutUser } from "../action";

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF6E3] text-gray-800">
      <header className="bg-black text-white p-4 shadow-md flex justify-between items-center">
        <div className="text-xl font-bold">AutoBokek</div>
        <div className="flex items-center gap-4 text-sm">
          <span>
            Halo, <span className="font-semibold">{session.user.name}</span>
          </span>
          <form action={logoutUser}>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>

      <footer className="bg-black text-white p-4 text-center text-sm">
        &copy; {new Date().getFullYear()} AutoBokek. All rights reserved.
      </footer>
    </div>
  );
}
