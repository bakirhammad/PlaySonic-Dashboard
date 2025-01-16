import Swal from "sweetalert2";


const CustomComfirmationAlert = (title: string, confirmText: string) => {
  return new Promise((resolve) => {
    Swal.fire({
      title: title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmText,
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export { CustomComfirmationAlert };
