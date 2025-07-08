import { getAuthSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session) {
    return <div>Silakan login dulu</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Hai, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
