import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarMenuClubAdmins = () => {
  return (
    <>
      <SidebarMenuItem
        to="/apps/mycourts"
        title={"SIDEBAR-My-Courts"}
        hasBullet={true}
      />
      <SidebarMenuItem
        to="/apps/myreservations"
        title="SIDEBAR-My-Reservations"
        hasBullet={true}
      />
    </>
  );
};

export { SidebarMenuClubAdmins };
