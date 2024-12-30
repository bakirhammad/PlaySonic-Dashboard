import clsx from "clsx";
import React, { FC } from "react";

interface Props extends React.HtmlHTMLAttributes<HTMLHeadElement> {
  text: string | undefined;
  span?: string;
}

export const TypographyH1: FC<Props> = ({ text, span, ...props }) => {
  return (
    <h1
      {...props}
      className={clsx(
        "tw-scroll-m-20 tw-text-4xl tw-font-extrabold tw-tracking-tight tw-lg:text-5xl",
        props.className
      )}
    >
      {text} <span className="text-primary">{span}</span>
    </h1>
  );
};
