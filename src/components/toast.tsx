import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    position: "top-center",
  });
};
