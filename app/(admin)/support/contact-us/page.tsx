"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MainContainer } from "@/components/layout/container";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createSupportMessage } from "@/actions/support/SupportActions";

const supportMessageSchema = z.object({
  subject: z
    .string()
    .min(1, "El asunto es requerido")
    .min(3, "El asunto debe tener al menos 3 caracteres"),
  message: z
    .string()
    .min(1, "El mensaje es requerido")
    .min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type SupportMessageFormValues = z.infer<typeof supportMessageSchema>;

export default function ContactUsPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SupportMessageFormValues>({
    resolver: zodResolver(supportMessageSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: SupportMessageFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("subject", data.subject);
        formDataToSend.append("message", data.message);

        await createSupportMessage(formDataToSend);
        toast.success("Mensaje enviado exitosamente");
        form.reset();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al enviar el mensaje";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <MainContainer title="Contáctanos">
      <Card>
        <CardHeader>
          <CardTitle>Enviar Mensaje de Soporte</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Asunto <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Problema con mi cuenta"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mínimo 10 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mensaje <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tu consulta o problema..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mínimo 10 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MainContainer>
  );
}








