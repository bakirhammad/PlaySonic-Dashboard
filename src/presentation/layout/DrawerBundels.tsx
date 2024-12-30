import { useBundleContentStore } from "@infrastructure/storage/BundelContentStore";
import { CustomKTIcon } from "@presentation/components";
import { useLocaleFormate } from "@presentation/hooks";

const DrawerBundles = () => {
  const { content: Content, resetContent } = useBundleContentStore();
  const Selected = useLocaleFormate("Select Bundles");
  return (
    <div
      id="kt_drawer_bundles"
      className="bg-body"
      data-kt-drawer="true"
      data-kt-drawer-name="bundles"
      data-kt-drawer-activate="true"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'900px', 'md': '900px'}"
      data-kt-drawer-direction="end"
      data-kt-drawer-toggle="#kt_drawer_bundles_toggle"
      data-kt-drawer-close="#kt_drawer_bundles_close"
    >
      <div className="card w-100 rounded-0" id="kt_drawer_bundles_messenger">
        <div
          className="card-header pe-5"
          id="kt_drawer_bundles_messenger_header"
        >
          <div className="card-title">
            <div className="d-flex justify-content-center flex-column me-3">
              <a
                href="#"
                className="fs-4 fw-bolder text-gray-900 text-hover-primary me-1 mb-2 lh-1"
              >
                {Selected}
              </a>
            </div>
          </div>

          <div className="card-toolbar">
            <div
              className="btn btn-sm btn-icon btn-active-light-primary"
              id="kt_drawer_bundles_close"
              onClick={resetContent}
            >
              <CustomKTIcon iconName="cross" className="fs-2" />
            </div>
          </div>
        </div>
        <div className="tw-px-10  tw-p-4">{Content}</div>
      </div>
    </div>
  );
};

export default DrawerBundles;
