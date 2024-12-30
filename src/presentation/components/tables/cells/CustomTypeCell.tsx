import { FC } from "react";

type Props = {
  data: (string | number)[];
};

const CustomTypeCell: FC<Props> = ({ data }) => {
  return (
    <div className="d-flex flex-column align-items-start">
      {data.map((type, index) => (
        <span
          key={index}
          className="badge rounded-pill bg-primary text-light mb-1"
          style={{ width: "auto", padding: "0.5rem 1rem", textAlign: "center" }}
        >
          {type}
        </span>
      ))}
    </div>
  );
};

export default CustomTypeCell;
