"use client";

import { useUserProfileStore } from "@/stores/UserProfileStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminOnly({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading } = useUserProfileStore();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin()) {
            router.push("/dashboard");
        }
    }, [isAdmin, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Cargando...</div>
            </div>
        );
    }

    if (!isAdmin()) {
        return null;
    }

    return <>{children}</>;
}
