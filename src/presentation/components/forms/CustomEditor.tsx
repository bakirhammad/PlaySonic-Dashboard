/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Field,
  FieldProps,
  FormikErrors,
  FormikTouched,
  FormikValues,
} from "formik";
import clsx from "clsx";
import { useLocaleFormate } from "@presentation/hooks/index";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";

interface Props {
  name: string;
  label?: string;
  containerClassName?: string;
  labelRequired?: boolean;
  initialValue?: string;
  fieldClassName?: string;
  isSubmitting?: boolean;
  height?: number;
  min_height?: number;
  max_height?: number;
  touched?: FormikTouched<FormikValues>;
  errors?: FormikErrors<FormikValues>;
}

const CustomEditor: FC<Props> = ({
  name,
  labelRequired = false,
  containerClassName,
  fieldClassName,
  label,
  initialValue,
  isSubmitting,
  height,
  min_height = 200,
  max_height = 500,
  errors,
  touched,
}) => {
  const _label = useLocaleFormate(label || "");
  const editorRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <PleaseWaitTxt />}
      <div
        style={{ display: loading ? "none" : "block" }}
        className={clsx(
          "fv-row mb-7",
          containerClassName && containerClassName
        )}
      >
        {_label ? (
          <label
            className={clsx({
              ["required"]: labelRequired,
              ["fw-bold fs-6 mb-1"]: true,
            })}
          >
            {_label}
          </label>
        ) : null}
        <Field
          className={clsx(
            fieldClassName && fieldClassName,
            "form-control form-control-solid mb-3 mb-lg-0",
            {
              "is-invalid": errors && touched && touched[name] && errors[name],
            },
            {
              "is-valid": errors && touched && touched[name] && !errors[name],
            }
          )}
          name={name}
          disabled={isSubmitting}
        >
          {({ field, form }: FieldProps) => (
            <>
              <Editor
                tinymceScriptSrc={"/tinymce/tinymce.min.js"}
                onInit={(evt, editor) => {
                  editorRef.current = editor;

                  setLoading(false);
                }}
                initialValue={initialValue}
                init={{
                  height: height,
                  min_height: min_height,
                  max_height: max_height,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "preview",
                    "help",
                    "wordcount",
                    "importcss",
                    "directionality",
                    "visualchars",
                    "codesample",
                    "pagebreak",
                    "nonbreaking",
                    "advlist",
                    "lists",
                    "quickbars",
                    "emoticons",
                    "code",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help" +
                    " underline | fontfamily fontsize" +
                    " backcolor |  alignfull ",
                  content_css: [],
                  promotion: false,
                  menubar: "edit view insert format tools table",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }" +
                    "input {  padding: 3px; } ",
                }}
                onEditorChange={() => {
                  if (editorRef.current) {
                    form.setFieldValue(name, editorRef.current.getContent());
                  } else {
                    console.log("editor data failed");
                  }
                }}
                onBlur={() => {
                  form.setFieldTouched(name, true);
                }}
                value={field.value}
              />
              {errors && touched && errors[name] && touched[name] && (
                <div className="fv-plugins-message-container ms-2">
                  <div className="fv-help-block">
                    <span role="alert">{errors[name]}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </Field>
      </div>
    </>
  );
};

export default CustomEditor;
