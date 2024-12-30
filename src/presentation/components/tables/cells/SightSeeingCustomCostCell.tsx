interface IProps {
  cost: number;
  markup: number;
}

export default function SightSeeingCustomCostCell({ cost, markup }: IProps) {
  return (
    <div className="d-flex align-items-center">
      <div className="d-flex gap-5">
        <div className="d-flex flex-column align-items-center border border-secondary p-2 rounded">
          <span className="text-gray-800 text-hover-primary mb-1 font-weight-bold">
            Cost
          </span>
          <span className="text-gray-800">{cost.toFixed(2)}</span>
        </div>
        <div className="d-flex flex-column align-items-center border border-secondary p-2 rounded">
          <span className="text-gray-800 text-hover-primary mb-1 font-weight-bold">
            Markup
          </span>
          <span className="text-gray-800">{markup.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
