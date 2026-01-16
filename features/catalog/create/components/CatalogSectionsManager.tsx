"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ArrowUp, ArrowDown, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface CatalogSectionProductData {
  id: string;
  product_id: string;
  sort_order: number;
  active: boolean;
}

export interface CatalogSectionData {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  active: boolean;
  products: CatalogSectionProductData[];
}

interface CatalogSectionsManagerProps {
  sections: CatalogSectionData[];
  onChange: (sections: CatalogSectionData[]) => void;
  availableProducts: Array<{
    id: string;
    name: string;
    base_price: number | null;
    currency: string | null;
  }>;
}

export const CatalogSectionsManager = ({
  sections,
  onChange,
  availableProducts,
}: CatalogSectionsManagerProps) => {
  const addSection = () => {
    const newSection: CatalogSectionData = {
      id: Date.now().toString(),
      title: "",
      description: null,
      sort_order: sections.length,
      active: true,
      products: [],
    };
    onChange([...sections, newSection]);
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    // Reordenar sort_order
    const reorderedSections = newSections.map((section, i) => ({
      ...section,
      sort_order: i,
    }));
    onChange(reorderedSections);
  };

  const updateSection = (
    index: number,
    field: keyof Omit<CatalogSectionData, "products">,
    value: string | number | boolean | null
  ) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };
    onChange(updatedSections);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];

    // Actualizar sort_order
    const reorderedSections = newSections.map((section, i) => ({
      ...section,
      sort_order: i,
    }));
    onChange(reorderedSections);
  };

  const addProductToSection = (sectionIndex: number, productId: string) => {
    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];

    // Verificar que el producto no esté ya en la sección
    const productExists = section.products.some(
      (p) => p.product_id === productId
    );

    if (!productExists) {
      const newProduct: CatalogSectionProductData = {
        id: Date.now().toString(),
        product_id: productId,
        sort_order: section.products.length,
        active: true,
      };
      section.products = [...section.products, newProduct];
      onChange(updatedSections);
    }
  };

  const removeProductFromSection = (
    sectionIndex: number,
    productIndex: number
  ) => {
    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];
    section.products = section.products.filter((_, i) => i !== productIndex);
    // Reordenar sort_order de productos
    section.products = section.products.map((product, i) => ({
      ...product,
      sort_order: i,
    }));
    onChange(updatedSections);
  };

  const moveProductInSection = (
    sectionIndex: number,
    productIndex: number,
    direction: "up" | "down"
  ) => {
    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];

    if (
      (direction === "up" && productIndex === 0) ||
      (direction === "down" && productIndex === section.products.length - 1)
    ) {
      return;
    }

    const targetIndex =
      direction === "up" ? productIndex - 1 : productIndex + 1;
    [section.products[productIndex], section.products[targetIndex]] = [
      section.products[targetIndex],
      section.products[productIndex],
    ];

    // Actualizar sort_order
    section.products = section.products.map((product, i) => ({
      ...product,
      sort_order: i,
    }));

    onChange(updatedSections);
  };

  const getProductName = (productId: string) => {
    const product = availableProducts.find((p) => p.id === productId);
    return product ? product.name : "Producto desconocido";
  };

  const getProductPrice = (productId: string) => {
    const product = availableProducts.find((p) => p.id === productId);
    if (product?.base_price) {
      return `${product.base_price} ${product.currency || "BOB"}`;
    }
    return "N/A";
  };

  return (
    <div className="space-y-4">
      {sections.length > 0 && (
        <Accordion type="multiple" className="w-full">
          {sections.map((section, sectionIndex) => (
            <AccordionItem key={section.id} value={section.id}>
              <div className="flex items-center gap-2 pr-4">
                <AccordionTrigger className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {section.title || `Sección ${sectionIndex + 1}`}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({section.products.length} productos)
                    </span>
                  </div>
                </AccordionTrigger>

                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(sectionIndex, "up")}
                    disabled={sectionIndex === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(sectionIndex, "down")}
                    disabled={sectionIndex === sections.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(sectionIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <AccordionContent>
                <div className="space-y-4 pt-4">
                  {/* Section Fields */}
                  <div className="space-y-3">
                    <Input
                      placeholder="Título de la sección"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(sectionIndex, "title", e.target.value)
                      }
                    />

                    <Textarea
                      placeholder="Descripción (opcional)"
                      value={section.description || ""}
                      onChange={(e) =>
                        updateSection(
                          sectionIndex,
                          "description",
                          e.target.value
                        )
                      }
                      rows={2}
                    />

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={section.active}
                        onCheckedChange={(checked) =>
                          updateSection(sectionIndex, "active", checked)
                        }
                      />
                      <span className="text-sm">Sección activa</span>
                    </div>
                  </div>

                  {/* Products in Section */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Productos en esta sección:
                    </p>

                    {section.products.length > 0 ? (
                      <div className="space-y-2">
                        {section.products.map((product, productIndex) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-2 p-2 border rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {getProductName(product.product_id)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {getProductPrice(product.product_id)}
                              </p>
                            </div>

                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  moveProductInSection(
                                    sectionIndex,
                                    productIndex,
                                    "up"
                                  )
                                }
                                disabled={productIndex === 0}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  moveProductInSection(
                                    sectionIndex,
                                    productIndex,
                                    "down"
                                  )
                                }
                                disabled={
                                  productIndex === section.products.length - 1
                                }
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeProductFromSection(
                                    sectionIndex,
                                    productIndex
                                  )
                                }
                              >
                                <X className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay productos en esta sección
                      </p>
                    )}

                    {/* Add Product Selector */}
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) =>
                          addProductToSection(sectionIndex, value)
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Agregar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - {product.base_price || "N/A"}{" "}
                              {product.currency || "BOB"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={addSection}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Agregar Sección
      </Button>

      {sections.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          No hay secciones. Crea secciones para organizar tus productos (ej:
          &quot;Ropa de Mujer&quot;, &quot;Accesorios&quot;).
        </p>
      )}
    </div>
  );
};
