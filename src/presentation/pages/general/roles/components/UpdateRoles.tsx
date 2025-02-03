import { useEffect, useMemo, useRef } from "react";
import {
  CustomButton,
  CustomCheckbox,
  CustomInputField,
  CustomListLoading,
  CustomToast,
} from "@presentation/components";
import { useListView } from "@presentation/context";
import {
  Form,
  Formik,
  FormikContextType,
  FormikProps,
  FormikValues,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { combineBits, QUERIES } from "@presentation/helpers";
import { useQueryClient } from "react-query";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { PermissionsEnumOptions } from "@presentation/helpers/DDL/PermissionsEnumOptions";
import { useLocaleFormate } from "@presentation/hooks";
import { RoleTypesOptions } from "@presentation/helpers/DDL/RoleTypesOptions";
import { RolesCommandInstance } from "@app/useCases/general/roles";
import { RoleUrlEnum } from "@domain/enums/URL/General/GeneralEnum/RolesEnum";
import { IRolesData } from "@domain/entities/general/Roles/Roles";

interface IProps {
  RoleData: IRolesData;
  isLoading: boolean;
}

export const UpdateRules = ({ RoleData, isLoading }: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = useMemo(() => {
    return {
      id: RoleData.id,
      name: RoleData.name,
      type: RoleData.type,
      permissions: RoleData.permissions,
    };
  }, [RoleData]);

  const _RolesSchema = Object.assign({
    name: Yup.string().required("Field is Required"),
  });

  const RolesSchema = Yup.object().shape(_RolesSchema);
  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    const numberPermissionsArray = values.permissions?.map(Number);
    const permissionsEnum = combineBits(
      numberPermissionsArray.map((permission: number) => permission)
    );
    formData.append("Id", String(initialValues.id));
    formData.append("Name", values.name);
    formData.append("Type", values.type.value);
    formData.append("Permissions", String(permissionsEnum));
    try {
      const data = await RolesCommandInstance.updateRoles(
        RoleUrlEnum.UpdateRole,
        formData
      );
      if (data) {
        CustomToast("Slot updated successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.RolesList],
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        CustomToast(error.message, "error", { autoClose: 6000 });
        console.error("Error submitting form:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <PleaseWaitTxt />
      ) : (
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={RolesSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <RolesUpdateForm />
        </Formik>
      )}
    </>
  );
};

const RolesUpdateForm = () => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
    setFieldValue,
  }: FormikContextType<FormikValues> = useFormikContext();

  const HandelSelectPermissions = () => {
    if (values?.permissions?.length === PermissionsEnumOptions?.length) {
      setFieldValue("permissions", []);
    } else {
      const allPermissions = PermissionsEnumOptions.map((e) => String(e.value));
      setFieldValue("permissions", allPermissions);
    }
  };

  useEffect(() => {
    RoleTypesOptions.forEach((role) => {
      if (role.value === values.type) {
        return setFieldValue("type", { value: role.value, label: role.label });
      }
    });
  }, [values.type, setFieldValue]);
  return (
    <>
      <Form
        className="form container-fluid w-100"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="row row-cols-md-1 row-cols-sm-1 row-cols-1">
          <div className="row">
            <div className="row row-cols-2">
              <CustomInputField
                name="name"
                placeholder="ROLE-NAME"
                label="ROLE-NAME"
                as="input"
                isSubmitting={isSubmitting}
              />
              <CustomSelectField
                name="type"
                options={RoleTypesOptions}
                label="DDL-ROLE-TYPE"
                placeholder="DDL-ROLE-TYPE"
              />
            </div>

            <div className="bg-text-secondary-emphasis p-5 rounded-2 shadow-sm my-4">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="text-info">{useLocaleFormate("Permissions")}</h2>
                <CustomButton
                  type="button"
                  className={
                    "btn btn-flush btn-white text-decoration-underline mx-5"
                  }
                  text={
                    values?.permissions?.length ===
                    PermissionsEnumOptions?.length
                      ? "CLEAR-ALL"
                      : "SELECT-ALL-Permissions"
                  }
                  onClick={() => HandelSelectPermissions()}
                />
              </div>
              <div className="row">
                {PermissionsEnumOptions?.map((permission) => (
                  <div className="col-md-3">
                    <CustomCheckbox
                      labelTxt={permission.label}
                      value={permission.value.toString()}
                      name={`permissions`}
                      isTranslated={false}
                      touched={touched}
                      labelRequired={false}
                      errors={errors}
                      txtClassName="text-black"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-15">
          <CustomButton
            type="reset"
            text="CANCEL"
            onClick={() => setItemIdForUpdate(undefined)}
            className="btn btn-light me-3"
            disabled={isSubmitting}
          />
          <CustomButton
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !isValid}
            text={isSubmitting ? "PLEASE_WAIT" : "SUBMIT"}
          />
        </div>
        {isSubmitting && <CustomListLoading />}
      </Form>
    </>
  );
};

export default UpdateRules;
