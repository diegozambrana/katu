"use client";

import { useOnboarding } from "./hooks/useOnboarding";
import { OnboardingStepper } from "./components/OnboardingStepper";
import { OnboardingBusinessStep } from "./components/OnboardingBusinessStep";
import { OnboardingProductsStep } from "./components/OnboardingProductsStep";
import { OnboardingCatalogStep } from "./components/OnboardingCatalogStep";
import { OnboardingCompleteStep } from "./components/OnboardingCompleteStep";

export const Onboarding = () => {
  const {
    step,
    products,
    catalog,
    isSubmitting,
    businessForm,
    productForm,
    catalogForm,
    handleCreateBusiness,
    handleAddProduct,
    handleCreateCatalog,
    handleFinish,
    goToStep,
  } = useOnboarding();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="w-full max-w-3xl px-4 py-8">
        <OnboardingStepper currentStep={step} />

        {step === 1 && (
          <OnboardingBusinessStep
            form={businessForm}
            isSubmitting={isSubmitting}
            onSubmit={handleCreateBusiness}
          />
        )}

        {step === 2 && (
          <OnboardingProductsStep
            form={productForm}
            isSubmitting={isSubmitting}
            products={products}
            onAddProduct={handleAddProduct}
            onContinue={() => goToStep(3)}
          />
        )}

        {step === 3 && (
          <OnboardingCatalogStep
            form={catalogForm}
            isSubmitting={isSubmitting}
            products={products}
            onSubmit={handleCreateCatalog}
          />
        )}

        {step === 4 && catalog && (
          <OnboardingCompleteStep
            catalog={catalog}
            isSubmitting={isSubmitting}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
};
