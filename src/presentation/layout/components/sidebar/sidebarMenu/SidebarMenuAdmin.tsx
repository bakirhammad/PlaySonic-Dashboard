import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarCourtMenuItems } from "./SidebarCourtMenuItems";
import { SidebarClubMenuItems } from "./SidebarClubMenuItems";
import { SidebarGeneralMenuItems } from "./SidebarGeneralMenuItems";
import { SidebarReservationMenuItems } from "./SidebarReservationMenuItems";

const SidebarMenuAdmin = () => {
  return (
    <>
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
      
       <SidebarMenuItemWithSub
        to="/apps/reservation"
        title={"Reservation"}
        icon="abstract-28"
        fontIcon="bi-people-fill"
      >
        <SidebarReservationMenuItems />
      </SidebarMenuItemWithSub> 

      <SidebarMenuItemWithSub
        to="/apps/general"
        title={"General"}
        icon="abstract-28"
        fontIcon="bi-people-fill"
      >
        <SidebarGeneralMenuItems />
      </SidebarMenuItemWithSub>
    </>
  );
};

export { SidebarMenuAdmin };
