import Lottie from "react-lottie";
import animationData from "../../../../public/media/lottie/ComingSoon.json";
import "../../../assets/sass/core/components/comingSoon/_comingSoon.scss";
import { Link, useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const navigate = useNavigate();
  return (
    <div className="d-flex tw-flex-col tw-justify-center tw-items-center tw-h-full tw-text-center">
      <h1 className="coming-soon-title">Coming Soon 😊</h1>
      <Link to={"/"}>
        <button
          onClick={() => {
            navigate("/app");
          }}
          className="btn mt-6"
        >
          🔙 Back
        </button>
      </Link>
    </div>
  );
};

export default ComingSoon;
