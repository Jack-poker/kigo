import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider data-oid="nrulq:w">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="qutatm2">
            <div className="grid gap-1" data-oid="_xo04eb">
              {title && <ToastTitle data-oid="-0zd1xm">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="4j:5wdc">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="rngwdx:" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="7-jc-6." />
    </ToastProvider>
  );
}
