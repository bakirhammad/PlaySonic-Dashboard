import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarMenuAdmin } from "./SidebarMenuAdmin";
import { SidebarMenuClubAdmins } from "./SidebarMenuClubAdmins";

const SidebarMenuMain = () => {
  return (
    <>
      <SidebarMenuItem
        to="/dashboard"
        icon="element-11"
        title="MENU-DASHBOARD"
        fontIcon="bi-app-indicator"
      />

      {/* <SidebarMenuItemWithSub
        to="/crafted/accounts"
        title={"MENUACCOUNTS"}
        icon="profile-circle"
        fontIcon="bi-person"
      >
        <SidebarMenuItem
          to="/crafted/account/overview"
          title="MENUOVERVIEW"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/account/settings"
          title="MENU-SETTINGS"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub> */}

      <div className="menu-item">
        <div className="menu-content pt-2 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            {"--------------------------------"}
          </span>
        </div>
      </div>

      {/* .. >>>>>  */}

      <SidebarMenuAdmin />
      <SidebarMenuClubAdmins />
    </>
  );
};

export { SidebarMenuMain };
