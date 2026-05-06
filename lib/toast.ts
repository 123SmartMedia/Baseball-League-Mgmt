export type ToastType = "success" | "error" | "info";

export interface ToastEventDetail {
  message: string;
  type: ToastType;
}

function dispatch(message: string, type: ToastType) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>("app:toast", { detail: { message, type } })
  );
}

export const toast = Object.assign(
  (message: string) => dispatch(message, "info"),
  {
    success: (message: string) => dispatch(message, "success"),
    error:   (message: string) => dispatch(message, "error"),
    info:    (message: string) => dispatch(message, "info"),
  }
);
