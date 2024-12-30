export const SelectChannel: string[] = [
    "DDL-SELECT_ONLINE_DC",
    "DDL-SELECT_BO_DC",
    "DDL-SELECT_BO_SA",
]

export const Services: string[] = [
    "DDL-SERVICES_HOTEL",
    "DDL-SERVICES_PACKAGE",
    "DDL-SERVICES_SIGHT_SEEING",
    "DDL-SERVICES_TRANSFER",
    "DDL-SERVICES_FLIGHT_HOTEL",
    "DDL-SERVICES_HOLIDAYS",
    "DDL-SERVICES_FLIGHT",
]

export const Type: string[] = [
    "DDL-TYPE_REFUND",
    "DDL-TYPE_CANCEL",
    "DDL-TYPE_CHANGE",
]

export interface ColourOption {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
  }
export const colourOptions: readonly ColourOption[] = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
  ];
