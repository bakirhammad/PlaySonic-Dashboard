import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarCourtMenuItems } from "./SidebarCourtMenuItems";
import { SidebarClubMenuItems } from "./SidebarClubMenuItems";

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

      {/*      <SidebarMenuItemWithSub
        to="/apps/sightseeing"
        title={"SIGHT-SEEING-PAGE-TITLE"}
        icon="abstract-28"
        fontIcon="bi-people-fill"
      >
        <SidebarSightSeeingMenuItems />
      </SidebarMenuItemWithSub> */}

      {/* .. >>>>>  */}

      <SidebarMenuItemWithSub
        to="/apps/club"
        title={"Club"}
        icon="abstract-28"
        fontIcon="bi-people-fill"
      >
        <SidebarClubMenuItems />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to="/apps/court"
        title={"Court"}
        icon="abstract-28"
        fontIcon="bi-people-fill"
      >
        <SidebarCourtMenuItems />
      </SidebarMenuItemWithSub>

      <SidebarMenuItem
        to="/apps/slottype"
        title="SIDEBAR-SLOT-TYPE"
        hasBullet={true}
      />
    </>
  );
};

export { SidebarMenuMain };
