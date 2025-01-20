import { CustomKTCard } from "@presentation/helpers/index";
import {
  ListViewProvider,
  QueryRequestProvider,
} from "@presentation/context/index";
import { RegisterFields } from "./components/RegisterFields";

const Register = () => {
  return (
    <>
      <CustomKTCard>
        <RegisterFields />
      </CustomKTCard>
    </>
  );
};

function RegisterWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <Register />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default RegisterWrapper;
