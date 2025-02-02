import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarCourtMenuItems } from "./SidebarCourtMenuItems";
import { SidebarClubMenuItems } from "./SidebarClubMenuItems";
import { SidebarGeneralMenuItems } from "./SidebarGeneralMenuItems";
import { SidebarReservationMenuItems } from "./SidebarReservationMenuItems";
import CheckPermission from "@presentation/helpers/CheckPermission";
import { SidebarAdminControlMenuItems } from "./SidebarAdminControlMenuItems";

const SidebarMenuAdmin = () => {
  const checkSuberClubPermission = CheckPermission("Access Super Club");
  const checkSuberCourtPermission = CheckPermission("Access Suber Courts");
  const checSuberReservationPermission = CheckPermission(
    "Access Suber Reservtion"
  );
  const checkGeneralPermission = CheckPermission("Access Genderal");
  const checkAdminControlPermission = CheckPermission("Access Admin Control");

  return (
    <>
      {checkSuberClubPermission && (
        <SidebarMenuItemWithSub
          to="/apps/club"
          title={"Club"}
          icon="abstract-28"
          fontIcon="bi-people-fill"
        >
          <SidebarClubMenuItems />
        </SidebarMenuItemWithSub>
      )}

      {checkSuberCourtPermission && (
        <SidebarMenuItemWithSub
          to="/apps/court"
          title={"Court"}
          icon="abstract-28"
          fontIcon="bi-people-fill"
        >
          <SidebarCourtMenuItems />
        </SidebarMenuItemWithSub>
      )}

      {checSuberReservationPermission && (
        <SidebarMenuItemWithSub
          to="/apps/reservation"
          title={"Reservation"}
          icon="abstract-28"
          fontIcon="bi-people-fill"
        >
          <SidebarReservationMenuItems />
        </SidebarMenuItemWithSub>
      )}

      {checkGeneralPermission && (
        <SidebarMenuItemWithSub
          to="/apps/general"
          title={"General"}
          icon="abstract-28"
          fontIcon="bi-people-fill"
        >
          <SidebarGeneralMenuItems />
        </SidebarMenuItemWithSub>
      )}

      {checkAdminControlPermission && (
        <SidebarMenuItemWithSub
          to="/apps/admin"
          title={"Admin Control"}
          icon="abstract-28"
          fontIcon="bi-people-fill"
        >
          <SidebarAdminControlMenuItems />
        </SidebarMenuItemWithSub>
      )}
    </>
  );
};

export { SidebarMenuAdmin };
