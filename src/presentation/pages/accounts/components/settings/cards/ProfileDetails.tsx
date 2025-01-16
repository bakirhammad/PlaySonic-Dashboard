/**
 * ProfileDetails Component
 *
 * A form for updating a user's profile details.
 *
 * It fetches the user's data from the server and uses it to pre-populate the form.
 *
 * It also handles the form submission and updates the user's data on the server.
 *
 * @returns A form component with input fields pre-populated with the user's data.
 */
import { FC, useEffect, useMemo } from "react";
import { QUERIES, toAbsoluteUrl } from "../../../../../helpers";

import * as Yup from "yup";
import {
  Form,
  Formik,
  FormikContextType,
  FormikValues,
  useFormikContext,
} from "formik";
import {
  useLocaleFormate,
} from "@presentation/hooks";
import { useAuthStore } from "@infrastructure/storage/AuthStore";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import {
  CustomButton,
  CustomCheckbox,
  CustomInputField,
  CustomToast,
} from "@presentation/components";
import { authenticationURLEnum } from "@domain/enums";
import { useQueryClient } from "react-query";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import { UserCommandInstance } from "@app/useCases/authentication/command/userCommnd";
import validationSchemas from "@presentation/helpers/validationSchemas";
import { IDDlOption, IUserCurrencies, IUserData } from "@domain/entities";
import { CustomUploadFile } from "@presentation/components/forms/CustomUploadFile";
import { useCountriesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL";

const profileDetailsSchema = Yup.object().shape({
  // UserName: Yup.string().required("UserName is required"),
  FirstName: validationSchemas.string,
  Address: validationSchemas.string,
  LastName: validationSchemas.string,
  PhoneNo: validationSchemas.string,
  Email: validationSchemas.email,

  country: Yup.object({
    value: Yup.number().required("Country is required"),
  }).required("Country is required"),

  city: Yup.object({
    value: Yup.number().required("City is required"),
  }).required("City is required"),
});

const ProfileDetails: FC = () => {
  const { currentUser } = useAuthStore();
  const UserData = currentUser?.user;
  const queryClient = useQueryClient();
  const initialValues = useMemo(
    () => ({
      Img: UserData?.img,
      FirstName: UserData?.firstName,
      UserName: UserData?.userName,
      LastName: UserData?.lastName,
      CompanyName: UserData?.companyName,
      IsActive: UserData?.isActive,
      SeatPreference: UserData?.seatPreference,
      MobileNumber: UserData?.mobileNumber,
      currencies: UserData?.userCurrencies,
      country: null,
      Address: UserData?.address,
      Language: UserData?.language,
      Currencies: UserData?.userCurrencies,
      TimeZone: UserData?.timeZone,
      DateOfBirth: UserData?.dateOfBirth,
      PassportExpiryDate: UserData?.passportExpiryDate,
      Email: UserData?.email,
      PhoneNo: UserData?.phoneNo,
      PostCode: UserData?.postCode,
      PassportNo: UserData?.passportNo,
      allowMarketing: false,
      // UserData?.userCurrencies.find((c) => c.isDefault)
    }),
    [UserData]
  );

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();

    formData.append("id", String(currentUser?.user.id));
    formData.append("UserName", values.UserName);
    formData.append("FirstName", values.FirstName);
    formData.append("LastName", values.LastName);
    formData.append("PhoneNo", values.PhoneNo);
    formData.append("Email", values.Email);
    formData.append("Address", values.Address);
    formData.append("CountryID", values.country.value);
    formData.append("CityID", values.city.value);
    formData.append("PostCode", values.PostCode);
    formData.append("MobileNumber", values.MobileNumber);
    formData.append("DateOfBirth", values.DateOfBirth || "");
    formData.append("IsActive", values.IsActive);
    formData.append("PassportNo", values.PassportNo || 0); //TODD
    formData.append("CompanyName", values.CompanyName);
    formData.append("PassportCountryId", values.PassportCountryId?.value || 0); //TODD
    formData.append("PassportExpiryDate", values.PassportExpiryDate || ""); //TODD
    formData.append("MealPreference", values.MealPreference?.value || 0); //TODD
    formData.append("SeatPreference", values?.SeatPreference || 0); //TODD
    values.Currencies.map((c: IUserCurrencies, currencyIndex: number) => {
      formData.append(`Currencies[${currencyIndex}].id`, String(c?.id));
      formData.append(
        `Currencies[${currencyIndex}].currencyId`,
        String(c?.currencyId)
      );
      formData.append(
        `Currencies[${currencyIndex}].userId`,
        String(currentUser?.user.id)
      );
      formData.append(
        `Currencies[${currencyIndex}].isDefault`,
        String(c?.currencyId === values?.selectedCurrency?.value)
      );
      formData.append(
        `Currencies[${currencyIndex}].isDeleted`,
        String("false")
      );
    });
    formData.append("Img", values?.Img);

    try {
      const data = await UserCommandInstance.updateUserClass(
        authenticationURLEnum.updateUser,
        formData
      );
      if (data) {
        CustomToast("Updated  successfully", "success", {
          autoClose: 3000,
        });
        queryClient.invalidateQueries({
          queryKey: [QUERIES.HotelSuppliersList],
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        CustomToast(error.message, "error", { autoClose: 6000 });
        console.error("Error Updating form:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={profileDetailsSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      {<ProfileDetailsForm UserData={UserData} />}
    </Formik>
  );
};
interface IProps {
  UserData: IUserData;
}
const ProfileDetailsForm: FC<IProps> = ({ UserData }) => {
  const {
    values,
    setFieldError,
    setFieldValue,
    touched,
    isValid,
    isSubmitting,
    errors,
  }: FormikContextType<FormikValues> = useFormikContext();
  const handlError = (message: string, error: Error, field: string) => {
    console.error("Error Fetching data:", error);
    setFieldError(field, message);
    setFieldValue(field, null);
    CustomToast(message, "error");
  };

  const { CountriesOption, IsCountryLoading } = useCountriesDDL();
  
  
  useEffect(() => {
    const currencies = values.currencies.map((currency: IUserCurrencies) => {
      if (currency.isDefault)
        setFieldValue("selectedCurrency", {
          value: currency.currencyId,
          label: currency.symbol,
        });
      return { value: currency.currencyId, label: currency.symbol };
    });
    setFieldValue("currenciesOption", currencies);
  }, [values?.currencies]);
  const GetSelctedOption = (
    options: IDDlOption[],
    optionId: number,
    FieldName: string
  ) => {
    const selectedOption = options?.find(
      (option) => option.value === Number(String(optionId).trim())
    );

    setFieldValue(FieldName, selectedOption);
  };
  useEffect(() => {
    GetSelctedOption(CountriesOption, UserData?.countryId, "country");
    GetSelctedOption(CountriesOption, UserData?.countryId, "country");
    GetSelctedOption(
      CountriesOption,
      UserData?.passportCountryId,
      "PassportCountryId"
    );
    // GetSelctedOption(citiesOption, UserData?.cityId, "city");
   
  }, [CountriesOption ]);
  useEffect(() => {}, [UserData]);
  return (
    <div className="card mb-5 mb-xl-10">
      <div
        className="card-header border-0 cursor-pointer"
        role="button"
        data-bs-toggle="collapse"
        data-bs-target="#kt_account_profile_details"
        aria-expanded="true"
        aria-controls="kt_account_profile_details"
      >
        <div className="card-title m-0">
          <h3 className="fw-bolder m-0">
            {useLocaleFormate("PROFILE_DETAILS")}
          </h3>
        </div>
      </div>

      <div id="kt_account_profile_details" className="collapse show">
        <Form
          className="form"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="card-body border-top p-9">
            <div className="mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                Avatar
              </label>
              <div className="col-lg-8 d-flex align-items-center gap-5 ">
                <div
                  className="image-input image-input-outline"
                  data-kt-image-input="true"
                  style={{
                    backgroundImage: `url(${toAbsoluteUrl({
                      pathname: values?.Img,
                      extension: ".webp",
                      size: "_200x200",
                    })})`,
                  }}
                >
                  <div
                    className="image-input-wrapper w-125px h-125px"
                    style={{
                      backgroundImage: `url(${toAbsoluteUrl({
                        pathname: values?.Img,
                        extension: ".webp",
                        size: "_200x200",
                      })})`,
                    }}
                  ></div>
                </div>
                <CustomUploadFile
                  label={""}
                  containerClassName="rounded"
                  name={"Img"}
                  accept={"image/*"}
                  touched={touched}
                  errors={errors}
                />
              </div>
            </div>

            <div className="row row-cols-2">
              <div className="mb-6">
                <CustomInputField
                  name={"FirstName"}
                  label="FIRST-NAME"
                  placeholder="FIRST-NAME"
                />
              </div>
              <div className="mb-6">
                <CustomInputField
                  name={"LastName"}
                  label="LASTNAME"
                  placeholder="LASTNAME"
                />
              </div>
              <div className="mb-6">
                <CustomInputField
                  name={"Email"}
                  label="EMAIL"
                  placeholder="EMAIL"
                />
              </div>
              <div className="mb-6">
                <CustomTimePicker
                  name={"DateOfBirth"}
                  labelRequired={false}
                  label="DATEOFBIRTH"
                  placeholder="DATEOFBIRTH"
                  enableTime={true}
                />
              </div>
              <div className="mb-6">
                <CustomInputField
                  name={"Address"}
                  label="ADDRESS"
                  placeholder="ADDRESS"
                  labelRequired={true}
                />
              </div>
              <div className="mb-6">
                <CustomInputField
                  name={"PostCode"}
                  label="POSTCODE"
                  placeholder="POSTCODE"
                  labelRequired={false}
                />
              </div>
              <div className="mb-6">
                <CustomInputField
                  name={"PhoneNo"}
                  label="PHONENO"
                  placeholder="PHONENO"
                />
              </div>
              <div className="mb-6">
                <CustomInputField
                  name={"MobileNumber"}
                  labelRequired={false}
                  label="MOBILENUMBER"
                  placeholder="MOBILENUMBER"
                />
              </div>
              <div className="mb-6">
                <CustomSelectField
                  name="country"
                  options={CountriesOption}
                  isloading={IsCountryLoading}
                  label="DDL-COUNTRY_LABEL"
                  placeholder="DDL-COUNTRY_LABEL"
                />
              </div>

              {/* <div className="mb-6">
                <CustomSelectField
                  name="city"
                  options={citiesOption}
                  labelRequired={false}
                  isloading={isCitiesLoading}
                  label="DDL-CITY_LABEL"
                  placeholder="DDL-CITY_LABEL"
                  disabled={!citiesOption.length}
                />
              </div> */}

              <div className="mb-6">
                <CustomSelectField
                  name={"selectedCurrency"}
                  touched={touched}
                  options={values.currenciesOption}
                  errors={errors}
                  label="DDL-CURRENCY"
                  placeholder="DDL-CURRENCY"
                  isSubmitting={isSubmitting}
                />
              </div>
              <div className="mb-6">
                <CustomInputField
                  name={"PassportNo"}
                  label="PASSPORTNO"
                  placeholder="PASSPORTNO"
                  labelRequired={false}
                />
              </div>
              <div className="mb-6">
                <CustomSelectField
                  name="PassportCountryId"
                  options={CountriesOption}
                  isloading={IsCountryLoading}
                  label="PassportCountry"
                  placeholder="PassportCountry"
                />
              </div>
              <div className="mb-6">
                <CustomTimePicker
                  name="PassportExpiryDate"
                  label="PassportExpiryDate"
                  labelRequired={false}
                  placeholder="PassportExpiryDate"
                />
              </div>
              <div className="mb-6">
                <CustomInputField
                  name={"CompanyName"}
                  label="CompanyName"
                  placeholder="CompanyName"
                  labelRequired={false}
                />
              </div>
              <div className="mb-6">
                <CustomInputField
                  name={"SeatPreference"}
                  label="SeatPreference"
                  placeholder="SeatPreference"
                  labelRequired={false}
                />
              </div>
              <div className="mb-6">
                <CustomCheckbox
                  name="IsActive"
                  labelRequired={false}
                  labelTxt="IsActive"
                  placeholder="IsActive"
                />
              </div>
            </div>
          </div>

          <div className="card-footer d-flex justify-content-end py-6 px-9">
            <CustomButton
              type="submit"
              className="btn btn-primary"
              data-kt-users-modal-action="submit"
              disabled={isSubmitting || !isValid || !touched}
              text={isSubmitting ? "PLEASE_WAIT" : "UPDATE"}
            />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProfileDetails;

export { ProfileDetails };
