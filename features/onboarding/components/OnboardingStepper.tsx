"use client";

import { cn } from "@/lib/utils";
import type { OnboardingStep } from "../stores/OnboardingStore";

const steps = [
  { id: 1, label: "Negocio" },
  { id: 2, label: "Productos" },
  { id: 3, label: "Catálogo" },
] as const;

interface OnboardingStepperProps {
  currentStep: OnboardingStep;
}

export const OnboardingStepper = ({ currentStep }: OnboardingStepperProps) => {
  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      <div className="flex items-center gap-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium",
                    isActive &&
                    "border-primary bg-primary text-primary-foreground shadow-sm",
                    !isActive &&
                    !isCompleted &&
                    "border-muted-foreground/30 bg-background text-muted-foreground",
                    isCompleted &&
                    "border-emerald-500 bg-emerald-500 text-emerald-50"
                  )}
                >
                  {step.id}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="h-px w-16 bg-muted-foreground/30" />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Paso {Math.min(currentStep, 3)} de 3
      </p>
    </div>
  );
};

