import { redirect } from "next/navigation";

/**
 * Dashboard root page - redirects to /dashboard/home
 */
export default function DashboardPage() {
  redirect("/dashboard/home");
}
