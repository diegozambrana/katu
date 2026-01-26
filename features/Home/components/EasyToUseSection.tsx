import { Check } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Personalización del catálogo",
    description: "Personaliza colores, imágenes y diseño según tu marca.",
  },
  {
    title: "Secciones y productos ilimitados",
    description: "Agrega todas las secciones y productos que necesites sin límites.",
  },
  {
    title: "Imágenes y descripciones",
    description: "Sube imágenes de alta calidad y descripciones detalladas de tus productos.",
  },
  {
    title: "Vista previa en tiempo real",
    description: "Ve cómo se verá tu catálogo antes de publicarlo.",
  },
  {
    title: "Diseño adaptable",
    description: "Tu catálogo se adapta automáticamente a cualquier dispositivo.",
  },
];

export function EasyToUseSection() {
  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Fácil de usar y totalmente personalizable
            </h2>
            <p className="text-lg text-muted-foreground">
              Personaliza tu catálogo, organiza tus productos y gestiona todo
              sin necesidad de conocimientos técnicos.
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="size-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="size-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Right Content - Image */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden bg-muted">
            <Image
              src="/admin_image.jpg"
              alt="Catálogo en dispositivos móviles"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
