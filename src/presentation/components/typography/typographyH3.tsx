import clsx from "clsx";
import React, { FC } from "react";

interface Props extends React.HtmlHTMLAttributes<HTMLHeadElement> {
  text: string | undefined;
  span?: string;
}

export const TypographyH3: FC<Props> = ({ text, span, ...props }) => {
  return (
    <h3
      {...props}
      className={clsx(
        "tw-scroll-m-20 tw-text-xl tw-font-semibold tw-tracking-tight tw-lg:text-2xl",
        props.className
      )}
    >
      {text} <span className="text-primary">{span}</span>
    </h3>
  );
};
