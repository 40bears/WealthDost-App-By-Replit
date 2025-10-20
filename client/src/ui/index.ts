import type { ToastActionElement } from "@/components/ui/toast";
import { toast as baseToast } from "@/hooks/use-toast";

export type ToastVariant = "default" | "destructive";

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: ToastVariant;
  duration?: number;
}

class ToastService {
  show(opts: ToastOptions) {
    return baseToast({
      title: opts.title,
      description: opts.description,
      action: opts.action,
      variant: opts.variant,
      duration: opts.duration,
    });
  }

  success(title: React.ReactNode, description?: React.ReactNode) {
    return this.show({ title, description, variant: "default" });
  }

  info(title: React.ReactNode, description?: React.ReactNode) {
    return this.show({ title, description, variant: "default" });
  }

  error(title: React.ReactNode, description?: React.ReactNode) {
    return this.show({ title, description, variant: "destructive" });
  }
}

export const UI = {
  toast: new ToastService(),
} as const;

export type UIType = typeof UI;

