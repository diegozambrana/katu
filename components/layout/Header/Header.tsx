// import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
// import { UserNav } from './user-nav';
import { MobileSidebar } from "../Sidebar";

import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";

import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";

export function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full bg-background z-40 border-b shadow-sm">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          {/* <UserNav /> */}
          {/* <ThemeToggle /> */}
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
        </div>
      </nav>
    </header>
  );
}
