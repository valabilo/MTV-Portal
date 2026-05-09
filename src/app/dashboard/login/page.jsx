import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DASHBOARD_SESSION_COOKIE,
  verifyDashboardSession,
} from "@/lib/dashboardAuth";
import LoginForm from "./LoginForm";
import styles from "./login.module.css";

export const metadata = {
  title: "Dashboard Login - MTV Portal",
};

export const dynamic = "force-dynamic";

export default function DashboardLoginPage() {
  const session = cookies().get(DASHBOARD_SESSION_COOKIE)?.value;

  if (verifyDashboardSession(session)) {
    redirect("/dashboard");
  }

  return (
    <main className={styles.loginPage}>
      <LoginForm />
    </main>
  );
}
