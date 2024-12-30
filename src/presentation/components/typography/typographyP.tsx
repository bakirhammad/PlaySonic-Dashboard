import clsx from "clsx";
import React, { FC } from "react";

interface Props extends React.HtmlHTMLAttributes<HTMLParagraphElement> {
  text: string | undefined;
}

const TypographyP: FC<Props> = ({ text, ...props }) => {
  return (
    <p
      className={clsx(props.className, "tw-font-medium tw-text-base ")}
      {...props}
    >
      {text}
    </p>
  );
};

export default TypographyP;
