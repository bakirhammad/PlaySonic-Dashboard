import { useEffect } from "react";
import "@assets/tailwind/tailwind.css";

const TailwindWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.body.classList.add("tailwind-page");

    return () => {
      document.body.classList.remove("tailwind-page");
    };
  }, []);

  return <div className="tw-w-full">{children}</div>;
};

export default TailwindWrapper;
