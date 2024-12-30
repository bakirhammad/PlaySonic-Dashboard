import * as Yup from "yup";

export const message = "Field is required";
const validationSchemas = {
  string: Yup.string().trim().required("This field is required"),
  message: "Field is required",
  number: Yup.number()
    .typeError("must be a valid number")
    .integer("Value must be an integer")
    .min(0, "This field must be more than or equal 0")
    .required("Field is required"),
  nigativeNumber: Yup.number()
    .typeError("must be a valid number")
    .required("Field is required"),
  double: Yup.number()
    .typeError("must be a valid number")
    .min(0, "This field must be more than or equal 0")
    .required("Field is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  object: Yup.object()
    .typeError("must be object")
    .required("Field is required"),
  boolean: Yup.boolean(),
  array: Yup.array().typeError("must be array").required("Field is required"),
  Date: Yup.date().typeError("must be date").required("Field is required"),
  url: Yup.string().url("Invalid URL").required("URL is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/,
      "Password must contain at least one special character"
    ),
  ConfirmPassword: ({ passwordRef = "password" }: { passwordRef?: string }) =>
    Yup.string()
      .required("This field is required")
      .oneOf(
        [Yup.ref(passwordRef)],
        "Password and Confirm Password didn't match"
      ),
};
export default validationSchemas;
