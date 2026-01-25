"use client";
import React from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import Link from "next/link";
import Image from "next/image";

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block z-50`,
        !isMinimized ? "w-72" : "w-[72px]",
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link
          href={"/dashboard"}
          className={cn(
            "flex items-center gap-2",
            isMinimized && "justify-center"
          )}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="flex-shrink-0"
          />
          {!isMinimized && <h1 className="text-2xl font-bold">Catalogo</h1>}
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          "absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  );
}
