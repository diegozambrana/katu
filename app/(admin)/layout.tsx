import { Header } from "@/components/layout/Header/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getUserProfile } from "@/actions/user/UserActions";
import { UserProfileProvider } from "@/components/providers/UserProfileProvider";
import { OnboardingMessage } from "@/features/onboardingMessage/OnboardingMessage";

async function AuthCheck({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Cargar el perfil del usuario
  const profile = await getUserProfile();

  return (
    <UserProfileProvider initialProfile={profile}>
      {children}
    </UserProfileProvider>
  );
}

function LoadingSidebar() {
  return (
    <aside className="relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block z-50 w-72">
      <div className="hidden p-5 pt-10 lg:block">
        <h1>Catalogo</h1>
      </div>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground text-sm">Cargando...</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-full overflow-hidden">
      <LoadingSidebar />
      <main className="w-full flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Cargando...</div>
            </div>
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
        <div className="flex h-full overflow-hidden">
          <Sidebar />
          <main className="w-full flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header />
            <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
          </main>
        </div>
        <OnboardingMessage />
      </AuthCheck>
    </Suspense>
  );
}
