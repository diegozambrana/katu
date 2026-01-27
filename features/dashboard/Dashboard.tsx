"use client";

import { MainContainer } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Package,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { useDashboard } from "./hooks/useDashboard";
import { useRouter } from "next/navigation";
import type { DashboardStats } from "@/services/DashboardService/DashboardServices";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DashboardProps {
  initialStats: DashboardStats | null;
}

export const Dashboard = ({ initialStats }: DashboardProps) => {
  const router = useRouter();
  const { stats, loading, error } = useDashboard(initialStats);

  if (loading || !stats) {
    return (
      <MainContainer title="Dashboard" loading={true}>
        <div></div>
      </MainContainer>
    );
  }

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) return "hace un momento";
      if (diffInMinutes < 60) return `hace ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`;
      if (diffInHours < 24) return `hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
      if (diffInDays < 7) return `hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`;
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recientemente";
    }
  };

  return (
    <MainContainer title="Dashboard">
      {error && <Alert variant="destructive" className="mb-4">
        <AlertTitle>ERROR</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>}
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-full">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.activeCatalogs}</p>
                  <p className="text-sm text-muted-foreground">
                    Catálogos activos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-full">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">
                    Productos totales
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.activeProducts}</p>
                  <p className="text-sm text-muted-foreground">
                    Productos activos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estado de Catálogos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Estado de catálogos</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/catalog")}
              >
                Ver todos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentCatalogs.map((catalog) => (
                  <div
                    key={catalog.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/catalog/${catalog.id}`)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-muted rounded-full">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{catalog.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Actualizado {formatTimeAgo(catalog.updated_at)}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
                {stats.recentCatalogs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay catálogos aún
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => router.push("/catalog/create")}
                >
                  <div className="flex items-center gap-3">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium">Crear catálogo</p>
                      <p className="text-xs text-muted-foreground">
                        Nuevo catálogo de productos
                      </p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => router.push("/product/create")}
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium">Crear producto</p>
                      <p className="text-xs text-muted-foreground">
                        Agregar nuevo producto
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>


      </div>
    </MainContainer>
  );
};
