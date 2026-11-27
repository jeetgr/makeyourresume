import { redirect } from "next/navigation";

import { getSession } from "@/server/session";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (await getSession()) redirect("/resumes");
  return children;
}
