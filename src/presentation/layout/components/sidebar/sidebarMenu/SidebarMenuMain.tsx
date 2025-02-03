import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarMenuAdmin } from "./SidebarMenuAdmin";
import { SidebarMenuClubAdmins } from "./SidebarMenuClubAdmins";
import { useAuthStore } from "@infrastructure/storage/AuthStore";
import { RoleTypesEnum } from "@domain/enums/roleTypesEnum/RoleTypesEnum";
import { useGetClubById } from "@presentation/hooks/queries/DDL/Club/useGetClubById ";

const SidebarMenuMain = () => {
  const { auth } = useAuthStore();
  const type = auth?.type || 0;
  const { clubByIdList } = useGetClubById();
  return (
    <>
      {type === RoleTypesEnum["Super Admin"] ? (
        <SidebarMenuItem
          to="/dashboard"
          icon="element-11"
          title="MENU-DASHBOARD"
          fontIcon="bi-app-indicator"
        />
      ) : (
        <h3 className="tw-text-[#9a9cae] tw-text-center tw-mb-0">{`Welcome ${clubByIdList?.clubInfoResponses[0].name}`}</h3>
      )}

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
      </SidebarMenuItemWithSub>  */}

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
