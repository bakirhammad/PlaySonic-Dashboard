import { IReservationData } from "@domain/entities/Reservation/Reservation";
import { formatFromUtcToLocale } from "@presentation/helpers/DateFormater/formatDate";

interface IProps {
  reservationPerDay: IReservationData[];
}

export default function ReservaionsDetailsAffectingOnDay({
  reservationPerDay,
}: IProps) {
  return (
    <>
      {reservationPerDay.map((reservation, index) => {
        console.log(reservation,"deede")
        const startDate = formatFromUtcToLocale(
          reservation.reservationDate,
          "YYYY-MM-DD"
        );
        const endDate = formatFromUtcToLocale(
          reservation.reservationDate,
          "YYYY-MM-DD"
        );

        return (
          <div key={index} className="card mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{reservation.name}</h5>
                <p className="mb-0 text-muted small">{`${startDate} / ${endDate}`}</p>
              </div>
              <div className="text-end small text-muted">
                <p className="mb-0">Created by: {reservation.name}</p>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3 h-350px">
                  <h6 className="">Adult reservations</h6>
                  {reservationPerDay.map((reservation, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between bg-light p-3 mb-3 rounded"
                    >
                      <div>
                        <p className="mb-1 text-muted small">Type</p>
                        <p className="mb-0 fw-semibold">{reservation.name}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-muted small">Cost</p>
                        <p className="mb-0 fw-semibold">
                          {reservation.courtId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
