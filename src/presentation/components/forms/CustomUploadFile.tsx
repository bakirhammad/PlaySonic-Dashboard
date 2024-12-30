/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useRef, useState } from "react";
import {
  Field,
  FieldProps,
  FormikErrors,
  FormikTouched,
  useField,
} from "formik";
import { CustomKTIcon } from "../cards";
import { useLocaleFormate } from "@presentation/hooks";
import clsx from "clsx";

export interface File {
  name: string;
  size: number;
  type: string;
}

interface FileProps {
  label: string;
  labelRequired?: boolean;
  containerClassName?: string;
  name: string;
  multiple?: boolean;
  accept:
    | ".png"
    | ".jpg"
    | ".jpeg"
    | ".pdf"
    | ".doc"
    | ".png ,.jpg , .jpeg"
    | "audio/*"
    | "video/*"
    | "image/*"
    | "*";
  fieldClassName?: string;
  isFile?: boolean;
  touched: FormikTouched<{ [key: string]: boolean | string | any }>;
  errors: FormikErrors<any>;
  isSubmitting?: boolean;
  disabled?: boolean;
}
interface IPropsCustomImageReview {
  index: number;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  imageClassName?: string;
  deleteBtn?: boolean;
  onClickDelete?: () => void;
}

interface IPropsCustomFileReview {
  index: number;
  fileUrl: string;
  fileName: string;
  fileClassName?: string;
  deleteBtn?: boolean;
  onClickDelete?: () => void;
}

const CustomUploadFile: FC<FileProps> = ({
  label,
  labelRequired = false,
  containerClassName,
  name,
  multiple = false,
  accept,
  fieldClassName,
  isSubmitting = false,
  errors,
  touched,
  disabled = false,
  isFile = false,
}) => {
  const _label = useLocaleFormate(label || "");
  const helper = useField(name);
  const [files, setFiles] = useState<File[] | []>([]);

  const [urls, setUrls] = useState<string[] | []>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldProps: FieldProps
  ) => {
    const { form } = fieldProps;
    const fileList = e.target.files;
    if (fileList) {
      const selectedFiles = Array.from(fileList);
      form.setFieldValue(name, multiple ? selectedFiles : selectedFiles[0]);
      setFiles(selectedFiles);
      const fileUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setUrls(fileUrls);
    }
    form.setFieldTouched(name);
  };

  const handleDeleteFile = (fileName: string) => {
    const newSelectedFiles = files.filter((file) => file.name !== fileName);
    const newfileUrls = newSelectedFiles.map((file) =>
      URL.createObjectURL(file as Blob)
    );
    helper[2].setValue(multiple ? newSelectedFiles : null);
    setUrls(newfileUrls);
    setFiles(newSelectedFiles);

    if (multiple) {
      const fileListArray = newSelectedFiles.map(
        (file) => new File([file as Blob], file.name, { type: file.type })
      );
      const newFileList = new DataTransfer();
      fileListArray.forEach((file) => {
        newFileList.items.add(file);
      });
      fileRef.current && (fileRef.current.files = newFileList.files);
    } else {
      fileRef.current && (fileRef.current.value = "");
    }
  };

  return (
    <div
      className={clsx(
        "fv-row fw-bold fs-6 d-flex flex-column fv-row mb-7",
        containerClassName && containerClassName
      )}
    >
      {_label ? (
        <label
          className={clsx({
            ["required"]: labelRequired,
            ["d-block fw-bold fs-6 mb-2"]: true,
          })}
        >
          {_label}
        </label>
      ) : null}
      <Field name={name} type="file" disabled={isSubmitting || disabled}>
        {({ field, form, meta }: FieldProps) => {
          return (
            <input
              disabled={disabled}
              ref={fileRef}
              className={clsx(
                fieldClassName && fieldClassName,
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid": false,
                },
                {
                  "is-valid": false,
                }
              )}
              type="file"
              id={name}
              accept={accept}
              // {...field.value}
              {...(multiple && { multiple })}
              onChange={(e) => {
                handleFilesChange(e, {
                  field,
                  form,
                  meta,
                });
              }}
            />
          );
        }}
      </Field>
      {errors && errors[name] && touched[name] && (
        <div className="fv-plugins-message-container ms-2">
          <div className="fv-help-block">
            <span role="alert">{errors[name]?.toString()}</span>
          </div>
        </div>
      )}
      <ul className="list-group borderbuttom mt-5 mh-500px overflow-y-scroll">
        {multiple
          ? urls.map((url, i) => {
              const fileName = files[i]?.name;
              const fileSize = files[i]?.size;

              return (
                <li key={url + i} className="">
                  {isFile ? (
                    <CustomFileReview
                      index={i}
                      fileUrl={url}
                      fileName={fileName}
                      onClickDelete={() => handleDeleteFile(fileName)}
                    />
                  ) : (
                    <CustomImageReview
                      index={i}
                      fileName={fileName}
                      fileSize={fileSize}
                      imageUrl={url}
                      onClickDelete={() => handleDeleteFile(fileName)}
                    />
                  )}
                </li>
              );
            })
          : files.map((file, i) => {
              const fileName = file?.name;
              const fileSize = file?.size;

              return (
                <li key={fileName + i} className="list-group-item">
                  {isFile ? (
                    <CustomFileReview
                      index={i}
                      fileUrl={urls[0]}
                      fileName={fileName}
                      onClickDelete={() => handleDeleteFile(fileName)}
                    />
                  ) : (
                    <CustomImageReview
                      index={i}
                      fileName={fileName}
                      fileSize={fileSize}
                      imageUrl={urls[0]}
                      onClickDelete={() => handleDeleteFile(fileName)}
                    />
                  )}
                </li>
              );
            })}
      </ul>
    </div>
  );
};

