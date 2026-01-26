import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb, ShoppingBag, Building2, MessageCircle } from "lucide-react";

const solutions = [
  {
    icon: Lightbulb,
    title: "Emprendedores",
    description:
      "Ideal para emprendedores que quieren mostrar sus productos de forma profesional sin grandes inversiones.",
  },
  {
    icon: ShoppingBag,
    title: "Tiendas físicas",
    description:
      "Complementa tu tienda física con un catálogo digital que tus clientes pueden consultar en cualquier momento.",
  },
  {
    icon: Building2,
    title: "Negocios PyME",
    description:
      "Perfecto para pequeñas y medianas empresas que buscan digitalizar su presencia sin complicaciones.",
  },
  {
    icon: MessageCircle,
    title: "Ventas por redes",
    description:
      "Comparte tu catálogo en redes sociales y WhatsApp para facilitar las ventas y consultas de tus clientes.",
  },
];

export function DesignedForSection() {
  return (
    <section className="w-full py-12 md:py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Diseñado para tu negocio
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <Icon className="size-8 mb-4 text-primary" />
                  <CardTitle>{solution.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{solution.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
