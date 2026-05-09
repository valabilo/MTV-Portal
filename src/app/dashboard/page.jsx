import DashboardHub from "@/components/dashboard/DashboardHub";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DASHBOARD_SESSION_COOKIE,
  verifyDashboardSession,
} from "@/lib/dashboardAuth";

export const metadata = {
  title: "Dashboard - MTV Portal",
};

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const session = cookies().get(DASHBOARD_SESSION_COOKIE)?.value;

  if (!verifyDashboardSession(session)) {
    redirect("/dashboard/login");
  }

  return <DashboardHub />;
}
