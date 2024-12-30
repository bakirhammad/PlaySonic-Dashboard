import { useState } from "react";

const useToggle = () => {
  const [toggle, setToggle] = useState<boolean>(false);

  const toggleHandler = () => {
    setToggle((prev) => !prev);
  };

  return { toggle, toggleHandler, setToggle };
};

export default useToggle;
