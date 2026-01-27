import { getDashboardStats } from "@/actions/dashboard/DashboardActions";
import { Dashboard } from "@/features/dashboard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  return <Dashboard initialStats={stats} />;
}
