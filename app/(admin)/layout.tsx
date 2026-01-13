import { Header } from "@/components/layout/Header/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function AuthCheck({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}

function LoadingFallback() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden h-screen overflow-scroll">
        <Header />
        <div className="p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Cargando...</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCheck>
        <div className="flex">
          <Sidebar />
          <main className="w-full flex-1 overflow-hidden h-screen overflow-scroll">
            <Header />
            <div className="p-4">{children}</div>
          </main>
        </div>
      </AuthCheck>
    </Suspense>
  );
}
