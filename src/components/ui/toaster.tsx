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
    <ToastProvider data-oid="w48lo90">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="29m:9az">
            <div className="grid gap-1" data-oid="zhawhd-">
              {title && <ToastTitle data-oid="xqv28l2">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="jjl92ka">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="_cfgqn." />
          </Toast>
        );
      })}
      <ToastViewport data-oid="3efxsck" />
    </ToastProvider>
  );
}
