import { useLocaleFormate } from "../../hooks/localization/useLocaleFormate";
interface Props {
  Width?: number | string;
  Height?: number | string;
}

const PleaseWaitTxt = ({ Width = "100%", Height = 500 }: Props) => {
  return (
    <>
      <div style={{ height: Height, width: Width }} className="PleaseWait">
        {useLocaleFormate("PLEASE_WAIT")}
        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
      </div>
    </>
  );
};

export default PleaseWaitTxt;
