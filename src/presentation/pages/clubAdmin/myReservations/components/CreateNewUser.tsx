/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import {
  CustomButton,
  CustomInputField,
  CustomListLoading,
  CustomModal,
  CustomToast,
} from "@presentation/components";
import { ListViewProvider, useListView } from "@presentation/context";
import {
  Form,
  Formik,
  FormikProps,
  useFormikContext,
  FormikValues,
  FormikContextType,
} from "formik";
import * as Yup from "yup";
import { useQueryClient } from "react-query";
import { QUERIES } from "@presentation/helpers";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { GenderOptionsDDL } from "@presentation/helpers/DDL/GenderOptions";
import { addReservationUserCommandInstance } from "@app/useCases/addReservationUser/Command/addReservationUserCommand";
import { AddReservationUserUrlEnum } from "@domain/enums/URL/AddReservationUser/AddReservationUser";
import { GetPlaySonicByIdInstance } from "@app/useCases/getPlaySonicId";
import { GetPlaySonicByIdUrlEnum } from "@domain/enums/URL/GetPlaySonicById/GetPlaySonicById";
import { CustomComfirmationAlert } from "@presentation/components/alerts/CustomComfirmationAlert";
import { showPalySonicIdAlert } from "@presentation/components/alerts/showPalySonicIdAlert";

const CreateNewUserForm = ({ setFieldValue, values }: any) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(false);
  const [createUserModal, setCreateUserModal] = useState(false);
  const initialValues = Object.assign({
    firstName: null,
    lastName: null,
    phone: null,
    displayName: null,
    dob: null,
    userLevel: null,
    gender: null,
    createBy: 61,
  });

  const _ReservationSchema = Object.assign({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    displayName: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
  });

  const ReservationSchema = Yup.object().shape(_ReservationSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("FirstName", values.firstName);
    formData.append("LastName", values.lastName);
    formData.append("Phone", values.phone);
    formData.append("DisplayName", values.displayName);
    formData.append("DOB", values.dob);
    formData.append("UserLevel", values.userLevel);
    formData.append("Gender", values.gender.value);
    formData.append("CreateBy", values.createBy);

    try {
      const data =
        await addReservationUserCommandInstance.addReservationUserCommand(
          AddReservationUserUrlEnum.CreateReservationUser,
          formData
        );
      if (data) {
        CustomToast("Reservation is created successfully", "success", {
          autoClose: 3000,
        });
        showPalySonicIdAlert(
          `Your Playsonic ID is ${data.playSonicId}`,
          "Success Create"
        );

        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.ReservationList],
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        CustomToast(error.message, "error", { autoClose: 6000 });
        console.error("Error Create form:", error);
      }
    } finally {
      setSubmitting(false);
      setCreateUserModal(false);
    }
  };
  const HandleFindUser = async () => {
    try {
      const findUser = await GetPlaySonicByIdInstance.getPlaySonicById(
        GetPlaySonicByIdUrlEnum.GetGetPlaySonicByIdById,
        values.playSonicId
      );

      if (findUser) {
        setUser(true);
        setFieldValue("ownerID", {
          value: findUser.userId,
          label: findUser.userName,
        });
      }
    } catch {
      CustomToast("User Not found", "error");
      setUser(false);
    }
  };
  return (
    <>
      <div className="d-flex tw-gap-5">
        <CustomButton
          type="button"
          text="Add"
          onClick={() => HandleFindUser()}
          className="btn btn-primary"
        />
        <CustomButton
          type="button"
          text="Create New"
          onClick={() => setCreateUserModal(true)}
          className="btn btn-light-primary"
        />
      </div>
      {user && (
        <div className="row row-cols-1 row-cols-md-2 border-info-subtle border-black">
          <CustomSelectField
            name="ownerID"
            label="DDL-Owner"
            placeholder="DDL-Owner"
            options={[]}
          />
        </div>
      )}
      {createUserModal && (
        <CustomModal
          modalTitle="Create-New-User"
          modalSize={"xl"}
          onClick={() => setCreateUserModal(false)}
        >
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={ReservationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values, setSubmitting);
            }}
          >
            <ReservationForm setCreateUserModal={setCreateUserModal} />
          </Formik>
        </CustomModal>
      )}
    </>
  );
};
const ReservationForm = ({
  setCreateUserModal,
}: {
  setCreateUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isSubmitting, isValid }: FormikContextType<FormikValues> =
    useFormikContext();

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
            <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black">
              <CustomInputField
                name="firstName"
                placeholder="Firts-Name"
                label="Firts-Name"
                as="input"
              />
              <CustomInputField
                name="lastName"
                placeholder="Last-Name"
                label="Last-Name"
                as="input"
              />
            </div>
            <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black">
              <CustomInputField
                name="displayName"
                placeholder="User-DISPLAY-NAME"
                label="User-DISPLAY-NAME"
                as="input"
              />
              <CustomInputField
                name="phone"
                placeholder="USER-PHONE"
                label="USER-PHONE"
                as="input"
              />
            </div>
            <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black">
              <CustomTimePicker
                label="Bith-Date"
                name="dob"
                placeholder="Bith-Date"
              />
              <CustomInputField
                name="userLevel"
                placeholder="Level"
                label="Level"
                as="input"
                type="number"
              />
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black">
            <CustomSelectField
              name="gender"
              options={GenderOptionsDDL}
              label="DDL-GENDER"
              placeholder="DDL-GENDER"
            />
          </div>
        </div>
        <div className="text-center pt-15">
          <CustomButton
            type="reset"
            text="CANCEL"
            onClick={() => setCreateUserModal(false)}
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

export const CreateNewUser = ({ setFieldValue, values }: any) => {
  return (
    <ListViewProvider>
      <CreateNewUserForm setFieldValue={setFieldValue} values={values} />
    </ListViewProvider>
  );
};
