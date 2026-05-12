'use client';

import { Toaster } from "@/components/sarh/ui/toaster";
import { Toaster as Sonner } from "@/components/sarh/ui/sonner";
import { TooltipProvider } from "@/components/sarh/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/sarh/ThemeProvider";
import MainLayout from "@/components/sarh/MainLayout";
import { useState } from "react";

export default function SarhLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <MainLayout>
            {children}
          </MainLayout>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
