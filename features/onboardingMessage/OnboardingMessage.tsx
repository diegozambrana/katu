"use client";

import { Modal } from "@/components/Dialog/Modal";
import { Button } from "@/components/ui/button";
import { useUserProfileStore } from "@/stores/UserProfileStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { completeOnboarding } from "@/actions";
import { toast } from "sonner";

export const OnboardingMessage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, setProfile } = useUserProfileStore();


  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.endsWith("/onboarding")) {
      return;
    }

    if (profile && !profile.onboarding_completed) {
      setIsOpen(true);
    }
  }, [profile]);

  const handleSkip = async () => {
    try {
      await completeOnboarding();
      if (profile) {
        setProfile({
          ...profile,
          onboarding_completed: true,
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al completar el onboarding");
    }
  };

  const data = {
    title: "Empieza a crear catálogos en línea de forma fácil y profesional.",
    description: "Solo necesitas completar unos pasos rápidos para configurar tu negocio y publicar tu primer catálogo.",
    smallDescription: "Te tomará solo unos minutos y podrás hacerlo ahora o más tarde.",
  }

  return <Modal open={isOpen} onOpenChange={setIsOpen} title={data.title} >
    <div className="flex flex-col gap-4">
      <p className="">{data.description}</p>
      <p className="text-sm text-muted-foreground">{data.smallDescription}</p>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleSkip}>
          Saltar
        </Button>
        <Button variant="default" onClick={() => setIsOpen(false)}>
          <Link href="/onboarding">
            Comenzar
          </Link>
        </Button>
      </div>

    </div>
  </Modal>;
};