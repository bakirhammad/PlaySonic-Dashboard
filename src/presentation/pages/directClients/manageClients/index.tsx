import { CustomTable } from "@presentation/components/tables";
import { useListView } from "@presentation/context/index";
import { FC, useMemo } from "react";
import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { CustomModal } from "@presentation/components/modal/CustomModal";
import ManageClientsColumns from "./component/ManageClientsColumns";

const ManageClients: FC = () => {
    const { itemIdForUpdate, setItemIdForUpdate } = useListView();
    const users: [] = [];

    const data = useMemo(() => users, [users]);
    const columns = useMemo(() => ManageClientsColumns, []);
    const openManageClients = () => {
        setItemIdForUpdate(null);
    };

    return (
        <>
            <CustomKTCard>
                <CustomTableToolbar
                    addBtn={false}
                    addBtnAction={openManageClients}
                    searchPlaceholder="Component_Master_SEARCH_PLACEHOLDER"
                />
                <CustomTable columns={columns} data={data} />
            </CustomKTCard>
            {itemIdForUpdate !== undefined && (
                <CustomModal
                    modalSize="lg"
                    modalTitle="SIDEBAR-Component-Master"
                    onClick={() => {
                        setItemIdForUpdate(undefined);
                    }}
                >
                    {/*  <ManageClientsCreateForm /> */}
                </CustomModal>
            )}
        </>
    );
};

export default ManageClients;
