import Swal from "sweetalert2";
import { ReactNode } from "react";
import ReactDOMServer from "react-dom/server"; // To render JSX to HTML

interface IProps {
  message: ReactNode; // Accept ReactNode (JSX) for message
  icon?: "success" | "error" | "warning" | "info" | "question";
  onConfirm: () => void;
  onCancel?: () => void;
}

const showAreYouSure = ({
  message,
  onConfirm,
  icon = "warning",
  onCancel,
}: IProps) => {
  const htmlMessage = ReactDOMServer.renderToString(message);

  Swal.fire({
    title: "Are you sure?",
    html: htmlMessage,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    AudioParam: true,
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    } else {
      if (onCancel) {
        onCancel();
      }
    }
  });
};

export { showAreYouSure };
