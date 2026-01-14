"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";

export interface PriceTierData {
  id: string;
  label: string;
  price: number;
  sort_order: number;
  active: boolean;
}

interface ProductPriceTiersManagerProps {
  priceTiers: PriceTierData[];
  onChange: (tiers: PriceTierData[]) => void;
}

export const ProductPriceTiersManager = ({
  priceTiers,
  onChange,
}: ProductPriceTiersManagerProps) => {
  const addPriceTier = () => {
    const newTier: PriceTierData = {
      id: Date.now().toString(),
      label: "",
      price: 0,
      sort_order: priceTiers.length + 1,
      active: true,
    };
    onChange([...priceTiers, newTier]);
  };

  const removePriceTier = (id: string) => {
    onChange(priceTiers.filter((tier) => tier.id !== id));
  };

  const updatePriceTier = (
    id: string,
    field: keyof PriceTierData,
    value: string | number | boolean
  ) => {
    onChange(
      priceTiers.map((tier) =>
        tier.id === id ? { ...tier, [field]: value } : tier
      )
    );
  };

  return (
    <div className="space-y-4">
      {priceTiers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 text-sm font-medium">Etiqueta</th>
                <th className="text-left p-2 text-sm font-medium">Precio</th>
                <th className="text-left p-2 text-sm font-medium">Orden</th>
                <th className="text-left p-2 text-sm font-medium">Activo</th>
                <th className="text-left p-2 text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {priceTiers.map((tier) => (
                <tr key={tier.id} className="border-b">
                  <td className="p-2">
                    <Input
                      placeholder="Ej: 6-Pack, Dozen"
                      value={tier.label}
                      onChange={(e) =>
                        updatePriceTier(tier.id, "label", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={tier.price || ""}
                      onChange={(e) =>
                        updatePriceTier(
                          tier.id,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="1"
                      value={tier.sort_order || ""}
                      onChange={(e) =>
                        updatePriceTier(
                          tier.id,
                          "sort_order",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20"
                    />
                  </td>
                  <td className="p-2">
                    <Switch
                      checked={tier.active}
                      onCheckedChange={(checked) =>
                        updatePriceTier(tier.id, "active", checked)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePriceTier(tier.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={addPriceTier}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Agregar Nivel de Precio
      </Button>

      {priceTiers.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          No hay niveles de precio personalizados. El precio base se aplicará
          por defecto.
        </p>
      )}
    </div>
  );
};
