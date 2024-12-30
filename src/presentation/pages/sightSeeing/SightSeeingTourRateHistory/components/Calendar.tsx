import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import {
  DayHeaderContentArg,
  EventClickArg,
  EventContentArg,
  EventInput,
} from "@fullcalendar/core/index.js";
import { ISightSeeingTourRateData } from "@domain/entities";
import { useMemo, useState } from "react";
import moment from "moment";
import { CustomModal } from "@presentation/components";
import { formatFromUtcToLocale } from "@presentation/helpers/DateFormater/formatDate";
import RatesDetailsAffectingOnDay from "./RatesDetailsAffectingOnDay";

interface IPropsCalendar {
  SightSeeingTourRateData: ISightSeeingTourRateData[];
}
const Calendar = ({ SightSeeingTourRateData }: IPropsCalendar) => {
  const [ratesPerDay, setRatesPerDay] = useState<ISightSeeingTourRateData[]>(
    []
  );
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isModalopen, setIsModalOpen] = useState<boolean>(false);
  const rates = useMemo(() => {
    let eventGuid = 0;

    function createEventId() {
      return String(eventGuid++);
    }
    const dictionary: Record<string, EventInput> = {};
    SightSeeingTourRateData.forEach((rate) => {
      const startDate = moment(
        formatFromUtcToLocale(rate.fromDate, "YYYY-MM-DD HH:mm")
      );
      const endDate = moment(
        formatFromUtcToLocale(rate.toDate, "YYYY-MM-DD HH:mm")
      );

      const currentDate = startDate!.clone();

      while (currentDate.isSameOrBefore(endDate)) {
        const dayOfYear = currentDate.dayOfYear();

        if (dictionary[dayOfYear] !== undefined) {
          const existingEvent = dictionary[dayOfYear];
          const isNewRateMoreRecent = moment(rate.creationDateUtc).isAfter(
            moment(existingEvent.extendedProps?.activeRate.creationDateUtc)
          );
          dictionary[dayOfYear] = {
            ...existingEvent,
            extendedProps: {
              numberOfEffect:
                (existingEvent.extendedProps?.numberOfEffect || 0) + 1,
              rates: [...(existingEvent.extendedProps?.rates || []), rate],
              activeRate: isNewRateMoreRecent
                ? rate
                : existingEvent.extendedProps?.activeRate,
            },
          };
        } else {
          dictionary[dayOfYear] = {
            id: createEventId(),
            title: rate.translations[0].name,
            start: currentDate.toDate(),
            extendedProps: {
              numberOfEffect: 1,
              activeRate: rate,
              rates: [rate],
            },
          };
        }
        currentDate.add(1, "day");
      }
    });
    return Object.values(dictionary);
  }, [SightSeeingTourRateData]);

  function handleEventClick(clickInfo: EventClickArg) {
    setRatesPerDay(clickInfo.event.extendedProps.rates);
    setModalTitle(moment(clickInfo.event.start!).format("YYYY-MM-DD"));
    setIsModalOpen(true);
  }

  return (
    <div className="">
      <FullCalendar
        plugins={[dayGridPlugin, multiMonthPlugin]}
        headerToolbar={{
          left: "prevYear,prev,next,nextYear,today",
          center: "title",
          right: "multiMonthYear,dayGridMonth",
        }}
        initialView="dayGridMonth"
        initialEvents={rates}
        eventContent={renderEventContent}
        dayHeaderContent={renderHeaderContent}
        eventClick={(e) => handleEventClick(e)}
        dayHeaderClassNames="border-5 text-light-info"
        dayCellClassNames="border-5"
        eventClassNames="d-block"
        dayMaxEventRows={1}
      />
      {isModalopen && (
        <CustomModal
          modalTitle={modalTitle}
          modalSize={"lg"}
          onClick={() => setIsModalOpen(false)}
        >
          <RatesDetailsAffectingOnDay ratesPerDay={ratesPerDay} />
        </CustomModal>
      )}
    </div>
  );
};

function renderHeaderContent(DayHeaderContentArg: DayHeaderContentArg) {
  return (
    <span>
      <b className=" fw-boldest fs-6 d-block text-center mb-5">
        {DayHeaderContentArg.text}
      </b>
    </span>
  );
}
function renderEventContent(eventInfo: EventContentArg) {
  return (
    <div className="d-flex flex-column w-full p-2">
      <b className="text-muted fw-semibold d-block text-center mb-5">
        {eventInfo.event.title}
      </b>
      <div className="d-flex flex-wrap justify-content-between">
        <div className="d-flex align-items-center gap-5 ">
          <span className="bullet bullet-vertical h-30px bg-info"></span>
          <div className="flex-grow-1">
            <span className="text-muted fw-semibold d-block">Cost</span>
            <a
              href="#"
              className="text-gray-800 text-hover-primary fw-bold fs-6"
            >
              {eventInfo.event?.extendedProps?.activeRate?.adultCost}
            </a>
          </div>
        </div>
        <div className="d-flex align-items-center gap-5 ">
          <span className="bullet bullet-vertical h-30px bg-success"></span>
          <div className="flex-grow-1">
            <span className="text-muted fw-semibold d-block">Markup</span>
            <a
              href="#"
              className="text-gray-800 text-hover-primary fw-bold fs-6"
            >
              {eventInfo.event?.extendedProps?.activeRate?.adultMarkup}
            </a>
          </div>
        </div>
        <button
          className="badge badge-secondary btn  p-2 rounded align-self-center"
          data-bs-toggle="tooltip"
          data-bs-trigger="hover"
          title="Number of rates affecting on this day "
        >
          {eventInfo.event.extendedProps.numberOfEffect}
        </button>
      </div>
    </div>
  );
}

export default Calendar;
