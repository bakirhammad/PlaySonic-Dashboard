import { useListView } from "../../context/manageListConext/ListViewProvider";
import { useLocaleFormate } from "../../hooks/localization/useLocaleFormate";

interface Props {
  onDeleteSelectedAll: Function;
}
const CustomSelectedData: React.FC<Props> = ({ onDeleteSelectedAll }) => {
  const { selected } = useListView();

  return (
    <div className="d-flex justify-content-end align-items-center">
      <div className="fw-bolder me-5">
        <span className="me-2">{selected.length}</span>
        {useLocaleFormate("SELECTED")}
      </div>

      <button
        type="button"
        className="btn btn-danger"
        onClick={async () => onDeleteSelectedAll()}
      >
        {useLocaleFormate("DELETE_SELECTED")}
      </button>
    </div>
  );
};

export { CustomSelectedData };
