/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMyCourt } from "@domain/entities/Court/Court";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const CustomTemplate: FC<any> = ({ courtData }) => {
  const navigate = useNavigate();
  const image =
    "https://media.istockphoto.com/id/1363976548/photo/paddle-tennis-racket-and-balls-on-the-blue-paddle-court.jpg?s=612x612&w=0&k=20&c=yxbb5H6rbALy_YG5awOHCRyn7Ge02SQL8SwAcbeKIwA=";
  return (
    <div className="tw-m-auto tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 2xl:tw-grid-cols-7 3xl:tw-grid-cols-8 tw-gap-7 p-6">
      {courtData?.map((court: IMyCourt) => {
        return (
          <div
            className="tw-w-64 tw-cursor-pointer"
            onClick={() => navigate(`/apps/viewcourt/${court.id}`)}
          >
            <div className="tw-rounded-t-lg tw-shadow-lg">
              <img className="tw-rounded-t-lg" src={image} />
            </div>
            <div className="tw-bg-zinc-100 d-flex tw-flex-col tw-justify-between pt-3 ps-2 tw-rounded-b-lg tw-shadow-md tw-h-28">
              <h5>{court.name}</h5>
              <p>{court.indoor ? "Indoor" : "Outdoor"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomTemplate;
