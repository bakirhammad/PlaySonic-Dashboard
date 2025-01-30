import CheckPermission from "@presentation/helpers/CheckPermission";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarMenuClubAdmins = () => {
  const checkMyCourtPermission = CheckPermission("Access Club Courts");
  const checkMyReservaionPermission = CheckPermission(
    "Access Club Reservation"
  );
  return (
    <>
      {checkMyCourtPermission && (
        <SidebarMenuItem
          to="/apps/mycourts"
          title={"SIDEBAR-My-Courts"}
          hasBullet={true}
        />
      )}
      {checkMyReservaionPermission && (
        <SidebarMenuItem
          to="/apps/myreservations"
          title="SIDEBAR-My-Reservations"
          hasBullet={true}
        />
      )}
    </>
  );
};

export { SidebarMenuClubAdmins };
