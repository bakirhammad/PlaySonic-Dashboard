import { FC } from "react";

type Props = {
  data: (string | number)[];
};

const CustomFlightsCell: FC<Props> = ({ data }) => {
  return (
    <ul className="d-flex flex-column p-0">
      {data.map((flight, index) => (
        <li key={index} className="text-gray-800 text-hover-primary mb-1">
          {flight}
        </li>
      ))}
    </ul>
  );
};

export default CustomFlightsCell;
