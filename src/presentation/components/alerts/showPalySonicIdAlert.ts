import Swal from "sweetalert2";

const showPalySonicIdAlert = (name: string, title: string) => {
  Swal.fire({
    title: title,
    text: name,
    icon: "success",
  });
};

export { showPalySonicIdAlert };
