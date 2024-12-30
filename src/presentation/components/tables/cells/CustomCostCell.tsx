interface IProps {
  adultCost: number;
  childCost: number;
  infanCost?: number;
}

export default function CustomCostCell({
  adultCost,
  childCost,
  infanCost,
}: IProps) {
  return (
    <div className="d-flex align-items-center">
      <div className="d-flex gap-5">
        <div className="d-flex flex-column align-items-center border border-secondary p-2 rounded">
          <span className="text-gray-800 text-hover-primary mb-1 font-weight-bold">
            Adult
          </span>
          <span className="text-gray-800">{adultCost.toFixed(2)}</span>
        </div>
        <div className="d-flex flex-column align-items-center border border-secondary p-2 rounded">
          <span className="text-gray-800 text-hover-primary mb-1 font-weight-bold">
            Child
          </span>
          <span className="text-gray-800">{childCost.toFixed(2)}</span>
        </div>
        {infanCost && (
          <div className="d-flex flex-column align-items-center border border-secondary p-2 rounded">
            <span className="text-gray-800 text-hover-primary mb-1 font-weight-bold">
              Infan
            </span>
            <span className="text-gray-800">{infanCost?.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
