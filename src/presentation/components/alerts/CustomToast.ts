/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToastOptions, toast } from "react-toastify";

type ToastType = "success" | "error" | "warning" | "info";

function CustomToast(
  title: string,
  toastType: ToastType,
  ...props: [ToastOptions?, ...any[]]
) {
  toast[toastType](title, ...(props as any));
}

export { CustomToast };
