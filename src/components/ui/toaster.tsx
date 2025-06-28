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
    <ToastProvider data-oid="ab:luzz">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="-bppcno">
            <div className="grid gap-1" data-oid="zmegzjl">
              {title && <ToastTitle data-oid="c7mnc1l">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="_5kevzo">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid=".4vy5ss" />
          </Toast>
        );
      })}
      <ToastViewport data-oid=":8xgitu" />
    </ToastProvider>
  );
}
