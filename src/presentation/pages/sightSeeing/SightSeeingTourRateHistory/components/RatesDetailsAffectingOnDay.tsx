import { ISightSeeingTourRateData } from "@domain/entities";
import { formatFromUtcToLocale } from "@presentation/helpers/DateFormater/formatDate";
import moment from "moment";

interface IProps {
  ratesPerDay: ISightSeeingTourRateData[];
}

export default function RatesDetailsAffectingOnDay({ ratesPerDay }: IProps) {
  const sortedRatesPerDay = ratesPerDay.sort((a, b) =>
    moment(b.creationDateUtc).diff(moment(a.creationDateUtc))
  );

  return sortedRatesPerDay.map((rate, index) => {
    const startDate = formatFromUtcToLocale(rate.fromDate, "YYYY-MM-DD");

    const endDate = formatFromUtcToLocale(rate.toDate, "YYYY-MM-DD");

    return (
      <div key={index} className="card mb-4">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">{rate.translations[0].name}</h5>
            <p className="mb-0 text-muted small">{`${startDate} / ${endDate}`}</p>
          </div>
          <div className="text-end small text-muted">
            <p className="mb-0">Created by : {rate.createdByUserId}</p>
            <p className="mb-0">
              Created on :{" "}
              {formatFromUtcToLocale(rate.creationDateUtc, "YYYY-MM-DD HH:mm")}
            </p>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Adult Rates */}
            <div className="col-md-6 mb-3">
              <h6 className="">Adult Rates</h6>
              <div className="bg-light p-3 rounded">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="mb-1 text-muted small">Cost</p>
                    <p className="mb-0 fw-semibold">{rate.adultCost}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted small">Markup</p>
                    <p className="mb-0 fw-semibold">{rate.adultMarkup}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Child Rates */}
            <div className="col-md-6 mb-3">
              <h6 className="">Child Rates</h6>
              {rate.children.map(({ childCost, childMarkup }, idx) => (
                <div key={idx} className="bg-light p-3 rounded mb-2">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="mb-1 text-muted small">Cost {idx + 1}</p>
                      <p className="mb-0 fw-semibold">{childCost}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-muted small">Markup {idx + 1}</p>
                      <p className="mb-0 fw-semibold">{childMarkup}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  });
}
