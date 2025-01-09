import { ToolbarWrapper } from "../../layout/components/toolbar";
import { Content } from "../../layout/components/content";

import { Outlet } from "react-router-dom";

const ClubAdminWrapper = () => {
  return (
    <>
      <ToolbarWrapper />
      <Content>
        <Outlet />
      </Content>
    </>
  );
};

export { ClubAdminWrapper };
