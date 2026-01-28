"use client";

import React from "react";
import Link from "next/link";
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BREADCRUMB_CONFIG, type BreadcrumbItem as BreadcrumbItemType } from "./config";

interface BreadcrumbProps {
  type: string;
}

export const Breadcrumb = ({ type }: BreadcrumbProps) => {
  const items = BREADCRUMB_CONFIG[type as keyof typeof BREADCRUMB_CONFIG];

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ShadcnBreadcrumb className="mb-4">
      <BreadcrumbList>
        {items.map((item: BreadcrumbItemType, index: number) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
};
