"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AdminLayoutHandler() {
  const pathname = usePathname();

  // Detectar si estamos en una ruta de admin
  // Las rutas de admin están bajo app/(admin)/
  const isAdminRoute = pathname
    ? (pathname.startsWith("/dashboard") ||
        pathname.startsWith("/business") ||
        pathname.startsWith("/product") ||
        pathname.startsWith("/catalog") ||
        pathname.startsWith("/support") ||
        pathname.startsWith("/user"))
    : false;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isAdminRoute) {
      // Agregar overflow-hidden solo en rutas de admin
      html.classList.add("overflow-hidden");
      body.classList.add("overflow-hidden");
    } else {
      // Remover overflow-hidden en otras rutas
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
    }

    // Cleanup: remover las clases cuando el componente se desmonte
    return () => {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
    };
  }, [isAdminRoute]);

  return null;
}
