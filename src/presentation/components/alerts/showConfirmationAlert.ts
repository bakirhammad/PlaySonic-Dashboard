import Swal from "sweetalert2";

const showConfirmationAlert = (name: string = "") => {
  return new Promise((resolve) => {
    Swal.fire({
      title: `Are you sure you want to delete ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export { showConfirmationAlert };
