import { FC } from "react";

type Props = {
  data: (string | number)[];
};

const CustomClassCell: FC<Props> = ({ data }) => {
  return (
    <div className="d-flex flex-wrap gap-1 align-items-start">
      {data.map((cls, index) => (
        <span
          key={index}
          className="badge rounded-pill bg-primary text-light mb-1"
          style={{ width: "auto", padding: "0.5rem 1rem", textAlign: "center" }}
        >
          {cls}
        </span>
      ))}
    </div>
  );
};

export default CustomClassCell;