const CustomImageReview: FC<IPropsCustomImageReview> = ({
  index,
  imageUrl,
  fileName,
  fileSize,
  imageClassName,
  deleteBtn = true,
  onClickDelete,
}) => {
  return (
    <>
      <li
        key={index}
        className="d-flex flex-row justify-content-between  align-items-center border-bottom pb-5  mb-4"
      >
        <div
          className={clsx(
            `symbol symbol-45px me-5`,
            imageClassName && imageClassName
          )}
        >
          <img src={`${imageUrl}`} alt="" />
        </div>
        <div className="d-flex justify-content-start flex-column">
          <div className="text-gray-900 fw-medium align-self-start fs-6">
            {fileName}
          </div>
          <div className="text-gray-900 fw-normal align-self-start fs-24">
            {(Math.round((fileSize / (1024 * 1024)) * 10000) / 1000)
              .toFixed(3)
              .toLocaleString()}
            MB
          </div>
        </div>
        {deleteBtn && (
          <div>
            <button
              type="button"
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 "
              onClick={onClickDelete}
            >
              <CustomKTIcon iconName="trash" className="fs-3" />
            </button>
          </div>
        )}
      </li>
    </>
  );
};

const CustomFileReview: FC<IPropsCustomFileReview> = ({
  index,
  fileUrl,
  fileName,
  deleteBtn = true,
  fileClassName,

  onClickDelete,
}) => {
  return (
    <>
      <li
        key={index}
        className="d-flex flex-row justify-content-between  align-items-center border-bottom pb-5  mb-4"
      >
        <div
          className={clsx(
            `symbol symbol-45px me-5`,
            fileClassName && fileClassName
          )}
        >
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              `symbol symbol-45px me-5`,
              fileClassName && fileClassName
            )}
          >
            <div className="d-flex align-items-center justify-content-center w-100 h-100">
              <CustomKTIcon iconName={"file"} className="fs-3" />
            </div>
          </a>
          <div className="d-flex justify-content-start flex-column">
            <div className="text-gray-900 fw-medium align-self-start fs-6">
              {fileName}
            </div>
          </div>
        </div>

        {deleteBtn && (
          <div>
            <button
              type="button"
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 "
              onClick={onClickDelete}
            >
              <CustomKTIcon iconName="trash" className="fs-3" />
            </button>
          </div>
        )}
      </li>
    </>
  );
};

export { CustomUploadFile };
