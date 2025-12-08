"use client";

import { cn } from "@/lib/utils";
import type React from "react";

interface PageTitleProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  className?: string;
}

export function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <>
      <h1
        className={cn(
          "text-3xl font-bold tracking-tight",
          description && "mb-2",
          className
        )}
      >
        {title}
      </h1>
      {description && (
        <p className="text-lg text-muted-foreground text-pretty">
          {description}
        </p>
      )}
    </>
  );
}
