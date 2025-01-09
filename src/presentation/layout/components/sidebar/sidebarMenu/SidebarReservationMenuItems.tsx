import { FC } from "react";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarReservationMenuItems: FC = () => {
  return (
    <>
      <SidebarMenuItem
        to="/apps/reservation/reservationlist"
        title="SIDEBAR-RESERVATIONS"
        hasBullet={true}
      />
    </>
  );
};
export { SidebarReservationMenuItems };
