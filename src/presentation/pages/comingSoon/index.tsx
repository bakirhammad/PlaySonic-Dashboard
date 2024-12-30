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
    <div>
      <div
        className="d-flex justify-items-center align-items-center"
        style={{ pointerEvents: "none" }}
      >
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>
      <div className="d-flex justify-items-center align-items-center flex-column">
        <h1 className="coming-soon-title text-center">Coming Soon 😊</h1>
        <Link to={"/"}>
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="btn mt-6"
          >
            🔙 Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
