import Swal from "sweetalert2";

const showDeletedAlert = (name: string = "") => {
  Swal.fire({
    title: "Deleted!",
    text: `Your ${name} has been deleted.`,
    icon: "success",
  });
};

export { showDeletedAlert };
