import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Layers, Share2, Settings } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Crear catálogos en minutos",
    description:
      "Crea tu catálogo digital en pocos minutos sin necesidad de conocimientos técnicos avanzados.",
  },
  {
    icon: Layers,
    title: "Organizar productos por secciones",
    description:
      "Organiza tus productos de manera intuitiva en secciones personalizables para una mejor navegación.",
  },
  {
    icon: Share2,
    title: "Compartir con un enlace",
    description:
      "Comparte tu catálogo con un simple enlace. No necesitas instalar nada ni configurar servidores.",
  },
  {
    icon: Settings,
    title: "Administrar desde un solo lugar",
    description:
      "Gestiona todos tus productos, precios y configuraciones desde un panel de control centralizado.",
  },
];

export function WhatIsSection() {
  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Qué es Catalogo?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Catalogo es una plataforma que permite a negocios crear y
            administrar catálogos digitales para mostrar productos, precios y
            ofertas en línea, de forma simple y accesible.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                    <Icon className="size-6 " />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
