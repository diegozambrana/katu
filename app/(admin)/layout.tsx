import { Header } from "@/components/layout/Header/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden h-screen overflow-scroll">
        <Header />
        {children}
      </main>
    </div>
  );
}
