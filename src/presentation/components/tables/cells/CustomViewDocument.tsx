import { FC } from "react";
import { ID } from "../../../helpers";
import { Link } from "react-router-dom";
import { CustomKTIcon } from "../..";

type Props = {
  id: ID;
  className?: string;
  link_to: string;
};

const CustomViewDocument: FC<Props> = ({ className, link_to }) => {
  // const intl = useIntl();

  // const { setItemIdForUpdate } = useListView();
  // const { query } = useQueryResponse();
  // const queryClient = useQueryClient();

  // useEffect(() => {
  //   MenuComponent.reinitialization();
  // }, []);

  return (
    <>
      <Link to={link_to}>
        <CustomKTIcon iconName="document" className={`fs-1 ${className} `} />
      </Link>
    </>
  );
};

export { CustomViewDocument };
